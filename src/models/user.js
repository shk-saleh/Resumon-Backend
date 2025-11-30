import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  googleId: { type: String, unique: true, sparse: true },
  avatar: {type: String },
  authProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  subscription: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  credits: {
    total: { type: Number, default: 10 },
    used: { type: Number, default: 0 },
    remaining: { type: Number, default: 10 }
  }
}, { timestamps: true });


userSchema.methods.comparePass = async function(password) {
  if (!this.password) return false; // Google users don't have passwords
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.detectCredit = async function() {

  if (this.credits.remaining <= 0) {
    throw new Error('Insufficient credits');
  }
  this.credits.used += 1;
  this.credits.remaining -= 1;
  await this.save();
  return this.credits;
  
}

const User = mongoose.model("User", userSchema);

export default User;