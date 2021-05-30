import { Model, Document } from "mongoose"
import Cart from "../models/cart"
import { ICartInput } from "../interfaces/cart";
const ObjectID = require('mongodb').ObjectID;
class CartDb {
    protected _db: Model<any> = Cart;

    async creatCart(cart: ICartInput | null): Promise<Document> {
        const cartDb: Document = await this._db.create(cart);
        await cartDb.save();
        return cartDb;
    }
    async getCartByCustomer(customerId: string): Promise<Document | any> {
        if(customerId) {
            const cart: Document = await Cart.findOne({ customerId });
            return cart;  
        }
    }
    async getCartById (cartId: string): Promise<Document | any> {
        if (cartId) {
            const cart: Document = await Cart.findById(ObjectID(cartId)).lean();

            return cart;
        }
    }
    async removeCart (cartId: string):Promise<void> {
        await Cart.findByIdAndDelete(ObjectID(cartId));
    }
    async updateCart (cartId: string, cartData: any): Promise<Document> {
        delete cartData._id;
        const cartResult: Document = await Cart.findByIdAndUpdate(cartId, cartData, { new: true }).lean();
        return cartResult;
    }
}

export default new CartDb();