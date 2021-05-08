import { IConfig, IConfigInput } from "../interfaces/config";

export const convertConfigObjectToDb = (configObj: any = {}):IConfigInput => {
    return {
        storeEmail: configObj.storeEmail,
        storePhone: configObj.storePhone,
        socialSites: configObj.socialSites,
        baseCurrency: configObj.baseCurrency,
        logo: configObj.logo,
        productsPerPage: configObj.productsPerPage
    }
}

export const convertDbConfigToNormal = (dbConfig: any = { config: {} } ):any => {
    return {
        _id: dbConfig._id,
        storeEmail: dbConfig.config.storeEmail,
        storePhone: dbConfig.config.storePhone,
        socialSites: dbConfig.config.socialSites,
        baseCurrency: dbConfig.config.baseCurrency,
        logo: dbConfig.config.logo,
        productsPerPage: dbConfig.config.productsPerPage,
        paymentMethods: dbConfig.config.paymentMethods, 
        shippingMethods: dbConfig.config.shippingMethods,
    }
}