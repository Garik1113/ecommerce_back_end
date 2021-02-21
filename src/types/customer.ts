import { TAddress } from "./address";



export type TCustomer = {
    id?: string,
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    loggedIn?: boolean,
    addresses?: TAddress[],
    cartId: String
}