import { Request, Response, NextFunction } from 'express';
import jwt  from 'jsonwebtoken';
import ErrorHandler from '../models/errorHandler';
import config from 'config';


export const generateTokenWithUserId = (_id: string): string => {
   return jwt.sign(JSON.stringify(_id), process.env.ACCESS_TOKEN || "");
};

export const jwtVerifyToken = (token: string) => {
     
}

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

