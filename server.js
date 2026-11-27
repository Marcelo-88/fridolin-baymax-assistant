const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SLACK_TOKEN = process.env.SLACK_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

app.post('/api/send', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Texto requerido' });
  }

  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    return res.json({
      ok: false,
      message: 'Sin conexión a Slack todavía.',
      local: true
    });
  }

  try {
    const formatted = `Lynn (tablet): ${text}`;
    const response = await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: SLACK_CHANNEL,
        text: formatted
      },
      {
        headers: {
          Authorization: `Bearer ${SLACK_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.ok) {
      res.json({ ok: true, ts: response.data.ts });
    } else {
      res.json({ ok: false, error: response.data.error });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, error: 'Error al enviar a Slack' });
  }
});

app.get('/api/messages', async (req, res) => {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    return res.json({
      ok: false,
      message: 'Sin conexión a Slack todavía.',
      messages: []
    });
  }

  try {
    const response = await axios.get('https://slack.com/api/conversations.history', {
      headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
      params: {
        channel: SLACK_CHANNEL,
        limit: 30
      }
    });

    if (!response.data.ok) {
      return res.json({ ok: false, error: response.data.error, messages: [] });
    }

    const messages = (response.data.messages || [])
      .filter(m => m.text && !m.subtype)
      .reverse()
      .map(m => ({
        text: m.text,
        ts: m.ts,
        user: m.user,
        bot_id: m.bot_id,
        is_bot: !!m.bot_id || m.subtype === 'bot_message'
      }));

    res.json({ ok: true, messages });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, error: 'Error al consultar Slack', messages: [] });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Fridolin Baymax en puerto ${PORT}`);
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    console.log('AVISO: SLACK_TOKEN o SLACK_CHANNEL no configurados.');
  }
});
