import { TCurrency } from "./product";

export interface IConfigInput {
    storeEmail: string,
    storePhone: string,
    baseCurrency: TCurrency,
    socialSites: any[],
    logo: string,
    productsPerPage: number
}

export interface IConfig extends IConfigInput{
    _id: string
}
