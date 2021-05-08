import { IAttribute, IAttributeInput, IValue, IValueInput } from '../interfaces/attribute';

const convertValueObjToDbFormat = (value:any = {}):IValueInput => {
    return {
        name: value.name
    }
}

export const convertAttributeObjectToDbFormat = (attributeObj:any = {}): IAttributeInput => {
    return {
        name: attributeObj.name,
        type: attributeObj.type,
        values: attributeObj.values?.map(convertValueObjToDbFormat) || []
    }
}

const convertDbValueToNormal = (value:any = {}): IValue => {
    return {
        _id: value._id,
        name: value.name
    }
} 

export const convertDbAttributeToNormal = (attributeDb:any = {}): IAttribute => {
    return {
        _id: attributeDb._id,
        name: attributeDb.name,
        type: attributeDb.type,
        values: attributeDb.values?.map(convertDbValueToNormal) || []
    }
} 