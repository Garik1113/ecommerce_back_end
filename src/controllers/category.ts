import { Document } from "mongoose";
import CategoryDb from '../collections/category';
import { convertCategoryObjectToDbFormat, convertDbCategoryToNormal } from '../common/category'
import { ICategory, ICategoryInput } from "../interfaces/category";
import { NextFunction, Request, Response } from "express";
import { uploadImage as uploadCategoryImage } from "../helpers/uploadImage";
import ErrorHandler from "../models/errorHandler";

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
        const { include_in_menu } = req.query;
        try {
            const categories: Document[] = await CategoryDb.getCategories(include_in_menu);
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
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if(req.files.image) {
                    const image: any = await req.files.image;
                    const fileName = await uploadCategoryImage('category', image, 1400, 500)
                    res.status(200).json({ fileName })
                }
            } else {
                throw new ErrorHandler(309, "Image not found");
            }
        } catch (error) {
            next(error)
        }
    }
}

export = new CategoryController();