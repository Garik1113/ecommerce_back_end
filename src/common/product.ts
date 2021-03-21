import { Attribute, Image, IProductInput, IProduct, TPrice } from '../interfaces/product';

export const productFilters = {
    "price-range": {
        id: 1,
        title: "Price Range",
        value: "price-range",
        type: "range",
        variants: [
            {
                id: 1,
                label: "0 - 10000",
                value: "0-10000",
                minValue: 0,
                maxValue: 10000
            },
            {
                id: 2,
                label: "10000 - 100000",
                value: "10000-100000",
                minValue: 10000,
                maxValue: 100000
            },
            {
                id: 3,
                label: "100000 - 1000000",
                value: "100000-1000000",
                minValue: 100000,
                maxValue: 1000000
            }
        ]
    },
    "availability": {
        id: 2,
        title: "Availability",
        value: 'availability',
        type: "option",
        variants: [
            {
                id: 1,
                label: "In stock",
                value: "in-stock"
            },
            {
                id: 2,
                label: "Out of stock",
                value: "out-of-stock"
            }
        ]
    }
}

const makeImageReadyForDb = (images: string[] = []):Image[] => {
    return images.map((image) => {
        return {
            thumbnail_image: image,
            small_image: image,
            main_image: image
        }
    })
}

const makeAttributeReadyForDb = (attributes: any[] = []): Attribute[] => {
    return attributes.map((attr) => {
        return {
            id: attr.id,
            label: attr.label,
            values: attr.values.map((val: any) => {
                return {
                    id: val.id,
                    label: val.label,
                    images: makeImageReadyForDb(val.images)
                }
            })
        }
    })
}

 export const convertProductObjectToDbFormat = (productObj: any):IProductInput => {
    const product: IProductInput = {
        name: productObj.name || "",
        pageTitle: productObj.pageTitle || "",
        description: productObj.description || "",
        metaDescription: productObj.metaDescription,
        attributes: makeAttributeReadyForDb(productObj.attributes) || [],
        price: productObj.price || {},
        discount: productObj.discount || {},
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: makeImageReadyForDb(productObj.images) || [],
        quantity: productObj.quantity || 0
    }
    return product;
}

export const convertDbProductToNormal = (productDb: any):IProduct => {
    const product: IProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        pageTitle: productDb.pageTitle || "",
        description: productDb.description || "",
        metaDescription: productDb.metaDescription || "",
        attributes: productDb.attributes || [],
        price: productDb.price || {},
        discount: productDb.discount || {},
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || [],
        quantity: productDb.quantity || 0
    }
    return product;
}

export const isProductConfigurable = (product: IProductInput):boolean => {
    return product.attributes.length > 0;
}

export const getTotalPriceOfProduct = (product: IProduct, quantity: number): TPrice => {
    return {
        currency: product.price.currency,
        value: product.price.value * quantity
    }
}

export const getFiltersFromParams = (filterParam:any) => {
    for (const key in filterParam) {
        if (Object.prototype.hasOwnProperty.call(filterParam, key)) {
            const element = filterParam[key];
            if(Array.isArray(element)) {

            }
        }
    }
}