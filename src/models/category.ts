import mongoose, { Schema, Document, model } from 'mongoose';

export interface ICategory extends Document {
    title: string,
    include_in_menu: boolean,
    children: Array<ICategory>
};

const CategorySchema:Schema = new Schema({
    title: { type: String, required: true },
    include_in_menu: { type: Boolean, required: true },
    children: { type: Array, required: true }
});

export default model<ICategory>('Category', CategorySchema);