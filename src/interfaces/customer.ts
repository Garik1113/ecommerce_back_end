import { IAddress } from "./address";


export interface ICustomerInput {
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    loggedIn: boolean,
    addresses: IAddress[],
    cartId: String,
    productSubscriptions: boolean
}

export interface ICustomer extends ICustomerInput {
    _id: string
}