import { Request } from 'express';
import jwt  from 'jsonwebtoken';

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