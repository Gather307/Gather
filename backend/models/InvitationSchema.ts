import mongoose from 'mongoose';
import User from './userSchema'

interface IInvitation {
    token: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    validUntil: Date;
}

const invitationSchema = new mongoose.Schema<IInvitation>({
    token: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link this with your User model
    createdAt: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true }
});

const Invitation = mongoose.model<IInvitation>('Invitation', invitationSchema);

export default Invitation;
