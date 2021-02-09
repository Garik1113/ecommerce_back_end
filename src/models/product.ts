import { Schema, Document, model } from 'mongoose';
import { Price, Discount, Attribute } from '../types/product'


export interface IProduct extends Document {
    name: string,
    pageTitle: string,
    metaDescription: string,
    price: Price,
    discount: Discount,
    averageRating: number,
    categories: string[],
    attributes: Attribute[],
    images: string[]
};

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    pageTitle: String,
    metaDescription: String,
    price: Schema.Types.Map,
    discount: Schema.Types.Map,
    averageRating: Number,
    attributes: [
        {
            id: Number,
            label: String,
            values: [
                {
                    id: Number,
                    label: String,
                    images: [
                        {
                            thumbnail_image: String,
                            small_image: String,
                            main_image: String
                        }
                    ]
                }
            ]
        }
    ],
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    images: [
        {
            thumbnail_image: String,
            small_image: String,
            main_image: String
        }
    ]
});

export default model<IProduct>('Product', ProductSchema);