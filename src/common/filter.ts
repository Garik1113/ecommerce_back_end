import { IFilter, IFilterInput, IFilterOption, IFilterOptionInput } from '../interfaces/filters';

const convertFilterOptionsObjectToDb = (option:any = {}): IFilterOptionInput => {
    return {
        name: option.name,
        value: String(option.name || "").toLocaleLowerCase().trim()
    }
} 

export const convertFilterObjectToDb = (filterObj:any = {}): IFilterInput => {
    return {
        name: filterObj.name,
        allowed: filterObj.allowed,
        value: String(filterObj.name || "").toLocaleLowerCase().trim(),
        options: filterObj.options?.map(convertFilterOptionsObjectToDb) || []
    }
}

const convertDbFilterOptionsObjectToNormal = (option:any = {}): IFilterOption => {
    return {
        _id: option._id,
        name: option.name,
        value: option.value
    }
} 

export const convertDbFilterNormal = (filterObj:any = {}): IFilter => {
    return {
        _id: filterObj._id,
        name: filterObj.name,
        allowed: filterObj.allowed,
        value: filterObj.value,
        options: filterObj.options?.map(convertDbFilterOptionsObjectToNormal) || []
    }
} 