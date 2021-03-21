import { ISliderInput, ISlider, ISlideInput, ISlide } from "../interfaces/sliders";


export const convertSlideObjectToDb = (slide: any):ISlideInput => {
    return {
        image: slide.image
    }
}

export const convertSliderObjectToDb = (sliderObj: any = {}):ISliderInput => {
    return {
        name: sliderObj.name,
        includeInHomePage: sliderObj.sliderObj,
        slides: sliderObj.slides?.map(convertSlideObjectToDb) || []
    }
}

export const convertDbSlideToNormal = (slide: any):ISlide => {
    return {
        _id: slide._id,
        image: slide.image
    }
}

export const convertDbSliderToNormal = (dbSlider: any):ISlider=> {
    return {
        _id: dbSlider._id || "",
        name: dbSlider.name,
        includeInHomePage: dbSlider.includeInHomePage,
        slides: dbSlider.slides?.map(convertDbSlideToNormal) || []
    }
}