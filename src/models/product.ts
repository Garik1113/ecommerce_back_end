import { Schema, Document, model } from 'mongoose';
import { Image } from '../interfaces/product';


interface IVariantAttribute {
    attributeId: string,
    valueId: string,
}

interface IVariantProductInput {
    images: Image[],
    price: number,
    quantity: number,
    discount: number,
    discountedPrice: number
}

interface IVariantInput {
    attributes: IVariantAttribute[],
    product: IVariantProductInput
}

interface IProductInput extends Document {
    name: string,
    pageTitle: string,
    metaDescription: string,
    price: number,
    discountedPrice: number,
    discount: number,
    averageRating: number,
    categories: string[],
    attributes: [],
    images: string[],
    variants: IVariantInput[]
};

interface IVariant extends IVariantInput {
    _id: string
}

interface IProduct extends IProductInput {
    _id: string,
    variants: IVariant[]
}



const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    pageTitle: String,
    description: String,
    metaDescription: String,
    price: {type: Number, default: 0},
    discountedPrice: {type: Number, default: 0},
    discount: { type: Number, default: 0 },
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
    variants: [
        {
            images: [
                {
                    thumbnail_image: String,
                    small_image: String,
                    main_image: String
                }
            ],
            price: { type: Number },
            quantity: { type: Number },
            discount: { type: Number },
            discountedPrice: { type: Number },

        }
    ],
    quantity: { type: Number, default: 0 }
}, { timestamps: true });

ProductSchema.index({name: "text"})

export default model<IProductInput | IProduct>('Product', ProductSchema);