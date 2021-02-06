import { TProduct } from '../types/product';

 export const convertProductObjectToDbFormat = (productObj: any):TProduct => {
    const product: TProduct = {
        name: productObj.name || "",
        pageTitle: productObj.pageTitle || "",
        metaDescription: productObj.metaDescription,
        attributes: productObj.attributes || [],
        price: productObj.price || {},
        discount: productObj.discount || {},
        averageRating: productObj.averageRating || 1,
        categories: productObj.categories || [],
        images: productObj.images || []
    }
    return product;
}

export const convertDbProductToNormal = (productDb: any):TProduct => {
    const product: TProduct = {
        _id: productDb._id,
        name: productDb.name || "",
        pageTitle: productDb.pageTitle || "",
        metaDescription: productDb.metaDescription,
        attributes: productDb.attributes || [],
        price: productDb.price || {},
        discount: productDb.discount || {},
        averageRating: productDb.averageRating || 1,
        categories: productDb.categories || [],
        images: productDb.images || []
    }
    return product;
}