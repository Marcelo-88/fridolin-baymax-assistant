const baymaxContainer = document.getElementById('baymax-container');
const chatPanel = document.getElementById('chat-panel');
const messagesEl = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');
const micBtn = document.getElementById('mic');

let isOpen = false;
let lastTs = null;
let pollInterval = null;
let recognition = null;
let isListening = false;

// Web Speech API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    input.value = (input.value + ' ' + transcript).trim();
    stopListening();
  };

  recognition.onerror = () => stopListening();
  recognition.onend = () => stopListening();
} else {
  micBtn.style.display = 'none';
}

function startListening() {
  if (!recognition || isListening) return;
  isListening = true;
  micBtn.classList.add('listening');
  recognition.start();
}

function stopListening() {
  isListening = false;
  micBtn.classList.remove('listening');
  if (recognition) recognition.stop();
}

micBtn.addEventListener('click', () => {
  if (isListening) stopListening();
  else startListening();
});

// Toggle chat
baymaxContainer.addEventListener('click', () => {
  isOpen = !isOpen;
  chatPanel.classList.toggle('hidden', !isOpen);
  baymaxContainer.classList.add('waving');
  setTimeout(() => baymaxContainer.classList.remove('waving'), 1400);

  if (isOpen) {
    input.focus();
    startPolling();
    if (messagesEl.children.length === 0) {
      addBubble('Hola, soy el asistente de Fridolin. ¿En qué te ayudo?', 'bot');
    }
  } else {
    stopPolling();
  }
});

function addBubble(text, type = 'bot') {
  const div = document.createElement('div');
  div.className = `bubble ${type}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addBubble(text, 'user');
  input.value = '';
  sendBtn.disabled = true;

  try {
    const res = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();

    if (data.message) {
      addBubble(data.message, 'system');
    } else if (!data.ok) {
      addBubble('No se pudo enviar el mensaje.', 'system');
    }
  } catch (err) {
    addBubble('Error de conexión.', 'system');
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function startPolling() {
  if (pollInterval) return;
  pollMessages();
  pollInterval = setInterval(pollMessages, 4000);
}

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}

async function pollMessages() {
  try {
    const res = await fetch('/api/messages');
    const data = await res.json();

    if (data.message && data.messages.length === 0) {
      // Only show once
      if (!document.querySelector('.bubble.system')) {
        addBubble(data.message, 'system');
      }
      return;
    }

    if (data.ok && data.messages) {
      data.messages.forEach(msg => {
        if (lastTs && parseFloat(msg.ts) <= parseFloat(lastTs)) return;
        // Skip our own messages that start with Lynn
        if (msg.text.startsWith('Lynn (tablet):')) return;

        const type = msg.is_bot || msg.bot_id ? 'bot' : 'bot';
        addBubble(msg.text, type);
        lastTs = msg.ts;
      });
    }
  } catch (err) {
    // silent
  }
}

// Close on escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen) {
    baymaxContainer.click();
  }
});
