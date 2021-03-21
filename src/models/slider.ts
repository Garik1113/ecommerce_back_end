import { Schema, model, Document } from 'mongoose';

interface ISlideInput {
    image: string
}

interface ISlide {
    image: string
    _id: string
}

interface ISliderInput extends Document {
    name: String,
    includeInHomePage: boolean,
    slides: ISlideInput[]
};

interface ISlider extends ISliderInput {
    _id: string
    slides: ISlide[]
}

const SliderSchema:Schema = new Schema({
    name: { 
        type: String,
        required: true
    },
    includeInHomePage: {
        type: Boolean, 
        required: true, 
        default: false
    },
    slides: [
        {
            image: { 
                type: String, 
                required: true 
            }
        }
    ]
});

export default model<ISlider | ISliderInput>('Slider', SliderSchema);