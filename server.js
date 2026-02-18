import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check
app.get("/", (_, res) => {
  res.json({ status: "Ollama backend running" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: req.body.messages,
        stream: false
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Ollama error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
