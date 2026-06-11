const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err.message));
} else {
  console.log('MONGO_URI not added. Contact form will run in demo mode.');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', project: 'Full Stack House Portfolio' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (process.env.MONGO_URI && mongoose.connection.readyState === 1) {
      await Message.create({ name, email, message });
    }

    res.json({ success: true, message: 'Message saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
