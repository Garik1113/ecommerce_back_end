import { Model, Document } from "mongoose";
import { convertDbProductToNormal, convertProductObjectToDbFormat, getFiltersFromParams } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import { IProductInput, IProduct } from "../interfaces/product";
import ProductDb from '../collections/product';
import ConfigController from './config';
const ObjectID = require('mongodb').ObjectID;
import Category from "../models/category";
import { NextFunction, Request, Response } from "express";
import { asyncForEach } from '../helpers/asyncForEach';
import { uploadImage } from "../helpers/uploadImage";
import { convertDbCategoryToNormal } from "../common/category";
import { ICategory } from "../interfaces/category";
import CategoryDb from '../collections/category'
import AttributeDb from "../collections/attribute";
import { IAttribute } from "../interfaces/attribute";
import { convertDbAttributeToNormal } from "../common/attribute";
import productsubscriptions from '../collections/productsubscriptions';

const alphabet: string[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"]
class ProductController {
    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createProduct(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        const baseCurrency = await ConfigController.getConfigValue("baseCurrency") || {
            name: "AMD",
            code: "amd",
            symbol: "$"
        }
        try {
            const productObject: any = req.body;
            const readyForDbProduct: IProductInput = convertProductObjectToDbFormat(productObject);
            // for (let index = 0; index < alphabet.length; index++) {
            //     const productDb: Document = await ProductDb.createProduct({
            //         ...readyForDbProduct, name: alphabet[index]+readyForDbProduct.name, currency: baseCurrency,
            //         price: readyForDbProduct.price * (index + 1),
            //         discountedPrice: 
            //     });
            //     const product: IProduct = convertDbProductToNormal(productDb);
            //     const { categories } = product;
            //     await asyncForEach(categories, async (id:string) => {
            //         await Category.updateOne({_id: id}, {
            //             $push: {
            //                 products: ObjectID(product._id)
            //             }
            //         })
            //     })
            // }
            // res.send({ok: true})
            // return
            const productDb: Document = await ProductDb.createProduct({...readyForDbProduct, currency: baseCurrency});
            const product: IProduct = convertDbProductToNormal(productDb);
            const { categories } = product;
            await asyncForEach(categories, async (id:string) => {
                await Category.updateOne({_id: id}, {
                    $push: {
                        products: ObjectID(product._id)
                    }
                })
            })
            res.status(200).json({ product })
        } catch (error) {
            next(error);
        }
    }
    public async getProductById(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        const {_id} = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: IProduct = convertDbProductToNormal(document);
            res.status(200).json({ product })
        } catch (error) {
            next(error)
        }
    }
    public async updateProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        const { body } = req;
        try {
            await ProductDb.updateProduct(_id, convertProductObjectToDbFormat(body));
            res.status(200).json({ status: "Updated" });
        } catch (error) {
            next(error) 
        }
    }
    public async deleteProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            const productResult = await ProductDb.getProductById(ObjectID(_id));
            const product = convertDbProductToNormal(productResult);
            await asyncForEach(product.categories, async(cat: string) => {
                const categoryResult = await CategoryDb.getCategoryById(cat);
                if (categoryResult) {
                    const category = convertDbCategoryToNormal(categoryResult);
                    const { products } = category;
                    const filteredProducts = products.filter(p => String(p) != String(_id));
                    await CategoryDb.updateCategory(cat, {...category, products: filteredProducts})
                }
            });
            await productsubscriptions.deleteProductSubscriptionByProductId(_id)
            await ProductDb.deleteProduct(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }
    }
    public async getProducts(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        const { category_id } = req.params;
        let category: ICategory | null = null;
        if (category_id) {
            const categoryDb: Document = await CategoryDb.getCategoryById(category_id);
            category = convertDbCategoryToNormal(categoryDb);
        }
        try {
            const document: any = await ProductDb.getProducts(category_id, req.query);
            const products: IProduct[] = document.products.map(convertDbProductToNormal);
            const documents: Document[] = await AttributeDb.getAttributes();
            const attributes:IAttribute[] = documents.map(convertDbAttributeToNormal)
            res.status(200).json({ 
                products,
                attributes,
                totalProducts: category?.products.length || products.length,
                totals: req.body.userId && document ? document.totals : null
            });
        } catch (error) {
            next(error)
        }
    }
    public async getAllProducts(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        const { date, ids, name, limit, skip } = req.query;
        try {
            const documents: Document[] = await ProductDb.getAllProducts({ date, ids, name, limit, skip });
            const products: IProduct[] = documents.map(document => convertDbProductToNormal(document));
            res.status(200).json({ products });
        } catch (error) {
            next(error)
        }
    }
    public async searchProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { search_query } = req.query;
        try {
            const results: Document[] = await ProductDb.searchProduct(search_query);
            res.status(200).json({products: results})
        } catch (error) {
            next(error)
        }
    }
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if(req.files.image) {
                    const image: any = await req.files.image;
                    const fileName = await uploadImage('product', image, 800, 600)
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

export = new ProductController();