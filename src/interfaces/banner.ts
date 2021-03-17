import { String } from 'aws-sdk/clients/appstream';

export interface IBannerInput {
    image: String,
    content: String,
    contentPosition: String
}

export interface IBanner extends IBannerInput{
    _id: String
}