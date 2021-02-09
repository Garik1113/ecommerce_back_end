export type Price = {
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

export type TProduct = {
    _id?: string,
    name: string,
    pageTitle: string,
    metaDescription: string,
    price: Price,
    discount: Discount,
    averageRating: number,
    categories: string[],
    attributes: Attribute[],
    images: Image[]
};