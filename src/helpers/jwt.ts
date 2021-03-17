import { Request, Response, NextFunction } from 'express';
import jwt  from 'jsonwebtoken';
import ErrorHandler from '../models/errorHandler';
import config from 'config';
import { replaceQuotes } from './objectId';


export const generateTokenWithUserId = (_id: string): string => {
   return jwt.sign(JSON.stringify(_id), config.get("ACCESS_SECRET_TOKEN"));
};

export const generateTokenWithCustomerId = (_id: string): string => {
   return jwt.sign(JSON.stringify(_id), config.get("CUSTOMER_SECRET_TOKEN"));
};


export const getTokenFromRequest = (req: Request): string | undefined => {
   const tokenInHeader: any = req.header("Authorization");
   try {
      const tokentArray: string[] = tokenInHeader.split(" ");
      const token: string = tokentArray[1];
      return token;
   } catch (error) {
      return undefined;
   }
}
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined = getTokenFromRequest(req);
    try {
      if (!token) {
         throw new ErrorHandler(403, "Token is not difined");
      } else {
            jwt.verify(token, config.get("ACCESS_SECRET_TOKEN"), (err: any, user: any) => {
               if (user) {
                  req.body.userId = String(user);
                  next()
               } else {
                  throw new ErrorHandler(403, "Invalid Token")
               }
            }) 
      }
    } catch (error) {
         next(error);
    }
}

export const verifyCustomerToken = (req: Request, res: Response, next: NextFunction): void => {
   const token: string | undefined = getTokenFromRequest(req);
   try {
      if (!token) {
        throw new ErrorHandler(403, "Token is not defined");
      } else {
            jwt.verify(token, config.get("CUSTOMER_SECRET_TOKEN"), (err: any, customerId: any) => {
               if (customerId) {
                  req.body.customerId = replaceQuotes(customerId);
                  next()
               } else {
                  throw new ErrorHandler(403, "Invalid Token")
               }
            }) 
     }
   } catch (error) {
         next(error);
   }
}
