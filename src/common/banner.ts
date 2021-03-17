import { IBannerInput, IBanner } from "../interfaces/banner";

export const convertBannerObjectToDb = (bannerObj: any = {}):IBannerInput => {
    return {
        image: bannerObj.image || "",
        content: bannerObj.content || "",
        contentPosition: bannerObj.contentPosition || "center-center"
    }
}

export const convertDbBannerToNormal = (dbBanner: any):IBanner=> {
    return {
        _id: dbBanner._id || "",
        image: dbBanner.image || "",
        content: dbBanner.content || "",
        contentPosition: dbBanner.contentPosition || "center-center"
    }
}