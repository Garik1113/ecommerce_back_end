import { Model, Document } from "mongoose"
import Cart from "../models/cart"
import { TCartItem } from "../types/cart";

class CartDb {
    protected _db: Model<any> = Cart;

    async creatCart(): Promise<Document> {
        const cart: Document = new Cart();
        const m =  await cart.save();
        console.log(m)
        return cart;
    }
    async getCart(cartId: string): Promise<Document> {
        const cart: Document = await Cart.findById(cartId);
        return cart;
    }
    async addItemToCart (cartId: string, item: TCartItem) {
        const cart = await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
        console.log("CAAAAAAART", cart)
    }
    async addItemQuantityToCart (cartId: string, itemId: string) {
        console.log("ITEM _ID", itemId)
      const cart = await Cart.updateOne(
          {_id: cartId}, 
          {$set: {"items.$[].quantity": 800}},
          { arrayFilters: [ { "item": {_id: itemId}} ]}
          );
    }
}

export default new CartDb ();