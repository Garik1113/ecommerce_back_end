import { Schema, Document, model } from 'mongoose';
import { Image, TCurrency } from '../interfaces/product';


interface IProductInput extends Document {
    name: string,
    pageTitle: string,
    metaDescription: string,
    quantity: number,
    price: number,
    discountedPrice: number,
    discount: number,
    defaultPrice: number,
    averageRating: number,
    categories: string[],
    configurableAttributes: any[],
    images: Image[],
    currency: TCurrency,
    attributeFacets: string[]
};

interface IProduct extends IProductInput {
    _id: string
}



const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    pageTitle: { type: String },
    description: { type: String },
    metaDescription: { type: String },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 },
    defaultPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    currency: {
        name: String,
        code: String,
        symbol: String
    },
    averageRating: { type: Number, default: 3 },
    configurableAttributes: [ 
        {
            attribute: { 
                type:  Schema.Types.ObjectId,
                ref: "Attribute"
            },
            value: { type: String, required: true },
        } 
    ],
    images: [
        {
            thumbnail_image: String,
            small_image: String,
            main_image: String
        } 
    ],
    //this is for filtering by attribute
    attributeFacets: [],
    filters: { type: {} }
}, { timestamps: true });

ProductSchema.index({ name: "text" })

export default model<IProductInput | IProduct>('Product', ProductSchema);