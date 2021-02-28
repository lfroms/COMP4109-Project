import express from 'express';

const PORT = 3000;
const app = express();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get('/', (_req, res) => {
  return res.json({ message: 'Hello, World!' });
});
