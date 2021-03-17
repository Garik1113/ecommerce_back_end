import { Schema, Document, model } from 'mongoose';

interface ICategoryInput extends Document {
    name: string,
    include_in_menu: boolean
};

interface ICategory extends ICategoryInput {
    _id: string
}

const CategorySchema:Schema = new Schema({
    name: { type: String },
    include_in_menu: { type: Boolean },
});

export default model<ICategory | ICategoryInput>('Category', CategorySchema);