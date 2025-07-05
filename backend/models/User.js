// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  profile: { type: Object },
});

const User = mongoose.model('User', userSchema);

// ✅ Add this line:
export default User;
