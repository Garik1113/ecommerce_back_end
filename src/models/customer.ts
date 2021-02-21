import { Schema, model, Document } from 'mongoose';

export interface ICustomer extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    cartId: string,
    loggedIn?: boolean
}

const CustomerSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartId: { type: String },
    loggedIn: { type: Boolean, required: true, default: false }
})

export default model<ICustomer>("Customer", CustomerSchema);