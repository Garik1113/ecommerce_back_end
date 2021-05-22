import { IFaq, IFaqInput } from '../interfaces/faq';

export const convertFaqObjectToDb = (faqObj: any = {}):IFaqInput => {
    return {
        question:faqObj.question,
        answer: faqObj.answer
    }
}

export const convertDbFaqToNormal = (faqObj: any):IFaq => {
    return {
        _id: faqObj._id || "",
        question:faqObj.question,
        answer: faqObj.answer
    }
}