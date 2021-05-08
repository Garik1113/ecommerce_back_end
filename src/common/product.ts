import {Image, IProductInput, IProduct } from '../interfaces/product';


const makeImageReadyForDb = (images: string[] = []):Image[] => {
    return images.map((image: any) => {
        return {
            thumbnail_image:  typeof image == "object" ? image.thumbnail_image : image,
            small_image: typeof image == "object" ? image.small_image : image,
            main_image: typeof image == "object" ? image.main_image : image,
        }
    })
}

export const convertProductObjectToDbFormat = (productObj: any):IProductInput => {
    const product: IProductInput = {
        name: productObj.name || "",
        pageTitle: productObj.pageTitle || "",
        description: productObj.description || "",
        metaDescription: productObj.metaDescription,
        price: productObj.price || 0,
        discountedPrice: productObj.discountedPrice || 0,
        discount: productObj.discount || 0,
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: makeImageReadyForDb(productObj.images) || [],
        quantity: productObj.quantity || 0,
        configurableAttributes: productObj.configurableAttributes,
        currency: productObj.currency
    }
    return product;
}

export const convertDbProductToNormal = (productDb: any={}):IProduct => {
    const product: IProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        discountedPrice: productDb.discountedPrice,
        pageTitle: productDb.pageTitle || "",
        description: productDb.description || "",
        metaDescription: productDb.metaDescription || "",
        price: productDb.price || 0,
        discount: productDb.discount || 0,
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || [],
        quantity: productDb.quantity || 0,
        configurableAttributes: productDb.configurableAttributes,
        currency: productDb.currency
    }
    return product;
}

export const getTotalPriceOfProduct = (product: IProduct, quantity: number): number => {
    return product.discountedPrice ? product.discountedPrice * quantity : product.price * quantity
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
