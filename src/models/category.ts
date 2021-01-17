import mongoose, { Schema, Document, model } from 'mongoose';

export interface ICategory extends Document {
    name: string,
    include_in_menu: boolean
};

const CategorySchema:Schema = new Schema({
    name: { type: String },
    include_in_menu: { type: Boolean },
});

export default model<ICategory>('Category', CategorySchema);