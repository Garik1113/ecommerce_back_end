import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import AttributeDb from '../collections/attribute';
import { convertAttributeObjectToDbFormat, convertDbAttributeToNormal } from '../common/attribute';
import { IAttribute, IAttributeInput } from '../interfaces/attribute';

class AttributeController {
    protected _db: typeof AttributeDb = AttributeDb;
    get db () {
        return this._db
    };

    public createAttribute = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const attributeInput:any = req.body;
            const attribute: IAttributeInput = convertAttributeObjectToDbFormat(attributeInput);
            await this.db.createAttribute(attribute)
            res.status(200).json({status: true})
        } catch (error) {
            next(error);
        }    
    }
    public getAttributes = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getAttributes();
            const attributes:IAttribute[] = documents.map(convertDbAttributeToNormal)
            res.status(200).json({ attributes })
        } catch (error) {
            next(error);
        }    
    }
    public getAttribute = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { attribute_id } = req.params;
        try {
            const document: Document = await this.db.getAttributeById(attribute_id);
            const attribute:IAttribute = convertDbAttributeToNormal(document)
            res.status(200).json({ attribute })
        } catch (error) {
            next(error);
        }    
    }
    public deleteAttribute = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { attribute_id } = req.params;
        try {
            await this.db.deleteAttribute(attribute_id);
            res.status(200).json({ status: true })
        } catch (error) {
            next(error);
        }    
    }
    public updateAttribute = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        const { attribute_id } = req.params;
        try {
            const attribute:IAttributeInput = convertAttributeObjectToDbFormat(req.body)
            await this.db.updateAttribute(attribute_id, attribute);
            res.status(200).json({ status: true })
        } catch (error) {
            next(error);
        }    
    }
}

export default new AttributeController();