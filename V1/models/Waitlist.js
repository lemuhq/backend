import mongoose, { Schema, Document, Model } from 'mongoose';

// Create Schema
const WaitlistSchema = new Schema({
       email: { type: String},
    timestamps: {
        createdAt: {
            type: Date,
            default: Date.now
        
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
})


// Create Model
const Waitlist = mongoose.model('Waitlist', WaitlistSchema);
export default Waitlist;



