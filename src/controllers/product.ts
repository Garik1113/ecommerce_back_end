import { Model, Document } from "mongoose";
import { prepareProductData, convertProductObjectToDbFormat } from "../common/product";
import ErrorHandler from "../models/errorHandler";
import { IProductInput, IProduct, IConfigurableAttribute } from "../interfaces/product";
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
import { IAttribute, IValue } from "../interfaces/attribute";
import { convertDbAttributeToNormal } from "../common/attribute";
import productsubscriptions from '../collections/productsubscriptions';

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
            const readyForDbProduct: IProductInput = await convertProductObjectToDbFormat(productObject);
            const productDb: Document = await ProductDb.createProduct({...readyForDbProduct, currency: baseCurrency});
            const product: IProduct = await prepareProductData(productDb, { withAttributeData: false });
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
    public async adminGetProductById(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        const { _id } = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: IProduct = await prepareProductData(document, { withAttributeData: false });
            res.status(200).json({ product })
        } catch (error) {
            next(error)
        }
    }
    public async getProductById(req: Request, res: Response, next: NextFunction):Promise<IProductInput | any> {
        const {_id} = req.params;
        try {
            const document: Document = await ProductDb.getProductById(_id);
            const product: IProduct = await prepareProductData(document,  { withAttributeData: true });
            res.status(200).json({ product })
        } catch (error) {
            next(error)
        }
    }
    public async updateProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        const { body } = req;
        try {
            const productData = await convertProductObjectToDbFormat(body);
            await ProductDb.updateProduct(_id, productData);
            res.status(200).json({ status: "Updated" });
        } catch (error) {
            next(error) 
        }
    }
    public async deleteProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { _id } = req.params;
        try {
            const productResult = await ProductDb.getProductById(ObjectID(_id));
            const product = await prepareProductData(productResult, { withAttributeData: false });
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
    public async adminGetProducts(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        try {
            const document: any = await ProductDb.getProducts(req.query);
            const products: IProduct[] = [];
            if (document && document.products) {
                await asyncForEach(document.products, async(item: any) => {
                    const product:IProduct = await prepareProductData(item, { withAttributeData: false });
                    products.push(product)
                })
            }
            res.status(200).json({ 
                products,
                totals: document.totals
            });
        } catch (error) {
            next(error)
        }
    }
    public async getProducts(req: Request, res: Response, next: NextFunction):Promise<IProductInput[] | any> {
        try {
            const document: any = await ProductDb.getProducts(req.query);
            const documents: Document[] = await AttributeDb.getAttributes();
            const attributes:IAttribute[] = documents.map(convertDbAttributeToNormal);
            const products:IProduct[] = [];
            if (document && document.products) {
                await asyncForEach(document.products, async(item: any) => {
                    const product:IProduct = await prepareProductData(item, { withAttributeData: true });
                    products.push(product)
                })
            }
            res.status(200).json({ 
                products,
                attributes,
                totalProducts: document.totals,
                pageSize: document.perPage,
                minPrice: document.minPrice,
                maxPrice: document.maxPrice
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
    public async searchProduct(req: Request, res: Response, next: NextFunction):Promise<void> {
        const { search_query } = req.query;
        try {
            const results: Document[] = await ProductDb.searchProduct(search_query);
            const products:IProduct[] = [];
            if (results && results.length) {
                await asyncForEach(results, async(result: any) => {
                    const product = await prepareProductData(result, { withAttributeData: true });
                    products.push(product)
                })
            }
            res.status(200).json({ products })
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

module.exports = {
    prepareProductData
}