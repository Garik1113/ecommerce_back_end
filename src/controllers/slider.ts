import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Document } from "mongoose";
import { uploadFile } from "../aws/aws";
import SliderDb from '../collections/slider';
import { convertDbSliderToNormal } from "../common/slider";
import ErrorHandler from "../models/errorHandler";
import { ISlider, ISliderInput } from '../interfaces/sliders';
import { convertSliderObjectToDb } from '../common/slider';
import fs from 'fs';
import { uploadImage } from "../helpers/uploadImage";

class SliderController {
    protected _db: typeof SliderDb = SliderDb;
    get db () {
        return this._db
    };

    public createSlider = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const slider: ISliderInput = convertSliderObjectToDb(req.body);
            const result: Document = await this.db.createSlider(slider);
            const document: Document = await this.db.getSliderById(result._id);
            const sliderResult: ISlider = convertDbSliderToNormal(document);
            res.status(200).json({slider: sliderResult});
        } catch (error) {
            next(error);
        }    
    }
    public getSliderById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getSliderById(_id);
            const slider: ISlider = convertDbSliderToNormal(document);
            res.status(200).json({ slider });
        } catch (error) {
            next(error);
        }    
    }
    public getSliders = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getSliders();
            const sliders: ISlider[] = documents.map(convertDbSliderToNormal);
            res.status(200).json({ sliders });
        } catch (error) {
            next(error);
        }    
    }
    public deleteSlider = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.deleteSlider(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }    
    }
    public updateSlider =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.updateSlider(_id, req.body);
            res.status(200).json({ status: "updated" });
        } catch (error) {
            next(error);
        }    
    }
    public getHomeSlider =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            const result:Document =  await this.db.getHomeSlider();
            const slider:ISlider = convertDbSliderToNormal(result);
            res.status(200).json({ slider });
        } catch (error) {
            next(error);
        }    
    }
    public async uploadImage(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            if (req.files) {
                if (req.files.image) {
                    const image: any = await req.files.image;
                    const fileName = await uploadImage('slider', image, 1920, 1080)
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

export default new SliderController();