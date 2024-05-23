import mongoose, { Schema, Document, Model } from 'mongoose';

// Create Schema
const OtpSchema = new Schema({
       token: { type: String},
       expiryTime: { type: String},  
})

// Create Model
const Otp = mongoose.model('Otp', OtpSchema);
export default Otp;






