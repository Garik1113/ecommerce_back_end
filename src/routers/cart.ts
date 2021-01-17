import { NextFunction, Router, Request, Response } from "express";
import CartController from '../controllers/cart';
import { Document } from 'mongoose';
import { TUser } from "../types/user";
import { validateAddToCart, validateCreateUser, validateSignin } from "../helpers/validation";
import { validationResult, check } from 'express-validator'
import { verifyToken } from "../helpers/jwt";

class CartRouter {
    private _router: Router = Router();
    private _controller = CartController;

    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/create', this._controller.createCart);
        this._router.put('/add_item', validateAddToCart(), this._controller.addItemToCart);
        // this._router.delete('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {    
        //     try {
        //         await this._controller.deleteOne(req.params._id);
        //         res.status(200).json({ status: "Deleted" });
        //     } catch (error) {
        //         next(error);
        //     };
        // });
        // this._router.put('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        //     const { _id } = req.params;
        //     try {
        //         await this._controller.updateOne( _id, req.body);
        //         res.status(200).json({ status: "Updated" });
        //     } catch (error) {
        //         next(error);
        //     };
        // });
        // this._router.get('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        //     const { _id } = req.params;
        //     try {
        //         const user: Document = await this._controller.getOne(_id);
        //         res.status(200).json({ user });
        //     } catch (error) {
        //         next(error);
        //     };
        // });
        
    }
}

export = new CartRouter().router;