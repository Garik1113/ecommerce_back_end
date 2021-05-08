export interface IValueInput {
    name: string
}

export interface IValue extends IValueInput{
    _id: string
}

export interface IAttributeInput {
    name: string,
    type: string,
    values: IValueInput[]
}

export interface IAttribute extends IAttributeInput {
    _id: string,
    values: IValue[]
}