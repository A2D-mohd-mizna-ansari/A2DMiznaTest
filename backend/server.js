// server.js (ESM version)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Global request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

// Truecaller fallback handler (GET)
app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("⚠️  Fallback triggered: user does not have Truecaller app installed.");
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }

  res.status(400).send("❌ Invalid access to /truecaller/callback");
});

// Truecaller verification handler (POST)
app.post("/truecaller/callback", (req, res) => {
  console.log("✅ Received Truecaller verification POST data:");
  console.log(JSON.stringify(req.body, null, 2)); // pretty-print JSON

  // TODO: Verify data and signature from Truecaller
  // Save or process user info

  res.send("✅ Verification received!");
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

// Error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error("🔥 Error occurred:", err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
