// server.js (ESM)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store (use DB for production)
const verificationMap = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Universal logger — logs every request (hit or not)
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);

  if (Object.keys(req.query).length > 0) {
    console.log("📦 Query Params:", req.query);
  }

  if (Object.keys(req.params).length > 0) {
    console.log("📦 Route Params:", req.params);
  }

  if (["POST", "PUT", "PATCH"].includes(req.method) && Object.keys(req.body).length > 0) {
    console.log("📝 Body:", req.body);
  }

  next();
});

// ✅ Truecaller fallback handler
app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("⚠️  Fallback triggered: user does not have Truecaller app.");
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }

  res.status(400).send("❌ Invalid access to /truecaller/callback");
});

// ✅ Truecaller verification handler
app.post("/truecaller/callback", (req, res) => {
  const data = req.body;
  console.log("✅ Received verification from Truecaller:", data);

  if (!data.requestNonce) {
    return res.status(400).json({ success: false, error: "Missing requestNonce" });
  }

  verificationMap.set(data.requestNonce, data);
  res.json({ success: true, message: "✅ Verification received!" }); // ✅ Fix here
});

// ✅ Polling endpoint to check verification status
app.get("/verify-status", (req, res) => {
  const { nonce } = req.query;

  if (!nonce) return res.status(400).send("Missing nonce");

  const verifiedData = verificationMap.get(nonce);
  if (verifiedData) {
    return res.json({ verified: true, data: verifiedData });
  }

  res.json({ verified: false });
});

// ✅ Catch-all logger before 404 (optional but useful)
app.use((req, res, next) => {
  console.log(`⚠️  No route matched for ${req.method} ${req.originalUrl}`);
  next();
});

// ✅ 404 handler
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).send("Internal Server Error");
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
