import { Schema, Document, model } from 'mongoose';

export interface IProduct extends Document {
    name: string,
    category_id: string
};

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    category_id: { type: String, required: true }
});

export default model<IProduct>('Product', ProductSchema);