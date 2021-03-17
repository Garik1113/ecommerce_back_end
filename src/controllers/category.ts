import { Document } from "mongoose";
import CategoryDb from '../collections/category';
import { convertCategoryObjectToDbFormat, convertDbCategoryToNormal } from '../common/category'
import { ICategory, ICategoryInput } from "../interfaces/category";
import { NextFunction, Request, Response } from "express";

class CategoryController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createCategory(req: Request, res: Response, next: NextFunction):Promise<void> {
        const categoryIbj: any = req.body;
        const formattedCategory:ICategoryInput = convertCategoryObjectToDbFormat(categoryIbj);
        try {
            const item:Document = await CategoryDb.createItem(formattedCategory);
            const result:Document = await CategoryDb.getCategoryById(item._id);
            res.status(200).json({category: convertDbCategoryToNormal(result)})
        } catch (error) {
           next(error)
        }
    }
    public async getAllCategories(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            const categories: Document[] = await CategoryDb.getCategories();
            const formatedToNormalCategories:ICategory[] = categories.map(convertDbCategoryToNormal);

            res.status(200).json({categories: formatedToNormalCategories});
        } catch (error) {
            next(error);
        }
    }
    public async getCategoryById(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            const categoryDb: Document = await CategoryDb.getCategoryById(_id);
            const category: ICategory=  convertDbCategoryToNormal(categoryDb);
            res.status(200).json({category});
        } catch (error) {
            next(error)
        }
    }
    public async deleteCategory(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            await CategoryDb.deleteCategory(_id);
            res.status(200).json({status: "deleted"});
        } catch (error) {
            next(error);
        }
    }
    public async updateCategory(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            await CategoryDb.updateCategory(_id, req.body);
            res.status(200).json({status: 'updated'})
        } catch (error) {
            next(error);
        }
    }
}

export = new CategoryController();