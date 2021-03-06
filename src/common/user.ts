import bcrypt from 'bcryptjs';
import { TUser } from '../types/user';

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);
export const comparePasswords = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export const convertUserObjecttToDbFormat = (userObject: any): TUser => {
    const user: TUser = {
        name: userObject.name,
        email: userObject.email,
        password: hashPassword(userObject.password),
        loggedIn: false
    };

    return user;
}

export const convertDbUserToNormal = (dbUser: any): TUser => {
    const user: TUser = {
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        password: dbUser.password,
        loggedIn: dbUser.loggedIn
    };

    return user;
}