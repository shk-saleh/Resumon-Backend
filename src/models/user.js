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
}, { timestamps: true });


userSchema.methods.comparePass = async function(password) {
  if (!this.password) return false; // Google users don't have passwords
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;