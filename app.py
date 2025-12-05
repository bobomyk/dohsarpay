import streamlit as st
import pandas as pd
import google.generativeai as genai
import time
import uuid
from datetime import datetime

# --- 1. CONFIGURATION & STYLING ---
st.set_page_config(
    page_title="Doh Sar Pay",
    page_icon="📚",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to mimic the React/Tailwind Design
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Prompt', sans-serif;
        color: #1D3557;
    }
    
    /* Colors */
    :root {
        --primary: #E63946;
        --secondary: #457B9D;
        --dark: #1D3557;
        --bg-gray: #F9FAFB;
    }

    /* Hide Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    .stApp {
        background-color: var(--bg-gray);
    }

    /* Navbar Style */
    .navbar {
        background: white;
        padding: 1rem 2rem;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        z-index: 999;
        margin: -4rem -4rem 1rem -4rem; 
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }

    /* Book Card Style */
    .book-card-container {
        background: white;
        border-radius: 16px;
        padding: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        border: 1px solid #f3f4f6;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .book-card-container:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .book-cover {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 12px;
    }
    .book-title {
        font-weight: 700;
        font-size: 1rem;
        color: #1D3557;
        margin-bottom: 4px;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    .book-author {
        font-size: 0.85rem;
        color: #6B7280;
        margin-bottom: 8px;
    }
    .price-row {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .price {
        color: #1D3557;
        font-weight: 700;
        font-size: 1.1rem;
    }
    .original-price {
        text-decoration: line-through;
        color: #9CA3AF;
        font-size: 0.8rem;
        margin-right: 6px;
    }
    .discount-badge {
        background-color: #EF4444;
        color: white;
        font-size: 0.7rem;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 999px;
        position: absolute;
        top: 8px;
        left: 8px;
    }
    
    /* Button Styles */
    .stButton > button {
        border-radius: 12px;
        font-weight: 600;
        border: none;
        transition: all 0.2s;
    }
    .stButton > button:hover {
        transform: scale(1.02);
    }
    /* Primary Button */
    .primary-btn button {
        background-color: #1D3557 !important;
        color: white !important;
    }
    /* Action Button (Add to Cart) */
    .action-btn button {
        background-color: #E63946 !important;
        color: white !important;
        width: 100%;
    }

    /* Horizontal Scroll Container */
    .horizontal-scroll {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding: 10px 4px 20px 4px;
        scrollbar-width: thin;
        -webkit-overflow-scrolling: touch;
    }
    .horizontal-scroll::-webkit-scrollbar {
        height: 6px;
    }
    .horizontal-scroll::-webkit-scrollbar-thumb {
        background-color: #CBD5E1;
        border-radius: 3px;
    }
    .h-item {
        min-width: 160px;
        max-width: 160px;
    }
</style>
""", unsafe_allow_html=True)

# --- 2. DATA INITIALIZATION ---

# Exact copy of the Book data from App.tsx
INITIAL_BOOKS = [
  {
    "id": 1,
    "title": "Linga Dipa Chit Thu",
    "author": "Chit Oo Nyo",
    "price": 4500,
    "originalPrice": 5000,
    "category": "Novels & Fiction",
    "rating": 4.9,
    "coverUrl": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A legendary historical novel retelling the Ramayana from the perspective of Ravana (Dasagiri). It explores deep emotions, love, and the complexity of the villain's heart."
  },
  {
    "id": 2,
    "title": "Mone Ywe Ma Hu",
    "author": "Journal Kyaw Ma Ma Lay",
    "price": 3500,
    "category": "Novels & Fiction",
    "rating": 4.8,
    "coverUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A classic Burmese novel depicting the cultural clash between traditional Burmese values and Western influence during the colonial era."
  },
  {
    "id": 3,
    "title": "The Glass Palace",
    "author": "Amitav Ghosh",
    "price": 12000,
    "originalPrice": 15500,
    "category": "History & Politics",
    "rating": 4.7,
    "coverUrl": "https://images.unsplash.com/photo-1599579085896-12683930b2c1?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "An epic saga spanning a century, from the fall of the Konbaung Dynasty in Mandalay to modern times."
  },
  {
    "id": 4,
    "title": "Burmese Traditional Snacks",
    "author": "Daw Yi Yi",
    "price": 2500,
    "category": "Health & Cooking",
    "rating": 4.5,
    "coverUrl": "https://images.unsplash.com/photo-1601342630318-7c631a31dc52?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "Learn to make classic Myanmar snacks like Mohinga, Lahpet Thoke, and Shwe Yin Aye."
  },
  {
    "id": 5,
    "title": "Dhammapada Verses",
    "author": "Ashin Janakabhivamsa",
    "price": 1500,
    "originalPrice": 1800,
    "category": "Religion & Dhamma",
    "rating": 5.0,
    "coverUrl": "https://images.unsplash.com/photo-1621845199651-7f4c519543e9?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A collection of sayings of the Buddha in verse form and one of the most widely read and best known Buddhist scriptures."
  },
  {
    "id": 6,
    "title": "Myanmar Folktales",
    "author": "Maung Htin Aung",
    "price": 3000,
    "category": "Children",
    "rating": 4.6,
    "coverUrl": "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A delightful collection of traditional folktales from the villages of Myanmar."
  },
  {
    "id": 7,
    "title": "The Lizard Cage",
    "author": "Karen Connelly",
    "price": 5500,
    "originalPrice": 6000,
    "category": "Novels & Fiction",
    "rating": 4.6,
    "coverUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "Set in a Burmese prison, this powerful novel tells the story of Teza, a singer imprisoned for his protest songs."
  },
   {
    "id": 8,
    "title": "Miss Burma",
    "author": "Charmaine Craig",
    "price": 6200,
    "category": "History & Politics",
    "rating": 4.7,
    "coverUrl": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "Based on the story of the author's mother and grandparents, this novel recounts the history of modern Burma."
  },
  {
    "id": 9,
    "title": "Pyi Min Thar",
    "author": "Min Theinkha",
    "price": 2800,
    "category": "Novels & Fiction",
    "rating": 4.7,
    "coverUrl": "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A famous mystery and astrology novel by Min Theinkha."
  },
   {
    "id": 10,
    "title": "Architecture of Bagan",
    "author": "History Dept",
    "price": 15000,
    "originalPrice": 18000,
    "category": "Art & Design",
    "rating": 4.9,
    "coverUrl": "https://images.unsplash.com/photo-1552554622-6b39df280c44?auto=format&fit=crop&q=80&w=300&h=450",
    "description": "A visual journey through the thousands of temples in Bagan."
  }
]

# Initialize Session State
if 'books' not in st.session_state:
    st.session_state.books = INITIAL_BOOKS
if 'cart' not in st.session_state:
    st.session_state.cart = []
if 'page' not in st.session_state:
    st.session_state.page = 'home'
if 'selected_book' not in st.session_state:
    st.session_state.selected_book = None
if 'user' not in st.session_state:
    st.session_state.user = None
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []
if 'orders' not in st.session_state:
    st.session_state.orders = [
        {"id": "ORD-8823", "user": "John Doe", "total": 4500, "status": "completed", "date": "2023-11-15"},
        {"id": "ORD-8824", "user": "Sarah", "total": 12000, "status": "pending", "date": "2023-11-16"},
    ]

# --- 3. HELPER FUNCTIONS ---

def set_page(page_name):
    st.session_state.page = page_name
    st.rerun()

def select_book(book):
    st.session_state.selected_book = book
    st.session_state.page = 'details'
    st.rerun()

def add_to_cart(book):
    for item in st.session_state.cart:
        if item['id'] == book['id']:
            item['quantity'] += 1
            st.toast(f"Updated {book['title']} quantity.", icon="🛒")
            return
    st.session_state.cart.append({**book, 'quantity': 1})
    st.toast(f"Added {book['title']} to cart.", icon="🛒")

def login(username, password):
    if username == "admin" and password == "admin123":
        st.session_state.user = {"name": "Admin", "role": "admin"}
        st.rerun()
    elif username == "user" and password == "1234":
        st.session_state.user = {"name": "John Doe", "role": "user"}
        st.rerun()
    else:
        st.error("Invalid credentials.")

# --- 4. COMPONENTS ---

def render_navbar():
    # Simulate a navbar using columns
    col1, col2, col3, col4, col5 = st.columns([1, 4, 1, 1, 1])
    
    with col1:
        # Logo area
        st.markdown("### 📚 DSP")
    
    with col3:
        if st.button("🏠 Home", use_container_width=True):
            set_page('home')
            
    with col4:
        cart_count = sum(item['quantity'] for item in st.session_state.cart)
        label = f"🛒 Cart ({cart_count})"
        if st.button(label, use_container_width=True):
            set_page('cart')
            
    with col5:
        if st.session_state.user:
            if st.button("👤 Profile", use_container_width=True):
                if st.session_state.user['role'] == 'admin':
                    set_page('admin')
                else:
                    st.info(f"Logged in as {st.session_state.user['name']}")
        else:
            if st.button("🔐 Login", use_container_width=True):
                set_page('login')

def render_book_card(book):
    # This function renders HTML for a book card
    # We use st.markdown with HTML to get the exact look
    
    # Calculate discount
    discount_html = ""
    original_price_html = ""
    if book.get('originalPrice', 0) > book['price']:
        disc_pct = int(((book['originalPrice'] - book['price']) / book['originalPrice']) * 100)
        discount_html = f'<div class="discount-badge">-{disc_pct}%</div>'
        original_price_html = f'<span class="original-price">฿{book["originalPrice"]:,}</span>'

    card_html = f"""
    <div class="book-card-container">
        <div style="position: relative;">
            <img src="{book['coverUrl']}" class="book-cover">
            {discount_html}
        </div>
        <div class="book-title" title="{book['title']}">{book['title']}</div>
        <div class="book-author">{book['author']}</div>
        <div class="price-row">
            <div>
                {original_price_html}
                <span class="price">฿{book['price']:,}</span>
            </div>
        </div>
    </div>
    """
    st.markdown(card_html, unsafe_allow_html=True)
    
    # Buttons need to be Streamlit native to handle events properly
    col_a, col_b = st.columns([1, 1])
    with col_a:
        if st.button("View", key=f"view_{book['id']}", use_container_width=True):
            select_book(book)
    with col_b:
        # Use a specific styling class for this button via CSS hack if needed, 
        # or just standard primary style
        if st.button("Add", key=f"add_{book['id']}", type="primary", use_container_width=True):
            add_to_cart(book)

# --- 5. MAIN PAGES ---

render_navbar()

if st.session_state.page == 'home':
    # --- TRENDING SECTION (Horizontal Scroll) ---
    st.markdown("#### 🔥 Trending Now")
    
    # We can't put native buttons inside HTML markdown easily.
    # Hybrid approach: Use st.columns for standard grid, 
    # OR use a scrolling container for visual, but interaction is tricky.
    # For Streamlit "Smooth", we will use a Layout Grid for Trending.
    
    # Let's use a 5-column layout for "Trending"
    trending = st.session_state.books[:5]
    cols = st.columns(5)
    for i, book in enumerate(trending):
        with cols[i]:
            render_book_card(book)
            
    st.markdown("---")

    # --- MAIN GRID ---
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown("#### 📖 Browse Collection")
    with col2:
        category = st.selectbox("Category", ["All"] + list(set(b['category'] for b in st.session_state.books)))
    
    filtered = st.session_state.books
    if category != "All":
        filtered = [b for b in filtered if b['category'] == category]

    # Responsive Grid (4 columns)
    row_size = 4
    grid_chunks = [filtered[i:i + row_size] for i in range(0, len(filtered), row_size)]

    for chunk in grid_chunks:
        cols = st.columns(row_size)
        for i, book in enumerate(chunk):
            with cols[i]:
                render_book_card(book)

elif st.session_state.page == 'details':
    book = st.session_state.selected_book
    if book:
        st.button("← Back to Browsing", on_click=lambda: set_page('home'))
        
        c1, c2 = st.columns([1, 2])
        with c1:
            st.image(book['coverUrl'], use_container_width=True)
        with c2:
            st.markdown(f"# {book['title']}")
            st.markdown(f"**Author:** {book['author']}")
            st.markdown(f"### ฿{book['price']:,}")
            
            st.info(book['description'])
            
            st.markdown("#### Details")
            st.write(f"**Category:** {book['category']}")
            st.write(f"**Rating:** ⭐ {book['rating']}")
            
            if st.button("Add to Cart 🛒", type="primary"):
                add_to_cart(book)
                
            st.markdown("---")
            st.markdown("**Reviews**")
            st.caption("⭐⭐⭐⭐⭐ 'A masterpiece!' - Maung Maung")
            st.caption("⭐⭐⭐⭐ 'Great story.' - Aung")

elif st.session_state.page == 'cart':
    st.button("← Back", on_click=lambda: set_page('home'))
    st.title("Shopping Cart 🛍️")
    
    if not st.session_state.cart:
        st.info("Your cart is empty.")
    else:
        total = 0
        for i, item in enumerate(st.session_state.cart):
            with st.container():
                c1, c2, c3, c4 = st.columns([1, 3, 1, 1])
                c1.image(item['coverUrl'], width=60)
                c2.markdown(f"**{item['title']}**\n\n{item['author']}")
                c3.write(f"Qty: {item['quantity']}")
                price = item['price'] * item['quantity']
                total += price
                c4.write(f"฿{price:,}")
                if c4.button("Remove", key=f"rem_{i}"):
                    st.session_state.cart.pop(i)
                    st.rerun()
                st.divider()
        
        st.markdown(f"### Total: ฿{total:,}")
        
        with st.form("checkout"):
            st.write("Shipping Details")
            st.text_input("Name")
            st.text_area("Address")
            st.selectbox("Payment", ["PromptPay", "TrueMoney", "COD"])
            if st.form_submit_button("Place Order", type="primary"):
                st.success("Order Placed Successfully! 🎉")
                st.session_state.cart = []
                time.sleep(2)
                set_page('home')

elif st.session_state.page == 'admin':
    if not st.session_state.user or st.session_state.user['role'] != 'admin':
        st.error("Access Denied")
        if st.button("Go Home"): set_page('home')
    else:
        st.title("Admin Dashboard 🛡️")
        tab1, tab2, tab3 = st.tabs(["Overview", "Inventory", "Orders"])
        
        with tab1:
            m1, m2, m3 = st.columns(3)
            m1.metric("Revenue", "฿45,200")
            m2.metric("Orders", len(st.session_state.orders))
            m3.metric("Books", len(st.session_state.books))
            
        with tab2:
            st.dataframe(pd.DataFrame(st.session_state.books)[['id','title','price','category']])
            
        with tab3:
            st.dataframe(pd.DataFrame(st.session_state.orders))
            
        if st.button("Logout"):
            st.session_state.user = None
            set_page('home')

elif st.session_state.page == 'login':
    c1, c2, c3 = st.columns([1,2,1])
    with c2:
        st.title("Login")
        u = st.text_input("Username")
        p = st.text_input("Password", type="password")
        if st.button("Sign In", type="primary", use_container_width=True):
            login(u, p)
        st.caption("Use 'admin'/'admin123' or 'user'/'1234'")
        if st.button("Back"): set_page('home')

# --- 6. CHATBOT SIDEBAR ---
with st.sidebar:
    st.title("🤖 Nong Read")
    st.caption("Ask me about books!")
    
    # Chat UI
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.write(msg["text"])

    if prompt := st.chat_input("Type here..."):
        st.session_state.chat_history.append({"role": "user", "text": prompt})
        with st.chat_message("user"):
            st.write(prompt)
            
        with st.chat_message("assistant"):
            try:
                # Basic check for API key
                api_key = st.secrets.get("GOOGLE_API_KEY")
                if api_key:
                    genai.configure(api_key=api_key)
                    model = genai.GenerativeModel('gemini-1.5-flash')
                    response = model.generate_content(prompt)
                    st.write(response.text)
                    st.session_state.chat_history.append({"role": "model", "text": response.text})
                else:
                    st.error("API Key not found in secrets.")
            except Exception as e:
                st.error("Chat Error")
