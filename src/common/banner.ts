import { TBanner } from "../types/banner";
import { Document } from 'mongoose'
import { IBanner } from "../models/banner";

export const convertBannerObjectToDb = (bannerObj: any = {}):TBanner => {
    return {
        image: bannerObj.image || "",
        content: bannerObj.content || "",
        contentPosition: bannerObj.contentPosition || "center-center"
    }
}

export const convertDbBannerToNormal = (dbBanner: any):TBanner => {
    return {
        _id: dbBanner._id,
        image: dbBanner.image || "",
        content: dbBanner.content || "",
        contentPosition: dbBanner.contentPosition || "center-center"
    }
}