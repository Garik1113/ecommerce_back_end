import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    loggedIn?: boolean
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedIn: { type: Boolean, required: true, default: false }
})

export default model("User", UserSchema);