import bcrypt from 'bcryptjs';
import { IAddress } from '../interfaces/address';
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
        addresses: customerObject.addresses,
        productSubscriptions: customerObject.productSubscriptions
    };
    return customer;
}

export const convertDbCustomerToNormal = (dbCustomer: any = {}):ICustomer => {
    const customer: ICustomer = {
        _id: dbCustomer._id,
        firstName: dbCustomer.firstName,
        lastName: dbCustomer.lastName,
        email: dbCustomer.email,
        cartId: dbCustomer.cartId,
        loggedIn: dbCustomer.loggedIn,
        addresses: dbCustomer.addresses,
        productSubscriptions: dbCustomer.productSubscriptions
    };
    return customer;
}
export const convertCustomerAddressToDbFormat = (addressObj: any):IAddress => {
    const customer: IAddress = {
        _id: addressObj._id,
        firstName: addressObj.firstName,
        lastName: addressObj.lastName,
        email: addressObj.email,
        country: addressObj.country,
        state: addressObj.state,
        city: addressObj.city,
        street: addressObj.street,
        phone: addressObj.phone,
        zip: addressObj.zip,
        address: addressObj.address,
        additionalInformation: addressObj.additionalInformation,
        company: addressObj.company,
        isBillingAddress: addressObj.isBillingAddress,
        isShippingAddress: addressObj.isShippingAddress
    };
    return customer;
}