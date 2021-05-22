
export interface IFaqInput {
    question: string,
    answer: string
}

export interface IFaq extends IFaqInput{
    _id: String
}