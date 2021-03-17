import { Schema, Document, model } from 'mongoose';
import { TPrice, Discount, Attribute } from '../interfaces/product'


interface IProductInput extends Document {
    name: string,
    pageTitle: string,
    metaDescription: string,
    price: TPrice,
    discount: Discount,
    averageRating: number,
    categories: string[],
    attributes: Attribute[],
    images: string[]
};

interface IProduct extends IProductInput {
    _id: string
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    pageTitle: String,
    description: String,
    metaDescription: String,
    price: {
        currency: { type: String },
        value: { type: Number }
    },
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
    ],
    quantity: { type: Number, default: 0 }
});

export default model<IProductInput | IProduct>('Product', ProductSchema);