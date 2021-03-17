import { Schema, model, Document } from 'mongoose';

interface IUserInput extends Document {
    name: string,
    email: string,
    password: string,
    loggedIn: boolean
}

interface IUser extends IUserInput {
    _id: string
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedIn: { type: Boolean, required: true, default: false }
})

export default model<IUserInput | IUser>("User", UserSchema);