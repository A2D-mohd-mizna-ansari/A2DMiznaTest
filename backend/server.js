// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import truecallerRoutes from './routes/truecaller.js'; // Note the `.js` extension

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://a2-d-mizna-test.vercel.app',
  credentials: true
}));
app.use('/truecaller', truecallerRoutes);

mongoose.connect('mongodb+srv://miznaansari:2sAc7wuwKHHzfnoh@mizna.jfncd.mongodb.net/truecallerDB?retryWrites=true&w=majority&appName=Mizna', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', () => console.log('MongoDB connected'));

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
