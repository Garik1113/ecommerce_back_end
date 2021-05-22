import { Model, Document } from "mongoose";
import Faq from "../models/faq";
import { IFaqInput } from '../interfaces/faq';


class FaqDb {
    protected _db: Model<any> = Faq;
    get db () {
        return this._db;
    };
    async createFaq(faq: IFaqInput):Promise<Document> {
        const document: Document = await this.db.create(faq);
        return document;
    }
    async getFaqById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id)
        return document;
    }
    async getFaqs():Promise<Document[]> {
        const documents: Document[] = await this.db.find();
        return documents;
    }
    async deleteFaq(faqId: String):Promise<void> {
        await this.db.findByIdAndRemove(faqId);
    }
    async updateFaq(faqId: String, faqData: any):Promise<void> {
        await this.db.findByIdAndUpdate(faqId, faqData);
    }
}

export default new FaqDb();