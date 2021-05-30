import { Schema, model, Document } from 'mongoose';


interface IValueInput {
    name: string
}

interface IValue extends IValueInput {
    _id: string
}

interface IAttributeInput extends Document {
    name: string,
    type: string,
    values: IValueInput[],
};

interface IAttribute extends IAttributeInput {
    _id: string,
    values: IValue[]
}

const AttributeSchema:Schema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, required: true },
    values: [
        {
            name: { type: String, required: true },
            id: { type: String, required: true }
        }
    ]
});

export default model<IAttribute | IAttributeInput>('Attribute', AttributeSchema);