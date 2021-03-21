export interface ISlideInput {
    image: string
}

export interface ISlide extends ISlideInput {
    _id: string
}

export interface ISliderInput  {
    name: String,
    includeInHomePage: boolean,
    slides: ISlideInput[]
};

export interface ISlider extends ISliderInput {
    _id: string
    slides: ISlide[]
}
