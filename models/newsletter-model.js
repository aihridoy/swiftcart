import mongoose, { Schema } from "mongoose";

const newsletterSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    unsubscribeToken: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Newsletter = mongoose.models.newsletters ?? mongoose.model("newsletters", newsletterSchema);
