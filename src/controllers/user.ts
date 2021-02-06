import { Model, Document, MongooseDocument } from "mongoose";
import { deleteOne, getItemById, getItems, insertOne, updateOne, findOne } from '../common/db';
import ErrorHandler from "../models/errorHandler";
import User, { IUser } from "../models/user";
import { comparePasswords, convertDbUserToNormal, convertUserObjecttToDbFormat } from "../common/user";
import { TUser } from "../types/user";
import UserDb from '../collections/user';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { generateTokenWithUserId } from "../helpers/jwt";


class UserController {
    private _DbCollection: Model<any> = User;

    defaulMethod() {
        return {
            text:`You'ave reached the ${this.constructor.name} default method`
        };
    };
    async signup (req: Request, res: Response, next: NextFunction): Promise<void> { 
        const errors: Result<ValidationError> = validationResult(req);
        try {
            if(!errors.isEmpty()) {
                throw new ErrorHandler(402, "Validation Error", errors.array());
            }
            const userDb: TUser = convertUserObjecttToDbFormat(req.body);
            const existUser = await UserDb.findByEmail(userDb.email);
            if (existUser) {
                throw new ErrorHandler(409, "User with that email is already exist");
            } else {
                const userDoc: Document = await UserDb.signup(userDb);
                const user: TUser =  convertDbUserToNormal(userDoc);
                res.status(200).json({ user });
            }
        } catch (error) {
            next(error);
        }
    };
    public async signin (req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        const errors: Result<ValidationError> = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                throw new ErrorHandler(401, "Validation Error", errors.array());
            }
            const userDb: Document = await UserDb.findByEmail(email);
            const user: TUser = convertDbUserToNormal(userDb);
            if (!userDb) {
                throw new ErrorHandler(401, "User with that email is not exists");
            }
            if (comparePasswords(password, user.password)) {
                const token: string = generateTokenWithUserId(userDb._id);
                await UserDb.update(userDb._id, { loggedIn: true });
                res.status(200).json({ token });
            } else {
                throw new ErrorHandler(401, "Incorrect password");
            }
        } catch (error) {
            console.log(error);
            next(error);
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
    public async signOut (req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            await UserDb.update(req.body.userId, { loggedIn: false });
            res.status(200).json({ok: "ok"});
        } catch (error) {
            next(error)
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

}

export = new UserController();