import {Image, IProductInput, IProduct } from '../interfaces/product';


const makeImageReadyForDb = (images: string[] = []):Image[] => {
    return images.map((image) => {
        return {
            thumbnail_image: image,
            small_image: image,
            main_image: image
        }
    })
}

const makeAttributeReadyForDb = (attributes: any[] = []) => {
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
        price: productObj.price || 0,
        discountedPrice: productObj.discountedPrice || 0,
        discount: productObj.discount || 0,
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: makeImageReadyForDb(productObj.images) || [],
        quantity: productObj.quantity || 0,
        variants: productObj.variants
    }
    return product;
}

export const convertDbProductToNormal = (productDb: any):IProduct => {
    const product: IProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        discountedPrice: productDb.discountedPrice,
        pageTitle: productDb.pageTitle || "",
        description: productDb.description || "",
        metaDescription: productDb.metaDescription || "",
        attributes: productDb.attributes || [],
        price: productDb.price || 0,
        discount: productDb.discount || 0,
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || [],
        quantity: productDb.quantity || 0,
        variants: productDb.variants
    }
    return product;
}

export const isProductConfigurable = (product: IProductInput):boolean => {
    return product.attributes.length > 0;
}

export const getTotalPriceOfProduct = (product: IProduct, quantity: number): number => {
    return product.price * quantity
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

export const getAggregationForProduct = (params: any) => {

}