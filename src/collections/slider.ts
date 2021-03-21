import isEmpty from "lodash/isEmpty";
import { Model, Document } from "mongoose";
import Slider from "../models/slider";
import { ISliderInput } from '../interfaces/sliders';


class SliderDb {
    protected _db: Model<any> = Slider;
    get db () {
        return this._db;
    };

    async createSlider(sliderer: ISliderInput):Promise<Document> {
        const document: Document = await this.db.create(sliderer);
        return document;
    }
    async getSliderById(_id: String):Promise<Document> {
        const document: Document = await this._db.findById(_id)
        return document;
    }
    async getSliders():Promise<Document[]> {
        const documents: Document[] = await this.db.find();
        return documents;
    }
    async deleteSlider(sliderId: String):Promise<void> {
        await this.db.findByIdAndRemove(sliderId);
    }
    async getHomeSlider():Promise<Document> {
        const result:Document = await this.db.findOne({includeInHomePage: true});
        return result
    }
    async updateSlider(sliderId: String, body: any):Promise<void> {
        const filter = {"_id": sliderId};
        const updateQuery:any = {};
        if(isEmpty(body)){
            return;
        }
        for (const key in body) {
            if (Object.prototype.hasOwnProperty.call(body, key)) {
                const element = body[key];
                updateQuery[key] = element;
            }
        };
        await this.db.findByIdAndUpdate(filter, updateQuery);
    }
}

export default new SliderDb();