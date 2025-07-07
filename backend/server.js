// server.js (ESM syntax)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for verification data (use DB in prod)
const verificationMap = new Map();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logger middleware
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

// Truecaller fallback handler (when user does not have Truecaller app)
app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("⚠️  Fallback triggered: user does not have Truecaller app.");
    // Redirect user to fallback page or show fallback info
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }
  res.status(400).send("❌ Invalid access to /truecaller/callback");
});

// Truecaller verification handler (receives POST callback from Truecaller SDK)
app.post("/truecaller/callback", async (req, res) => {
  const data = req.body;
  console.log("✅ Received verification from Truecaller:", data);

  if (!data.requestNonce) {
    return res.status(400).send("Missing requestNonce");
  }

  // Store the verification data keyed by nonce
  verificationMap.set(data.requestNonce, data);

  // If there's accessToken and endpoint, fetch profile
  if (data.accessToken && data.endpoint) {
    try {
      const response = await fetch(data.endpoint, {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      const profile = await response.json();

      // Extract only required fields
      const userData = {
        number: profile.phoneNumbers?.[0],
        firstName: profile.name?.first || "",
        lastName: profile.name?.last || "",
        email: profile.onlineIdentities?.email || "",
      };

      console.log("📦 UserData:", userData);

      // Optionally attach to verification map
      verificationMap.set(data.requestNonce, {
        ...data,
        userData,
      });

      return res.send("✅ Verification received!");
    } catch (err) {
      console.error("❌ Error fetching profile from Truecaller:", err.message);
      return res.status(500).send("Failed to fetch user profile from Truecaller.");
    }
  }

  res.send("✅ Verification received (no accessToken provided).");
});
// Polling endpoint to check verification status by nonce
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
  console.warn(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
