import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

/*
  Enable CORS
  - Allow localhost (dev)
  - Allow your deployed frontend (update when needed)
*/
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.com"
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Health check
app.get("/", (_, res) => {
  res.json({ status: "Ollama backend running" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    if (!req.body.messages) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: req.body.messages,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({
        error: "Ollama responded with error",
        details: errorText,
      });
    }

    const data = await response.json();

    res.json({
      message: data.message,
    });
  } catch (error) {
    console.error("Ollama error:", error);
    res.status(500).json({ error: "Ollama server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
