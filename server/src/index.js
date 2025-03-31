import express from 'express';

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Server listening on Port: ${PORT}`);
})

app.listen(PORT, () => {
  console.log(`Server listening on Port: ${PORT}`);
});