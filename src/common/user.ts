import bcrypt from 'bcryptjs';
import { IUserInput, IUser } from '../interfaces/user';

export const hashPassword = (password: string) => bcrypt.hashSync(password, 12);
export const comparePasswords = (password: string, hashPassword: string) => bcrypt.compareSync(password, hashPassword);

export const convertUserObjecttToDbFormat = (userObject: any): IUserInput => {
    const user: IUserInput = {
        name: userObject.name,
        email: userObject.email,
        password: hashPassword(userObject.password),
        loggedIn: false
    };

    return user;
}

export const convertDbUserToNormal = (dbUser: any): IUser => {
    const user: IUser = {
        _id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        password: dbUser.password,
        loggedIn: dbUser.loggedIn
    };

    return user;
}