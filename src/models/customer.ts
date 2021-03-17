import { Schema, model, Document } from 'mongoose';

interface ICustomerInput extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    cartId: string,
    loggedIn: boolean
}

interface ICustomer extends ICustomerInput {
    _id: string
}


const CustomerSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartId: { type: String },
    loggedIn: { type: Boolean, required: true, default: false }
})

export default model<ICustomerInput | ICustomer>("Customer", CustomerSchema);