const { body } = require('express-validator')

export const validateCreateUser = () => {
    return [ 
        body('name', 'Name is Required').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password is required")
    ];
}

export const validateSignin = () => {
    return [
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password is required").exists()
    ]
}

export const validateCreateCustomer = () => {
    return [ 
        body('firstName', 'First name is Required').exists(),
        body('lastName', 'Last name is Required').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password is required")
    ];
}

export const validateCustomerSignin = () => {
    return [
        body('email', 'Invalid email').exists().isEmail(),
        body('password', "Password is required").exists()
    ]
}


export const validateAddToCart = () => {
    return [
        body('productId', 'productId was not provided').exists(),
        body('quantity', 'quantity was not provided').exists()
    ]
}