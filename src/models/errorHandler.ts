import { ValidationError } from "express-validator";

export default class ErrorHandler extends Error {
    constructor(
        public statusCode: number, 
        public message: string,
        public errors?: ValidationError[]
    ){
        super();
    }
}