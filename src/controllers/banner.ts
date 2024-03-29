import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import BannerDb from '../collections/banner';
import { convertBannerObjectToDb, convertDbBannerToNormal } from "../common/banner";
import ErrorHandler from "../models/errorHandler";
import { IBannerInput } from "../interfaces/banner";
import { uploadImage } from "../helpers/uploadImage";

class BannerController {
    protected _db: typeof BannerDb = BannerDb;
    get db () {
        return this._db
    };

    public createBanner = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const banner: IBannerInput = convertBannerObjectToDb(req.body);
            const result: Document = await this.db.createBanner(banner);
            const document: Document = await this.db.getBannerById(result._id);
            const bannerResult: IBannerInput = convertDbBannerToNormal(document);
            res.status(200).json({banner: bannerResult});
        } catch (error) {
            next(error);
        }    
    }
    public getBannerById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getBannerById(_id);
            const banner: IBannerInput = convertDbBannerToNormal(document);
            res.status(200).json({ banner });
        } catch (error) {
            next(error);
        }    
    }
    public getBanners = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getBanners();
            const banners: IBannerInput[] = documents.map(convertDbBannerToNormal);
            res.status(200).json({ banners });
        } catch (error) {
            next(error);
        }    
    }
    public deleteBanner = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.deleteBanner(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }    
    }
    public updateBanner =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.updateBanner(_id, req.body);
            res.status(200).json({ status: "updated" });
        } catch (error) {
            next(error);
        }    
    }
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if (req.files.image) {
                    const image: any = await req.files.image;
                    const fileName = await uploadImage('banner', image, 600, 800)
                    res.status(200).json({ fileName })
                }
            } else {
                throw new ErrorHandler(309, "Image not found")
            }
        } catch (error) {
            next(error)
        }
    }
}

export default new BannerController();