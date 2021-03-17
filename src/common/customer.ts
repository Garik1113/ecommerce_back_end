import bcrypt from 'bcryptjs';
import { ICustomer, ICustomerInput } from '../interfaces/customer';

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);
export const comparePasswords = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export const convertCustomerObjecttToDbFormat = (customerObject: any):ICustomerInput => {
    const customer: ICustomerInput = {
        firstName: customerObject.firstName,
        lastName: customerObject.lastName,
        email: customerObject.email,
        password: hashPassword(customerObject.password),
        cartId: customerObject.cartId,
        loggedIn: false,
        addresses: []
    };
    return customer;
}

export const convertDbCustomerToNormal = (dbCustomer: any):ICustomer => {
    const customer: ICustomer = {
        _id: dbCustomer._id,
        firstName: dbCustomer.firstName,
        lastName: dbCustomer.lastName,
        email: dbCustomer.email,
        password: dbCustomer.password,
        cartId: dbCustomer.cartId,
        loggedIn: dbCustomer.loggedIn,
        addresses: dbCustomer.addresses
    };
    return customer;
}