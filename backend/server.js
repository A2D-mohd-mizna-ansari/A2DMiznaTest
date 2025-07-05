// server.js
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const TRUECALLER_PARTNER_KEY = 'YOUR_PARTNER_KEY';

app.post('/api/v1/truecaller-login', async (req, res) => {
  const { payload, signature } = req.body;

  if (!payload || !signature) {
    return res.status(400).json({ success: false, error: 'Missing payload or signature' });
  }

  try {
    const response = await axios.post(
      'https://api4.truecaller.com/v1/verify',
      { payload, signature },
      {
        headers: {
          'Authorization': `Bearer ${TRUECALLER_PARTNER_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const userDetails = response.data;
    return res.status(200).json({ success: true, userDetails });
  } catch (err) {
    console.error('Truecaller verification failed:', err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      error: 'Verification failed',
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
