import 'dotenv/config'; // ✅ This loads environment variables from .env
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const port = process.env.PORT || 3000; // ✅ Use the PORT from .env or default to 3000
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

