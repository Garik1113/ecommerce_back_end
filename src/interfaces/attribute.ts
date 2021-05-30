export interface IValueInput {
    name: string
    id: string
}

export interface IValue extends IValueInput{
    _id: string
}

export interface IAttributeInput {
    name: string,
    code: string,
    type: string,
    values: IValueInput[]
}

export interface IAttribute extends IAttributeInput {
    _id: string,
    values: IValue[]
}