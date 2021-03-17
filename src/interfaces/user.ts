export interface IUserInput  {
    name: string,
    email: string,
    password: string,
    loggedIn: boolean,
}

export interface IUser extends IUserInput {
    _id: string
}