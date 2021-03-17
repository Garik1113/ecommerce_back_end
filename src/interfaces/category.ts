export interface ICategoryInput {
    name: string,
    include_in_menu: boolean
}

export interface ICategory extends ICategoryInput{
    _id: String
}