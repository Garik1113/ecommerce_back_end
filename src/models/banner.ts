import { Schema, model, Document } from 'mongoose';

interface IBannerInput extends Document {
    image: String,
    content: String,
    contentPosition: String
};

interface IBanner extends IBannerInput {
    _id: string
}

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

export default model<IBanner | IBannerInput>('Banner', BannerSchema);