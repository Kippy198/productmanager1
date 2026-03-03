import mongoose from "mongoose";
import { UserType } from "../type/user";

export interface UserDocument extends Document{
    name: string,
    password: string,
    email: string
}

const UserSchema = new mongoose.Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true
        },

        name: {
            type: String,
            // required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema, "users");