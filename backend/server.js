// server.js (ESM)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken"; // For decoding Truecaller's sdk_data

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for verification data (replace with DB in production)
const verificationMap = new Map();

// ✅ Replace this with the actual Truecaller public key from their dashboard
const TRUECALLER_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
<your Truecaller RSA public key here>
-----END PUBLIC KEY-----`;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Request logger
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.query).length > 0) console.log("📦 Query Params:", req.query);
  if (["POST", "PUT", "PATCH"].includes(req.method) && Object.keys(req.body).length > 0)
    console.log("📝 Body:", req.body);
  next();
});

// ✅ Fallback redirect handler (if user doesn't have app and Truecaller fallback triggers)
app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("⚠️  Fallback triggered: user does not have Truecaller app.");
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }
  res.status(400).send("❌ Invalid access to /truecaller/callback");
});

// ✅ Stores requestNonce when Truecaller verification is successful (optional legacy POST)
app.post("/truecaller/callback", (req, res) => {
  const data = req.body;
  console.log("✅ Received POST verification from Truecaller:", data);

  if (!data.requestNonce) {
    return res.status(400).send("Missing requestNonce");
  }

  verificationMap.set(data.requestNonce, data);
  res.send("✅ Verification received!");
});

// ✅ Polling route to check verification status
app.get("/verify-status", (req, res) => {
  const { nonce } = req.query;
  if (!nonce) return res.status(400).send("Missing nonce");

  const verifiedData = verificationMap.get(nonce);
  if (verifiedData) {
    return res.json({ verified: true, data: verifiedData });
  }

  res.json({ verified: false });
});

// ✅ MAIN ENDPOINT – Truecaller web fallback returns sdk_data → verify here
app.post("/api/verify-sdk-data", (req, res) => {
  const { sdkData } = req.body;
  if (!sdkData) {
    return res.status(400).json({ error: "Missing sdk_data" });
  }

  try {
    const decoded = jwt.verify(sdkData, TRUECALLER_PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    console.log("✅ Verified user profile:", decoded);

    // Store or authenticate user here
    // e.g., check if user exists in DB or create a new user

    return res.json({ success: true, profile: decoded });
  } catch (err) {
    console.error("❌ Verification failed:", err.message);
    return res.status(400).json({ error: "Invalid or expired sdk_data" });
  }
});

// 404 fallback
app.use((req, res) => {
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).send("Internal Server Error");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
