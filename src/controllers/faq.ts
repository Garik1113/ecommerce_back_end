import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import FaqDb from '../collections/faq';
import { IFaqInput } from '../interfaces/faq';
import { convertDbFaqToNormal, convertFaqObjectToDb } from '../common/faq';

class FaqController {
    protected _db: typeof FaqDb = FaqDb;
    get db () {
        return this._db
    };

    public createFaq = async(req: Request, res: Response, next: NextFunction):Promise<void>=> {
        try {
            const faq: IFaqInput = convertFaqObjectToDb(req.body);
            const result: Document = await this.db.createFaq(faq);
            const document: Document = await this.db.getFaqById(result._id);
            const faqResult: IFaqInput = convertDbFaqToNormal(document);
            res.status(200).json({faq: faqResult});
        } catch (error) {
            next(error);
        }    
    }
    public getFaqById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { _id } = req.params;
        try {
            const document: Document = await this.db.getFaqById(_id);
            const faq: IFaqInput = convertDbFaqToNormal(document);
            res.status(200).json({ faq });
        } catch (error) {
            next(error);
        }    
    }
    public getFaqs = async(req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            const documents: Document[] = await this.db.getFaqs();
            const faqs: IFaqInput[] = documents.map(convertDbFaqToNormal);
            res.status(200).json({ faqs });
        } catch (error) {
            next(error);
        }    
    }
    public deleteFaq = async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.deleteFaq(_id);
            res.status(200).json({ status: "Deleted" });
        } catch (error) {
            next(error);
        }    
    }
    public updateFaq =  async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        const { _id } = req.params;
        try {
            await this.db.updateFaq(_id, req.body);
            res.status(200).json({ status: "updated" });
        } catch (error) {
            next(error);
        }    
    }
}

export default new FaqController();