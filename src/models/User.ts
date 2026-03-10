import { Schema, model,models} from "mongoose";

export interface User{
    name: string,
    password: string,
    email: string
}

const UserSchema = new Schema<User>(
    {
        name: String,
        password: String,
        email: String,
    }
);

export const UserModel =  models.User || model<User>("User", UserSchema);