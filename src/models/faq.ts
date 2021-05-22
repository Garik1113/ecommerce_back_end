import { Schema, model, Document } from 'mongoose';

interface IFaqInput extends Document {
    question: string,
    answer: string
};

interface IFaq extends IFaqInput {
    _id: string
}

const FaqSchema:Schema = new Schema({
    question: { 
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
});

export default model<IFaq | IFaqInput>('Faq', FaqSchema);