import streamlit as st
import pandas as pd
import google.generativeai as genai
import time
import uuid
from datetime import datetime
import plotly.express as px

# --- 1. CONFIGURATION & SETUP ---
st.set_page_config(
    page_title="Doh Sar Pay - Modern Bookstore",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for styling
st.markdown("""
<style>
    .book-card {
        background-color: #ffffff;
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: transform 0.2s;
        text-align: center;
        height: 100%;
    }
    .book-card:hover {
        transform: scale(1.02);
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
    }
    .price-tag {
        color: #E63946;
        font-weight: bold;
        font-size: 1.2em;
    }
    .original-price {
        text-decoration: line-through;
        color: #999;
        font-size: 0.9em;
    }
    .stButton>button {
        border-radius: 20px;
    }
    .block-container {
        padding-top: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# --- 2. INITIAL MOCK DATA ---
if 'books' not in st.session_state:
    st.session_state.books = [
        {
            "id": 1, "title": "Linga Dipa Chit Thu", "author": "Chit Oo Nyo", "price": 4500, "originalPrice": 5000,
            "category": "Novels & Fiction", "rating": 4.9, "coverUrl": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "A legendary historical novel retelling the Ramayana from the perspective of Ravana (Dasagiri)."
        },
        {
            "id": 2, "title": "Mone Ywe Ma Hu", "author": "Journal Kyaw Ma Ma Lay", "price": 3500, "originalPrice": 0,
            "category": "Novels & Fiction", "rating": 4.8, "coverUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "A classic Burmese novel depicting the cultural clash between traditional Burmese values and Western influence."
        },
        {
            "id": 3, "title": "The Glass Palace", "author": "Amitav Ghosh", "price": 12000, "originalPrice": 15500,
            "category": "History & Politics", "rating": 4.7, "coverUrl": "https://images.unsplash.com/photo-1599579085896-12683930b2c1?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "An epic saga spanning a century, from the fall of the Konbaung Dynasty in Mandalay to modern times."
        },
        {
            "id": 4, "title": "Burmese Snacks", "author": "Daw Yi Yi", "price": 2500, "originalPrice": 0,
            "category": "Health & Cooking", "rating": 4.5, "coverUrl": "https://images.unsplash.com/photo-1601342630318-7c631a31dc52?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "Learn to make classic Myanmar snacks like Mohinga, Lahpet Thoke, and Shwe Yin Aye."
        },
        {
            "id": 5, "title": "Dhammapada Verses", "author": "Ashin Janakabhivamsa", "price": 1500, "originalPrice": 1800,
            "category": "Religion & Dhamma", "rating": 5.0, "coverUrl": "https://images.unsplash.com/photo-1621845199651-7f4c519543e9?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "A collection of sayings of the Buddha in verse form."
        },
        {
            "id": 6, "title": "The Lizard Cage", "author": "Karen Connelly", "price": 5500, "originalPrice": 6000,
            "category": "Novels & Fiction", "rating": 4.6, "coverUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
            "description": "Set in a Burmese prison, this powerful novel tells the story of Teza, a singer imprisoned for his protest songs."
        }
    ]

if 'cart' not in st.session_state:
    st.session_state.cart = []

if 'orders' not in st.session_state:
    st.session_state.orders = [
        {"id": "ORD-8823", "user": "John Doe", "date": "2023-11-15", "total": 4500, "status": "completed", "address": "Yangon"},
        {"id": "ORD-8824", "user": "Sarah Smith", "date": "2023-11-16", "total": 12000, "status": "pending", "address": "Mandalay"},
    ]

if 'user' not in st.session_state:
    st.session_state.user = None  # {'username': 'admin', 'role': 'admin'}

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# --- 3. HELPER FUNCTIONS ---

def login(username, password):
    if username == "admin" and password == "admin123":
        st.session_state.user = {"username": "admin", "role": "admin", "name": "System Administrator"}
        st.rerun()
    elif username == "user" and password == "1234":
        st.session_state.user = {"username": "user", "role": "user", "name": "John Doe"}
        st.rerun()
    else:
        st.error("Invalid credentials. Try (admin/admin123) or (user/1234)")

def logout():
    st.session_state.user = None
    st.rerun()

def add_to_cart(book):
    # Check if item exists
    for item in st.session_state.cart:
        if item['id'] == book['id']:
            item['quantity'] += 1
            st.toast(f"Updated quantity for {book['title']}", icon="🛒")
            return
    # Add new item
    st.session_state.cart.append({**book, "quantity": 1})
    st.toast(f"Added {book['title']} to cart", icon="🛒")

def remove_from_cart(book_id):
    st.session_state.cart = [item for item in st.session_state.cart if item['id'] != book_id]
    st.rerun()

def place_order(name, address, payment_method):
    total = sum(item['price'] * item['quantity'] for item in st.session_state.cart)
    new_order = {
        "id": f"ORD-{uuid.uuid4().hex[:4].upper()}",
        "user": st.session_state.user['name'] if st.session_state.user else name,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total": total,
        "status": "pending",
        "address": address,
        "payment": payment_method,
        "items": len(st.session_state.cart)
    }
    st.session_state.orders.insert(0, new_order)
    st.session_state.cart = []
    return new_order['id']

# --- 4. SIDEBAR NAVIGATION ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/2232/2232688.png", width=50)
    st.title("Doh Sar Pay")
    
    # Auth Status
    if st.session_state.user:
        st.success(f"Hi, {st.session_state.user['name']}")
        if st.button("Logout", icon="🚪"):
            logout()
    else:
        with st.expander("🔐 Login", expanded=False):
            u = st.text_input("Username")
            p = st.text_input("Password", type="password")
            if st.button("Sign In"):
                login(u, p)
            st.caption("Demo: admin/admin123 or user/1234")

    st.markdown("---")
    
    page = st.radio("Navigation", ["🏠 Home", "🛍️ Cart", "🤖 AI Chatbot", "🛡️ Admin Panel"])
    
    st.markdown("---")
    if st.session_state.cart:
        total_items = sum(item['quantity'] for item in st.session_state.cart)
        st.info(f"🛒 Cart: {total_items} items")

# --- 5. PAGE: HOME ---
if page == "🏠 Home":
    # Hero Section
    st.markdown("## Trending Now 🔥")
    
    # Simple Marquee effect mockup (Static horizontal scroll in Streamlit)
    cols = st.columns(4)
    for i, book in enumerate(st.session_state.books[:4]):
        with cols[i]:
            st.image(book['coverUrl'], use_container_width=True)
            st.caption(book['title'])

    st.markdown("---")
    
    # Filters
    col1, col2 = st.columns([3, 1])
    with col1:
        search = st.text_input("🔍 Search books...", label_visibility="collapsed", placeholder="Search titles or authors")
    with col2:
        categories = ["All"] + list(set(b['category'] for b in st.session_state.books))
        cat_filter = st.selectbox("Category", categories, label_visibility="collapsed")

    # Filter Logic
    filtered_books = st.session_state.books
    if cat_filter != "All":
        filtered_books = [b for b in filtered_books if b['category'] == cat_filter]
    if search:
        filtered_books = [b for b in filtered_books if search.lower() in b['title'].lower() or search.lower() in b['author'].lower()]

    # Grid Display
    st.markdown(f"### Books Collection ({len(filtered_books)})")
    
    # Create grid rows
    cols_per_row = 4
    for i in range(0, len(filtered_books), cols_per_row):
        cols = st.columns(cols_per_row)
        for j in range(cols_per_row):
            if i + j < len(filtered_books):
                book = filtered_books[i + j]
                with cols[j]:
                    with st.container(border=True):
                        st.image(book['coverUrl'], use_container_width=True)
                        st.markdown(f"**{book['title']}**")
                        st.caption(book['author'])
                        
                        price_html = f'<span class="price-tag">฿{book["price"]:,}</span>'
                        if book.get('originalPrice', 0) > book['price']:
                            price_html += f' <span class="original-price">฿{book["originalPrice"]:,}</span>'
                        st.markdown(price_html, unsafe_allow_html=True)
                        
                        if st.button("Add to Cart", key=f"add_{book['id']}", use_container_width=True):
                            add_to_cart(book)

# --- 6. PAGE: CART ---
elif page == "🛍️ Cart":
    st.title("Shopping Cart")

    if not st.session_state.cart:
        st.empty()
        st.markdown("""
        <div style="text-align: center; padding: 50px;">
            <h2>Your cart is empty 😔</h2>
            <p>Go back to home and find some amazing books!</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        col1, col2 = st.columns([2, 1])
        
        with col1:
            total_price = 0
            for item in st.session_state.cart:
                with st.container(border=True):
                    c1, c2, c3, c4 = st.columns([1, 3, 1, 1])
                    c1.image(item['coverUrl'], width=60)
                    with c2:
                        st.subheader(item['title'])
                        st.caption(item['author'])
                    with c3:
                        st.write(f"Qty: {item['quantity']}")
                        st.write(f"**฿{item['price'] * item['quantity']:,}**")
                    with c4:
                        if st.button("Remove", key=f"del_{item['id']}"):
                            remove_from_cart(item['id'])
                total_price += item['price'] * item['quantity']

        with col2:
            with st.container(border=True):
                st.subheader("Order Summary")
                st.write(f"Subtotal: **฿{total_price:,}**")
                st.write("Shipping: **Free**")
                st.markdown("---")
                st.markdown(f"### Total: ฿{total_price:,}")
                
                st.subheader("Checkout Details")
                with st.form("checkout_form"):
                    name = st.text_input("Full Name", value=st.session_state.user['name'] if st.session_state.user else "")
                    address = st.text_area("Shipping Address", placeholder="123 Sule Pagoda Rd, Yangon")
                    payment = st.selectbox("Payment Method", ["PromptPay (QR)", "TrueMoney", "COD", "Credit Card"])
                    
                    submitted = st.form_submit_button("Place Order", type="primary", use_container_width=True)
                    
                    if submitted:
                        if not name or not address:
                            st.error("Please fill in name and address.")
                        else:
                            order_id = place_order(name, address, payment)
                            st.balloons()
                            st.success(f"Order placed successfully! ID: {order_id}")
                            time.sleep(2)
                            st.rerun()

# --- 7. PAGE: ADMIN PANEL ---
elif page == "🛡️ Admin Panel":
    # Access Control
    if not st.session_state.user or st.session_state.user['role'] != 'admin':
        st.error("⛔ Access Denied. Admin login required.")
        st.stop()

    st.title("Admin Dashboard")
    
    tabs = st.tabs(["📊 Overview", "📦 Inventory", "🧾 Orders"])
    
    # DASHBOARD OVERVIEW
    with tabs[0]:
        total_sales = sum(o['total'] for o in st.session_state.orders)
        col1, col2, col3 = st.columns(3)
        col1.metric("Total Revenue", f"฿{total_sales:,}", "+12%")
        col2.metric("Total Orders", len(st.session_state.orders), "+5")
        col3.metric("Total Books", len(st.session_state.books), "Active")
        
        # Simple Chart
        if len(st.session_state.orders) > 0:
            df_orders = pd.DataFrame(st.session_state.orders)
            fig = px.bar(df_orders, x='user', y='total', title="Sales by Customer", color='status')
            st.plotly_chart(fig, use_container_width=True)

    # INVENTORY MANAGEMENT
    with tabs[1]:
        st.subheader("Manage Books")
        
        # Add New Book Expander
        with st.expander("➕ Add New Book"):
            with st.form("add_book_form"):
                n_title = st.text_input("Title")
                n_author = st.text_input("Author")
                n_price = st.number_input("Price", min_value=0)
                n_cat = st.selectbox("Category", ["Novels & Fiction", "History", "Children", "Cooking"])
                n_img = st.text_input("Image URL", value="https://placehold.co/300x450")
                if st.form_submit_button("Save Book"):
                    new_id = max(b['id'] for b in st.session_state.books) + 1
                    st.session_state.books.append({
                        "id": new_id, "title": n_title, "author": n_author, "price": n_price,
                        "category": n_cat, "coverUrl": n_img, "rating": 0, "description": ""
                    })
                    st.success("Book added!")
                    st.rerun()

        # Edit Table
        df_books = pd.DataFrame(st.session_state.books)
        edited_df = st.data_editor(
            df_books, 
            column_config={
                "coverUrl": st.column_config.ImageColumn("Cover"),
                "price": st.column_config.NumberColumn("Price (฿)")
            },
            use_container_width=True,
            num_rows="dynamic"
        )

    # ORDER MANAGEMENT
    with tabs[2]:
        st.subheader("Recent Orders")
        df_orders_view = pd.DataFrame(st.session_state.orders)
        st.dataframe(df_orders_view, use_container_width=True)

# --- 8. PAGE: AI CHATBOT ---
elif page == "🤖 AI Chatbot":
    st.title("Chat with Nong Read 🤖")
    st.caption("Your AI Assistant for Book Recommendations & Shipping Info")

    # API Key check
    api_key = None
    try:
        api_key = st.secrets["GOOGLE_API_KEY"]
    except:
        st.error("API Key missing in .streamlit/secrets.toml")
    
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Display chat history
        for msg in st.session_state.chat_history:
            with st.chat_message(msg["role"]):
                st.markdown(msg["text"])
        
        # Chat Input
        if prompt := st.chat_input("Ask about books, payment, or shipping..."):
            # 1. User Message
            st.session_state.chat_history.append({"role": "user", "text": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            
            # 2. AI Response
            with st.chat_message("assistant"):
                try:
                    # System Context
                    context = """
                    You are Nong Read, a friendly AI assistant for "Doh Sar Pay" bookstore.
                    We sell Burmese books, novels, history, and snacks.
                    Payment methods: PromptPay, TrueMoney, COD.
                    Shipping: 3-5 days standard.
                    Currency: Thai Baht (THB).
                    Be polite and helpful.
                    """
                    
                    full_prompt = f"{context}\n\nUser: {prompt}"
                    
                    response = model.generate_content(full_prompt)
                    st.markdown(response.text)
                    st.session_state.chat_history.append({"role": "assistant", "text": response.text})
                except Exception as e:
                    st.error(f"Error: {e}")
