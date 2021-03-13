import { Model, Document } from "mongoose"
import Cart from "../models/cart"
import { ICart, ICartDb, ICartItem } from "../types/cart";
import { Attribute } from "../types/product";

class CartDb {
    protected _db: Model<any> = Cart;

    async creatCart(cart: ICart | null): Promise<Document> {
        const cartDb: Document = await this._db.create(cart);
        await cartDb.save();
        return cartDb;
    }
    async getCart(cartId: string): Promise<Document> {
        const cart: Document = await Cart.findById(cartId);
        return cart;
    }
    async addItemToCart (cartId: string, item: ICartItem) {
        await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
    }
    async getCartById (cartId: string): Promise<Document> {
        const cart: Document = await Cart.findById(cartId).populate("items.product");
        return cart;
    }
    async updateCart ( cartId: string, cart: ICart ) {
        await Cart.findByIdAndUpdate(cartId, cart, { new: true });
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
    async updateAttributesOfCartItem (cartId: string, newAttributes: Attribute[], itemId: string) {
        await Cart.findByIdAndUpdate(
            { _id: cartId }, 
            {$set: {"items.$[item].attributes": newAttributes}},
            {
                arrayFilters: [ {'item.itemId': itemId}],
                new: true
            }
        );
    }
    async deleteCartItem (cartId: string, itemId: string) {
        await Cart.updateOne({ _id: cartId}, { $pull: { "items": { "_id": itemId } } });
    }
}

export default new CartDb ();