import { TCategory } from '../types/category'

 export const convertCategoryObjectToDbFormat = (categoryObj:any):TCategory => {
    const category:TCategory = {
        _id: categoryObj._id || "",
        name: categoryObj.name || "",
        include_in_menu: categoryObj.include_in_menu || false
    }

    return category;
}

export const convertDbCategoryToNormal = (categoryDb:any):TCategory => {
    const category:TCategory = {
        _id: categoryDb._id,
        name: categoryDb.name,
        include_in_menu: categoryDb.include_in_menu
    }
    return category;
}