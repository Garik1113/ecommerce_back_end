import { Document} from "mongoose";
import ErrorHandler from "../models/errorHandler";
import { comparePasswords } from "../common/customer";
import { ICustomer, ICustomerInput } from "../interfaces/customer";
import CustomerDb from '../collections/customer';
import { Result, ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { generateTokenWithCustomerId, generateTokenWithUserId } from "../helpers/jwt";
import { convertCustomerObjecttToDbFormat, convertDbCustomerToNormal } from "../common/customer";
import CartDb from '../collections/cart';
import { createEmptycart } from '../common/cart';
import { replaceQuotes } from '../helpers/objectId';

class CustomerController {
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
            const customerDb: ICustomerInput = convertCustomerObjecttToDbFormat(req.body);
            const existCustomer = await CustomerDb.findByEmail(customerDb.email);
            if (existCustomer) {
                throw new ErrorHandler(409, "Customer with that email is already exist");
            } else {
                const cart: Document = await CartDb.creatCart({...createEmptycart()});
                const cartId: string = cart._id;
                const customerDoc: Document = await CustomerDb.createCustomer({...customerDb, cartId });
                const customer: ICustomer =  convertDbCustomerToNormal(customerDoc);
                await CartDb.updateCart(cartId, {customerId: customer._id})
                res.status(200).json({ customer });
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
            const customerDb: Document = await CustomerDb.findByEmail(email);
            if (!customerDb) {
                throw new ErrorHandler(401, "Customer with that email is not exists");
            }
            const customer: ICustomer = convertDbCustomerToNormal(customerDb);
            if (comparePasswords(password, customer.password || "")) {
                const token: string = generateTokenWithCustomerId(customerDb._id);
                await CustomerDb.update(customerDb._id, { loggedIn: true });
                res.status(200).json({ token });
            } else {
                throw new ErrorHandler(401, "Incorrect password");
            }
        } catch (error) {
            next(error);
        }
    }
    public async signOut (req: Request, res: Response, next: NextFunction):Promise<void> {
        try {
            await CustomerDb.update(req.body.customerId, { loggedIn: false });
            res.status(200).json({ok: "ok"});
        } catch (error) {
            next(error);
        }
    }
    public async getCustomerDetails (req: Request, res: Response, next: NextFunction):Promise<void> {
        const { customerId } = req.body;
        try {
            const customerDb = await CustomerDb.getCustomerById(replaceQuotes(customerId));
            const customer = convertDbCustomerToNormal(customerDb);
            res.status(200).json({customer});
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    public async updateCustomer (req: Request, res: Response, next: NextFunction):Promise<void> {
        const { customerId, data } = req.body;
        try {
            const result = await CustomerDb.update(customerId.substring(1, customerId.length - 1), data);
            const customer: ICustomer = convertDbCustomerToNormal(result)
            res.status(200).json({customer});
        } catch (error) {
            next(error);
        }
    }

}

export = new CustomerController();