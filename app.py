import streamlit as st
import google.generativeai as genai
import time

# Page configuration
st.set_page_config(
    page_title="Gemini Chatbot",
    page_icon="✨",
    layout="centered"
)

st.title("✨ Chat with Gemini")

# 1. Configure the API using st.secrets
try:
    genai.configure(api_key=st.secrets["GOOGLE_API_KEY"])
except KeyError:
    st.error("API Key not found. Please set `GOOGLE_API_KEY` in .streamlit/secrets.toml")
    st.stop()

# 2. Initialize Model
# 'gemini-1.5-flash' is faster and cheaper, 'gemini-1.5-pro' is more capable
model = genai.GenerativeModel('gemini-1.5-flash')

# 3. Initialize Chat History in Session State
if "messages" not in st.session_state:
    st.session_state.messages = []

# 4. Display Chat History
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 5. Handle User Input
if prompt := st.chat_input("What's on your mind?"):
    # A. Display User Message
    with st.chat_message("user"):
        st.markdown(prompt)
    
    # B. Add User Message to History
    st.session_state.messages.append({"role": "user", "content": prompt})

    # C. Generate Response
    with st.chat_message("assistant"):
        try:
            # Prepare history for Gemini (Streamlit roles -> Gemini roles)
            # Streamlit uses "assistant", Gemini uses "model"
            gemini_history = [
                {"role": "user" if m["role"] == "user" else "model", "parts": [m["content"]]}
                for m in st.session_state.messages
            ]

            # Generate content with streaming
            stream = model.generate_content(
                gemini_history,
                stream=True
            )

            # Stream the response to the UI
            response = st.write_stream(stream)
            
            # D. Add Assistant Response to History
            st.session_state.messages.append({"role": "assistant", "content": response})

        except Exception as e:
            st.error(f"An error occurred: {str(e)}")
