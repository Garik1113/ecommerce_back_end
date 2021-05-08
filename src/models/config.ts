import { Schema, model, Document } from 'mongoose';

interface IConfigInput extends Document {
    storeEmail: string,
    storePhone: string,
    baseCurrency: string,
    socialSites: any[],
    logo: string,
    productsPerPage: number
};

interface Iconfig extends IConfigInput {
    _id: string
}

const ConfigSchema:Schema = new Schema({
    config: { type: {} }
});

export default model<Iconfig | IConfigInput>('Config', ConfigSchema);