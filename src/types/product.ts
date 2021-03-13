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

export type AttributeValue = {
    id: Number,
    label: String,
    images: Image[]
}

export type Attribute = {
    id: Number,
    label: String,
    values: AttributeValue[]
}

export type TAttributeData = {
    attributeId: number,
    valueId: number
}

export interface IProduct {
    name: string,
    pageTitle: string,
    description: string,
    metaDescription: string,
    price: TPrice,
    discount: Discount,
    averageRating: number,
    categories: string[],
    attributes: Attribute[],
    images: Image[],
    quantity: number
};

export interface IProductDb extends IProduct {
    _id: string,
}