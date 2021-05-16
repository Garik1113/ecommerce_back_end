import { ICustomer } from './customer';
import { IProduct } from './product';

export interface IProductSubscriptionInput {
    productId: string | IProduct,
    customerId: string | ICustomer
}

export interface IProductSubscription extends IProductSubscriptionInput {
    _id: String
}