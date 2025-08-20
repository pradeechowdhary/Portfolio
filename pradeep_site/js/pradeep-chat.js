// Simple chat interface for Pradeep's portfolio
// This script sends messages to a backend /chat endpoint and displays replies.

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');

  /**
   * Append a message element to the chat window.
   * @param {string} text The message text
   * @param {string} type 'user' or 'assistant'
   */
  function addMessage(text, type = 'assistant') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');
    // apply user or assistant class for styling
    msgDiv.classList.add(type === 'user' ? 'user-message' : 'assistant-message');
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    // scroll to bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Send the user's message to the backend and display the reply.
   */
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    // show user message
    addMessage(text, 'user');
    chatInput.value = '';
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const reply = data && data.reply ? data.reply : 'Sorry, I could not fetch an answer.';
      addMessage(reply, 'assistant');
    } catch (err) {
      addMessage('Error: ' + err.message, 'assistant');
    }
  }

  // Attach event listeners
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Display a greeting on load
  addMessage("Hi! I'm Pradeep’s AI assistant. Ask me anything about his skills, projects, or experience.");
});