import mongoose, { Schema, Document, Model } from 'mongoose';

// Create Schema
const TransactionSchema = new Schema({
       senderId: { type: String},
       recipientId: { type: String},  
       senderName: { type: String}, 
       recipientName: { type: String}, 
       transactionReference: { type: String}, 
       type: { type: String}, 
       amount: { type: Number},
       status: { type: String}, 
       description: { type: String}, 
       paymentMethod: { type: String}, 
       bankName: {type: String},
       
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
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;






