import { body, validationResult } from "express-validator";

export const validate = (validations) => {

    return async (req, res, next) => {

        for (const validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }

        let errors = validationResult(req);

        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).json({ errors: errors.array() });
        }

    };
};



export const signupValidators = [
    body('email').trim().isEmail().withMessage('email is not valid'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];





export const loginValidators = [
    body('email').trim().isEmail().withMessage('email is not valid'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

