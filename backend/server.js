const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS if frontend and backend are on different domains
app.use(cors());

// Parse JSON body (Truecaller sends JSON POST)
app.use(bodyParser.json());

// GET callback for fallback or invalid accesses
app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("Fallback triggered: user does not have Truecaller app installed.");

    // Redirect to frontend fallback page (manual verification)
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }

  res.status(400).send("Invalid access to /truecaller/callback");
});

// POST callback to handle Truecaller verification data
app.post("/truecaller/callback", (req, res) => {
  const verificationData = req.body;

  console.log("Received Truecaller verification data:", verificationData);

  // TODO: 
  // 1. Validate the data and signature as per Truecaller docs
  // 2. Save user data / verification status in your DB
  // 3. Respond with 200 OK to acknowledge receipt

  res.sendStatus(200);
});

// Optional: fallback page or other routes can go here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
