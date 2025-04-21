import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    resetPasswordToken: {
        type: String,
        default: null,
      },
      resetPasswordExpires: {
        type: Date,
        default: null,
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      }
}, { timestamps: true });

export const User = mongoose.models.users ?? mongoose.model("users", userSchema);
