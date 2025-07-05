// routes/truecaller.js
import express from 'express';
import fetch from 'node-fetch';
import User from '../models/User.js'; // Add `.js` extension

const router = express.Router();

// Callback from Truecaller
router.post('/callback', async (req, res) => {
  const { requestId, accessToken, endpoint } = req.body;
  res.sendStatus(200);

  try {
    const profileRes = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const profile = await profileRes.json();

    await User.findOneAndUpdate(
      { requestId },
      { profile },
      { upsert: true }
    );
    console.log('Profile saved:', profile);
  } catch (err) {
    console.error('Error fetching Truecaller profile', err);
  }
});

// Frontend polling endpoint
router.get('/status/:requestId', async (req, res) => {
  const user = await User.findOne({ requestId: req.params.requestId });

  if (user && user.profile) {
    res.json({ verified: true, profile: user.profile });
  } else {
    res.status(204).send();
  }
});

// ✅ Export router as default
export default router;
