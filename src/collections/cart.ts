import { Model, Document } from "mongoose"
import Cart from "../models/cart"
import { ICartInput, ICart, ICartItemInput } from "../interfaces/cart";

class CartDb {
    protected _db: Model<any> = Cart;

    async creatCart(cart: ICartInput | null): Promise<Document> {
        const cartDb: Document = await this._db.create(cart);
        await cartDb.save();
        return cartDb;
    }
    async getCart(cartId: string): Promise<Document | any> {
        if(cartId) {
            const cart: Document = await Cart.findById(cartId);
            return cart;  
        }
    }
    async addItemToCart (cartId: string, item: ICartItemInput) {
        await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
    }
    async getCartById (cartId: string): Promise<Document | any> {
        if (cartId) {
            const cart: Document = await Cart.findById(cartId).populate("items.product");
            return cart;
        }
    }
    async updateCart (cartId: string, body: any ) {
        const updateQuery:any = {};
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    updateQuery[key] = element;
                }
            };
        const result: Document = await Cart.findByIdAndUpdate({"_id": cartId}, updateQuery);
        return result;
    }
    async addItemQuantityToCart (cartId: string, itemId: string | undefined, quantity: number) {
        await Cart.findByIdAndUpdate(
            { _id: cartId }, 
            {
                $inc: {
                    "items.$[cartItem].quantity": quantity,
                    "items.$[cartItem].totalQty": quantity
                }
            },
            {
                arrayFilters: [ 
                    { 'cartItem._id': itemId }
                ],
                new: true
            }
        );
    }
    async updateAttributesOfCartItem (cartId: string, newAttributes: any, itemId: string) {
        await Cart.findByIdAndUpdate(
            { _id: cartId }, 
            {$set: {"items.$[item].attributes": newAttributes}},
            {
                arrayFilters: [ {'item.itemId': itemId}],
                new: true
            }
        );
    }
    async deleteCartItem (cartId: string, itemId: string):Promise<void> {
        await Cart.updateOne({ _id: cartId}, { $pull: { "items": { "_id": itemId } } });
    }
    async removeCart (cartId: string):Promise<void> {
        await Cart.findByIdAndDelete(cartId);
    }
}

export default new CartDb ();