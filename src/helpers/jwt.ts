import { Request, Response, NextFunction } from 'express';
import jwt  from 'jsonwebtoken';
import ErrorHandler from '../models/errorHandler';

export const generateTokenWithUserId = (_id: string): string => {
   return jwt.sign(JSON.stringify(_id), process.env.ACCESS_TOKEN || "");
};

export const jwtVerifyToken = (token: string) => {
   return jwt.verify(token, process.env.ACCESS_TOKEN || "")
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
    if (!token) {
        next(new ErrorHandler(403, "Token is not difined"))
    } else {
        try {
            jwtVerifyToken(token);
            next();
       } catch (error) {
           next(new ErrorHandler(401, "Invalid token"))
       }
    }
}

