export type TPrice = {
    currency: string,
    value: number
}

export type Discount = {
    type: string,
    value: number
}

export type Image = {
    thumbnail_image: string,
    small_image: string,
    main_image: string
}

export interface IVariantAttribute {
    attributeId: string,
    valueId: string,
}

export interface IVariantProductInput {
    images: Image[],
    price: number,
    quantity: number,
    discount: number,
    discountedPrice: number
}

export interface IVariantInput {
    attributes: IVariantAttribute[],
    product: IVariantProductInput
}

export interface IProductInput {
    name: string,
    pageTitle: string,
    description: string,
    metaDescription: string,
    price: number,
    discountedPrice: number,
    discount: number,
    averageRating: number,
    categories: string[],
    attributes: any[],
    images: Image[],
    quantity: number,
    variants: IVariantInput
};

export interface IProduct extends IProductInput {
    _id: string,
}