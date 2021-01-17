import { Document } from "mongoose";
import { ICategory } from "../models/category";
import ErrorHandler from "../models/errorHandler";
import CategoryDb from '../collections/category';
import { convertCategoryObjectToDbFormat, convertDbCategoryToNormal } from '../common/category'
import { TCategory } from "../types/category";

class CategoryController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createCategory(category:any):Promise<TCategory> {
        const formattedCategory:TCategory = convertCategoryObjectToDbFormat(category);
        try {
            const item:ICategory = await CategoryDb.createItem(formattedCategory);

            return convertDbCategoryToNormal(item);
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getCategoryById(_id: String):Promise<TCategory> {
        try {
            const categoryDb: Document = await CategoryDb.getCategoryById(_id);
            const category: TCategory =  convertDbCategoryToNormal(categoryDb);

            return category;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async deleteCategory(_id: string):Promise<void> {
        try {
            await CategoryDb.deleteCategory(_id);
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async updateCategory(_id: string,  body: any):Promise<TCategory> {
        try {
            const category:TCategory = await CategoryDb.updateCategory(_id, body);

            return category;
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(error.statusCode, error.message); 
        }
    }
    public async getAllCategories():Promise<TCategory[]> {
        try {
            const categories: TCategory[] = await CategoryDb.getCategories();
            const formatedToNormalCategories:TCategory[] = categories.map(category => convertDbCategoryToNormal(category));

            return formatedToNormalCategories;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
}

export = new CategoryController();