import express, { Request, Response } from 'express';
import crypto from 'crypto';
import Invitation from '../models/InvitationSchema';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const userId = req.body.userId as string; // Takes the userId
    const token = crypto.randomBytes(16).toString('hex');

    const newInvite = new Invitation({
        token: token,
        createdBy: new mongoose.Types.ObjectId(userId),
        createdAt: new Date(),
        validUntil: new Date(Date.now() + 24*60*60*1000) // valid for 1 day
    });

    try {
        await newInvite.save();
        res.json({ inviteLink: `http://localhost:5173/invite/${token}` });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export {router as inviteEndpoints};
