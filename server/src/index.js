import express from 'express';

const app = express(); // Initialize the app using express

app.use(express.json()); // Middleware to parse JSON

// Example route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});