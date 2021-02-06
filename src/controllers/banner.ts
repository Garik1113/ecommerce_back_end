import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Document } from "mongoose";
import { uploadFile } from "../aws/aws";
import BannerDb from '../collections/banner';
import { convertBannerObjectToDb, convertDbBannerToNormal } from "../common/banner";
import ErrorHandler from "../models/errorHandler";
import { TBanner } from "../types/banner";

class BannerController {
    protected _db: typeof BannerDb = BannerDb;
    get db () {
        return this._db
    };

    public createBanner = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const banner: TBanner = convertBannerObjectToDb(req.body);
            const result: Document = await this.db.createBanner(banner);
            const document: Document = await this.db.getBannerById(result._id);
            const bannerResult: TBanner = convertDbBannerToNormal(document);
            res.status(200).json({banner: bannerResult});
        } catch (error) {
            next(error);
        }    
    }
    public getBannerById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getBannerById(_id);
            const banner: TBanner = convertDbBannerToNormal(document);
            res.status(200).json({ banner });
        } catch (error) {
            next(error);
        }    
    }
    public getBanners = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getBanners();
            const banners: TBanner[] = documents.map(convertDbBannerToNormal);
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
                    const fileName: string = await uploadFile('banners', req.files.image as UploadedFile);
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