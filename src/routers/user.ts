import { NextFunction, Router, Request, Response } from "express";
import UserController from '../controllers/user';
import { Document } from 'mongoose';

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
        this._router.post('/', async (req: Request, res: Response, next: NextFunction):Promise<void> => {    
            try {
                const result:Document = await this._controller.createOne(req.body);
                res.status(200).json(result);
            } catch (error) {
                next(error);
            };
        });
        this._router.delete('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {    
            try {
                await this._controller.deleteOne(req.params._id);
                res.status(200).json({ status: "Deleted" });
            } catch (error) {
                next(error);
            };
        });
        this._router.put('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            const { _id } = req.params;
            try {
                await this._controller.updateOne( _id, req.body);
                res.status(200).json({ status: "Updated" });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/:_id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            const { _id } = req.params;
            try {
                const user: Document = await this._controller.getOne(_id);
                res.status(200).json({ user });
            } catch (error) {
                next(error);
            };
        });
        this._router.get('/', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            try {
                const users: Document = await this._controller.getAll();
                res.status(200).json({ users });
            } catch (error) {
                next(error);
            };
        });
        this._router.post('/signin',  async (req: Request, res: Response, next: NextFunction):Promise<void> => {
            // res.status(200).json("{ users }");
            const token: string = await this._controller.signin(req.body);
            res.status(200).json("token");
        })
    }
}

export = new UserRouter().router;