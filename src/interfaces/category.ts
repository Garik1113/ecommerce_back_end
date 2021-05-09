export interface ICategoryInput {
    name: string,
    include_in_menu: boolean,
    image: string,
    products: string[]
}

export interface ICategory extends ICategoryInput{
    _id: String
}