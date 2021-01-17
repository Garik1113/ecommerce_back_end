const { body } = require('express-validator')

export const validateCreateUser = () => {
    return [ 
        body('firstName', 'First Name is Required').exists(),
        body('lastName', 'Last Name is Required').exists(),
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

export const validateAddToCart = () => {
    return [
        body('itemId', 'itemId was not provided').exists(),
        body('cartId', 'cartId was not provided').exists(),
        body('quantity', 'quantity was not provided').exists()
    ]
}