import { Schema, model, Document } from 'mongoose';


interface IFilterOptionInput {
    name: string,
    value: string,
    allowed: boolean
}

interface IFilterInput extends Document {
    name: string,
    value: string,
    options: IFilterOptionInput[]
};

interface IFilter extends IFilterInput {
    _id: string
}

const FilterSchema:Schema = new Schema({
    name: {type: String, required: true},
    value: {type: String, required: true},
    allowed: {type: Boolean, required: true},
    options: [
        {
            name: { type: String, required: true },
            value: { type: String, required: true }
        }
    ]
});

export default model<IFilter | IFilterInput>('Filter', FilterSchema);