import mongoose, { Schema, Document, Model } from 'mongoose';

// Create Schema
const WaitlistSchema = new Schema({
       email: { type: String},
       fullName: { type: String},  
})

// Create Model
const Waitlist = mongoose.model('Waitlist', WaitlistSchema);
export default Waitlist;






