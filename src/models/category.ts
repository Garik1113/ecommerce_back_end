import { Schema, Document, model } from 'mongoose';

interface ICategoryInput extends Document {
    name: string,
    image: string,
    include_in_menu: boolean,
    products: string[]
};

interface ICategory extends ICategoryInput {
    _id: string
}

const CategorySchema:Schema = new Schema({
    name: { type: String },
    image: { type: String },
    include_in_menu: { type: Boolean },
    products: []
});

export default model<ICategory | ICategoryInput>('Category', CategorySchema);