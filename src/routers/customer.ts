import { Router} from "express";
import CustomerController from '../controllers/customer';
import { validateCreateCustomer, validateCustomerSignin } from "../helpers/validation";
import { verifyCustomerToken } from "../helpers/jwt";

class CustomerRouter {
    private _router: Router = Router();
    private _controller = CustomerController;
    get router () {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    _configure() {
        this._router.post('/signup',  validateCreateCustomer(),  this._controller.signup);
        this._router.post('/signin', validateCustomerSignin(),  this._controller.signin);
        this._router.put('/signout', verifyCustomerToken,  this._controller.signOut);
        this._router.get('/', verifyCustomerToken,  this._controller.getCustomerDetails);
        this._router.put('/', verifyCustomerToken,  this._controller.updateCustomer);
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
        // this._router.get('/', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        //     try {
        //         const users: Document = await this._controller.getAll();
        //         res.status(200).json({ users });
        //     } catch (error) {
        //         next(error);
        //     };
        // });
    }
}

export = new CustomerRouter().router;