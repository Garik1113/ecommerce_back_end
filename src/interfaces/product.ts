import { IAttribute, IValue } from "./attribute"

export type Image = {
    thumbnail_image: string,
    small_image: string,
    main_image: string
}

export type ConfigurableAttribute = {
    attribute: IAttribute,
    selectedValue: IValue
}

export interface IProductInput {
    name: string,
    categories: string[],
    pageTitle: string,
    description: string,
    metaDescription: string,
    quantity: number,
    price: number,
    discount: number,
    discountedPrice: number,
    averageRating: number,
    configurableAttributes: ConfigurableAttribute[],
    images: Image[]
};

export interface IProduct extends IProductInput {
    _id: string,
}