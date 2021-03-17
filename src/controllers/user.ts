import { Document } from "mongoose";
import ErrorHandler from "../models/errorHandler";
import { comparePasswords, convertDbUserToNormal, convertUserObjecttToDbFormat } from "../common/user";
import { IUserInput } from "../interfaces/user";
import UserDb from '../collections/user';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { generateTokenWithUserId } from "../helpers/jwt";


class UserController {
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
            const userDb: IUserInput = convertUserObjecttToDbFormat(req.body);
            const existUser = await UserDb.findByEmail(userDb.email);
            if (existUser) {
                throw new ErrorHandler(409, "User with that email is already exist");
            } else {
                const userDoc: Document = await UserDb.signup(userDb);
                const user: IUserInput =  convertDbUserToNormal(userDoc);
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
            const user: IUserInput = convertDbUserToNormal(userDb);
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
    public async signOut (req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            await UserDb.update(req.body.userId, { loggedIn: false });
            res.status(200).json({ok: "ok"});
        } catch (error) {
            next(error)
        }
    }
}

export = new UserController();