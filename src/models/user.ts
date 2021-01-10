import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    loggedIn: boolean
}

const UserSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedIn: { type: Boolean, required: true }
})

export default model("User", UserSchema);