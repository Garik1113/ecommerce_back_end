import { Schema, model, Document } from 'mongoose';

export interface IBanner extends Document {
    image: String,
    content: String,
    contentPosition: String
};

const BannerSchema:Schema = new Schema({
    image: { 
        type: String,
        required: true
    },
    content: {
        type: String
    },
    contentPosition: {
        type: String
    }
});

export default model<IBanner>('Banner', BannerSchema);