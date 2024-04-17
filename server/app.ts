import express from 'express';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3030;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post('/dialogue', async (req, res) => {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'what is 2+2?' }],
      model: 'gpt-3.5-turbo',
    });
    res.json(completion.choices[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
    return;
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
