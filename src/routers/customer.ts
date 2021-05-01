import { Router} from "express";
import CustomerController from '../controllers/customer';
import { validateCreateCustomer, validateCustomerSignin } from "../helpers/validation";
import { verifyCustomerToken, verifyToken } from "../helpers/jwt";

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
        this._router.post('/addresses', verifyCustomerToken, this._controller.addCustomerAddress);
        this._router.put('/addresses/:addressId', verifyCustomerToken, this._controller.editCustomerAddress);
        this._router.delete('/addresses/:addressId', verifyCustomerToken, this._controller.deleteCustomerAddress);
        this._router.get('/admin/', verifyToken, this._controller.getCustomers);
        this._router.delete('/admin/:customerId', verifyToken, this._controller.deleteCustomer);
    }
}

export = new CustomerRouter().router;