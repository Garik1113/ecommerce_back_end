import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import ConfigDb from '../collections/config';
import { convertConfigObjectToDb, convertDbConfigToNormal } from "../common/config";
import ErrorHandler from "../models/errorHandler";
import { uploadImage } from "../helpers/uploadImage";
import { IConfig, IConfigInput } from "../interfaces/config";


const config = [
    {
        title: "Store Email",
        type: "text",
        id: "storeEmail",
    },
    {
        title: "Store Phone",
        type: "text",
        id: "storePhone",
    },
    {
        title: "Store Phone",
        type: "text",
        id: "storePhone",
    },
    {
        title: "Social Sites",
        type: "addSelect",
        id: "socialSites",
        options: [
            {
                name: "",
                url: ""
            }
        ]
    }
]

class ConfigController {
    protected _db: typeof ConfigDb = ConfigDb;
    get db () {
        return this._db
    };

    public createConfig = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const config = req.body
            const result: any = await this.db.createConfig(config);
            const newConfig: any = convertDbConfigToNormal(result);
            res.status(200).json({ config: newConfig });
        } catch (error) {
            next(error);
        }    
    }
    public getConfig = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const document: any = await this.db.getConfig();
            const config: any = convertDbConfigToNormal(document);
            res.status(200).json({ config });
        } catch (error) {
            next(error);
        }    
    }
    public getConfigValue = async(configName: string) => {
        try {
            const document: any = await this.db.getConfig();
            if (document) {
                const config: any = convertDbConfigToNormal(document)
                return config[configName]
            } else {
                return ""
            }
        } catch (error) {
            throw new Error("Something wents wrong")
        } 
    }
    public updateConfig =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.updateConfig(_id, req.body);
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
                    const fileName = await uploadImage('config', image, 400, 200)
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

export default new ConfigController();