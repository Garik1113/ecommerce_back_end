import { ICategory } from '../interfaces/category';
import { ICategoryInput } from '../interfaces/category'

 export const convertCategoryObjectToDbFormat = (categoryObj:any):ICategoryInput => {
    const category:ICategoryInput = {
        name: categoryObj.name || "",
        image: categoryObj.image,
        include_in_menu: categoryObj.include_in_menu || false,
        products: []
    }

    return category;
}

export const convertDbCategoryToNormal = (categoryDb:any={}):ICategory => {
    const category:ICategory = {
        _id: categoryDb._id,
        image: categoryDb.image,
        name: categoryDb.name,
        include_in_menu: categoryDb.include_in_menu,
        products: categoryDb.products
    }
    return category;
}