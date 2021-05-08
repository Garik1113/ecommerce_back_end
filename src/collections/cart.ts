import { Model, Document, UpdateQuery } from "mongoose"
import Cart from "../models/cart"
import { ICart, ICartInput, ICartItemInput } from "../interfaces/cart";

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
    async getCartByCustomer(customerId: string): Promise<Document | any> {
        if(customerId) {
            const cart: Document = await Cart.findOne({ customerId });
            return cart;  
        }
    }
    async addItemToCart (cartId: string, item: ICartItemInput) {
        await Cart.findByIdAndUpdate(cartId, { $push: { items: item } });
    }
    async getCartById (cartId: string): Promise<Document | any> {
        if (cartId) {
            const cart: Document = await Cart.findById(cartId)
            return cart;
        }
    }
    async getCartForOrder (cartId: string): Promise<Document | any> {
        if (cartId) {
            const cart: Document = await Cart.findById(cartId).populate("items.product").populate("customerId");
            return cart;
        }
    }
    async updateCart (cartId: string, body: any ) {
        try {
            const updateQuery:any = {};
                for (const key in body) {
                    if (Object.prototype.hasOwnProperty.call(body, key)) {
                        const element = body[key];
                        updateQuery[key] = element;
                    }
                };
                delete updateQuery._id
            const result: Document = await Cart.findByIdAndUpdate({ "_id": cartId }, updateQuery);
            return result;
        } catch (error) {
            console.log("error", error)
        }
        
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
    async deleteCartItem (cartId: string, itemId: string):Promise<void> {
        await Cart.updateOne({ _id: cartId}, { $pull: { "items": { "_id": itemId } } });
    }
    async removeCart (cartId: string):Promise<void> {
        await Cart.findByIdAndDelete(cartId);
    }
    async updateCartFixed (cartId: string, cartData: UpdateQuery<ICartInput | ICart | typeof undefined>): Promise<Document> {
        const cartResult: Document = await Cart.findByIdAndUpdate(cartId, cartData, { new: true })
        return cartResult;
    }
}

export default new CartDb();