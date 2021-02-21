import bcrypt from 'bcryptjs';
import { TCustomer } from '../types/customer';

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);
export const comparePasswords = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export const convertCustomerObjecttToDbFormat = (customerObject: any):TCustomer => {
    const customer: TCustomer = {
        firstName: customerObject.firstName,
        lastName: customerObject.lastName,
        email: customerObject.email,
        password: hashPassword(customerObject.password),
        cartId: customerObject.cartId,
        loggedIn: false
    };

    return customer;
}

export const convertDbCustomerToNormal = (dbCustomer: any):TCustomer => {
    const customer: TCustomer = {
        id: dbCustomer._id,
        firstName: dbCustomer.firstName,
        lastName: dbCustomer.lastName,
        email: dbCustomer.email,
        password: dbCustomer.password,
        cartId: dbCustomer.cartId
    };

    return customer;
}