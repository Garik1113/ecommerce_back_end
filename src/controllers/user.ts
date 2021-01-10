import { Model, Document } from "mongoose";
import { deleteOne, getItemById, getItems, insertOne, updateOne, findOne } from '../common/db';
import ErrorHandler from "../models/errorHandler";
import User, { IUser } from "../models/user";
import bcrypt from 'bcryptjs';

class UserController {
    private _DbCollection: Model<any> = User;

    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    public async createOne(userObject:IUser):Promise<Document> {
        const { password } = userObject;
        const hashedPassword = await bcrypt.hash(password, 12);
        userObject.password = hashedPassword;
        try {
            const user:Document = await insertOne(this._DbCollection, userObject);
            return user;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async deleteOne(_id: string):Promise<void> {
        try {
            await deleteOne(this._DbCollection, _id);
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async updateOne(_id: string,  body: any):Promise<void> {
        try {
            await updateOne(this._DbCollection, _id, body);
        } catch (error) {
            console.log(error);
            throw new ErrorHandler(error.statusCode, error.message); 
        }
    }
    public async getOne(queryObj:any):Promise<Document> {
        try {
            const user:Document = await getItemById(this._DbCollection, queryObj);
            return user;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async getAll():Promise<Document> {
        try {
            const users: Document = await getItems(this._DbCollection);
            return users;
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }
    public async signin(body:any) {
        const { email, password } = body;
        try {
            const user:Document<any> = await findOne(this._DbCollection, {email: email});
            if (user) {
               const isPasswordCorrect = await bcrypt.compare(password, user.password);
               console.log(isPasswordCorrect)
            }
            console.log(user);
            return "s";
            
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(error.statusCode, error.message);
        }
    }

}

export = new UserController();