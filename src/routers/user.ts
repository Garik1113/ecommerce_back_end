import { NextFunction, Router, Request, Response } from "express";
import UserController from '../controllers/user';
import { Document } from 'mongoose';
import { IUserInput } from "../interfaces/user";
import { validateCreateUser, validateSignin } from "../helpers/validation";
import { validationResult, check } from 'express-validator'
import { verifyToken } from "../helpers/jwt";

class UserRouter {
    private _router: Router = Router();
    private _controller = UserController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.put('/admin/signout', verifyToken,  this._controller.signOut);
        this._router.post('/admin/signup',  validateCreateUser(),  this._controller.signup);
        this._router.post('/admin/signin', validateSignin(),  this._controller.signin);
    }
}

export = new UserRouter().router;