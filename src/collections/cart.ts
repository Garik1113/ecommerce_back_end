import { Model, Document } from "mongoose"
import Cart from "../models/cart"
import { TCart, TCartItem } from "../types/cart";
import { Attribute } from "../types/product";

class CartDb {
    protected _db: Model<any> = Cart;

    async creatCart(cart: TCart): Promise<Document> {
        const cartDb: Document = await this._db.create(cart);
        await cartDb.save();

        return cartDb;
    }
    async getCart(cartId: string): Promise<Document> {
        const cart: Document = await Cart.findById(cartId);
        return cart;
    }
    async addItemToCart (cartId: string, item: TCartItem) {
        await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
    }
    async findProduct (cartId: string, productId: string) {
        // const cart = await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
        const product = await Cart.find({items: {$elemMatch: {itemId: productId}}});
    }
    async addItemQuantityToCart (cartId: string, itemId: string) {
        await Cart.findByIdAndUpdate(
            {_id: cartId}, 
            {$inc: {"items.$[cartItem].quantity": 1}},
            {
                arrayFilters: [ 
                    {'cartItem._id': itemId}
                ],
                new: true
            }
        );
    }
    async updateAttributesOfCartItem (cartId: string, newAttributes: Attribute[], itemId: string) {
        await Cart.findByIdAndUpdate(
            {_id: cartId}, 
            {$set: {"items.$[item].attributes": newAttributes}},
            {
                arrayFilters: [ {'item.itemId': itemId}],
                new: true
            }
        );
    }
}

export default new CartDb ();