import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const verificationMap = new Map();

app.use(cors());
app.use(bodyParser.json());

// Logger middleware (optional)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body).length > 0) console.log("📝 Body:", req.body);
  next();
});

// Truecaller verification callback
app.post("/truecaller/callback", (req, res) => {
  const data = req.body;
  console.log("✅ Received verification from Truecaller:", data);

  if (!data.requestNonce) {
    return res.status(400).send("Missing requestNonce");
  }

  // Save real data here
  verificationMap.set(data.requestNonce, data);
  res.json({ success: true, message: "Verification received!" });
});

// Polling endpoint
app.get("/verify-status", (req, res) => {
  const { nonce } = req.query;
  if (!nonce) return res.status(400).send("Missing nonce");

  const verifiedData = verificationMap.get(nonce);
  if (verifiedData) {
    return res.json({ verified: true, data: verifiedData });
  }
  res.json({ verified: false });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
