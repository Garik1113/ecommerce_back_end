import { Model, Document, Types } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import User, { IUser } from "../models/user";
import { TUser } from "../types/user";
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

class UserDb {
    protected _db: Model<any> = User;

    async signup (user: TUser): Promise<Document> {
        const userDb: Document = await this._db.create(user);
        return userDb;
    }
    async findByEmail (email: String): Promise<Document> {
        const user: Document = await this._db.findOne({email: email});
        return user;
    }
    async update (userId: string, body: any): Promise<void> {
        try {
            const updateQuery:any = {};
            for (const key in body) {
                if (Object.prototype.hasOwnProperty.call(body, key)) {
                    const element = body[key];
                    updateQuery[key] = element;
                }
            };
            await this._db.findByIdAndUpdate({"_id": "6012d2c9d73acf4945ccd045"}, updateQuery);
        } catch (error) {
            throw new ErrorHandler(401, error.message)
        }
    }
}

export default new UserDb ()