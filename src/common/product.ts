import { TCategory } from '../types/category'
import { TProduct } from '../types/product';

 export const convertProductObjectToDbFormat = (productObj: any):TProduct => {
    const product:TProduct = {
        name: productObj.name || "",
        category_id: productObj.category_id || ""
    }

    return product;
}

export const convertDbProductToNormal = (productDb: any):TProduct => {
    const product:TProduct = {
        _id: productDb._id,
        name: productDb.name,
        category_id: productDb.category_id
    }
    return product;
}