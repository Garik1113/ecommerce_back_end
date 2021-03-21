export interface IFilterOptionInput {
    name: string,
    value: string
    
}

export interface IFilterOption extends IFilterOptionInput {
    _id: string
}

export interface IFilterInput {
    name: string,
    value: string,
    allowed: boolean,
    options: IFilterOptionInput[]
};

export interface IFilter extends IFilterInput {
    _id: string,
    options: IFilterOption[]
}