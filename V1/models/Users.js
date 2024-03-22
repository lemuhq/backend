import mongoose, { Schema, Document, Model } from 'mongoose';

// Create Schema
const UserSchema = new Schema({
    serviceType:{type:String},
    requestRef:{type:String},
    password:{type:String},
    data:{
       firstName: { type: String},
       lastName: { type: String }, 
       email: { type: String},
       phoneNumber: { type: String }, 
       Address: { type: String},
       trackingReference: { type: String }, 
       VerificationType: { type: Number }, 
       IdType: { type: Number},
       NIN: { type: String }, 
       BVN: { type: String },
       FaceImageUrl: { type: String },
       state: {type:String}
    },

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
const User = mongoose.model('User', UserSchema);
export default User;



