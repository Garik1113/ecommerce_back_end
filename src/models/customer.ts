import { Schema, model, Document } from 'mongoose';
import { IAddress } from '../interfaces/address';

interface ICustomerInput extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    cartId: string,
    loggedIn: boolean,
    addresses: IAddress[]
}

interface ICustomer extends ICustomerInput {
    _id: string
}


const CustomerSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartId: { type: Schema.Types.ObjectId, ref: "Cart" },
    loggedIn: { type: Boolean, required: true, default: false },
    addresses: [
        {
            firstName: String,
            lastName: String,
            email: String,
            country: String,
            state: String,
            city: String,
            street: String,
            phone: String,
            zip: String,
            address: String,
            additionalInformation: String,
            company: String,
            isBillingAddress: Boolean,
            isShippingAddress: Boolean
        }
    ]
})

export default model<ICustomerInput | ICustomer>("Customer", CustomerSchema);