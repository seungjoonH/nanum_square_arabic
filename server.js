const express = require('express');
const path = require('path');
require('dotenv').config();

const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({
  projectId: process.env.PROJECT, 
  key: process.env.API_KEY,
});

const translateTo = async (text, target) => {
  if (!text) return '';
  const [translation] = await translate.translate(text, target);
  return translation;
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/translate', async (req, res) => {
  const { text, target } = req.body;

  try {
    const translation = await translateTo(text, target);
    res.json({ translation });
  }

  catch (error) {
    res.status(500).json({ error: 'Translation failed.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});