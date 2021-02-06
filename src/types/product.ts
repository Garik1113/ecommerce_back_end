export type Price = {
    currency: string,
    value: number
}

export type Discount = {
    type: string,
    value: number
}

export type AttributeValue = {
    valueId: string,
    label: string
}

export type Attribute = {
    attrbuteId: string,
    label: string,
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
    images: string[]
};