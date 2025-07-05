// server.js (ESM version)
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/truecaller/callback", (req, res) => {
  if (req.query.fallback === "true") {
    console.log("Fallback triggered: user does not have Truecaller app installed.");
    return res.redirect("https://a2-d-mizna-test.vercel.app/fallback");
  }

  res.status(400).send("Invalid access to /truecaller/callback");
});

app.post("/truecaller/callback", (req, res) => {
  const verificationData = req.body;
  console.log("Received Truecaller verification data:", verificationData);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
