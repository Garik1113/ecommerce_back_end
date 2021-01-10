import jwt  from 'jsonwebtoken';

export const generateTokenWithUserId = (_id: string) => {
   return jwt.sign(_id, process.env.ACCESS_TOKEN || "");
};

