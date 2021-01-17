import { Model, Document } from "mongoose"
import User, { IUser } from "../models/user"
import { TUser } from "../types/user"

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
}

export default new UserDb ()