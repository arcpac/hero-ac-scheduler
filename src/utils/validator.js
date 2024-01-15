const { body } = require('express-validator');

exports.scheduleValidation = [
    body('Holiday Name').optional().isLength({ min: 5 }).withMessage('Holiday Name should have a minimum of 4 characters.'),
    body('Date').optional().custom(async value => {
        const year = value.slice(0, 4);
        const day = value.slice(6, 8);
        const month = value.slice(4, 6);

        const formattedDate = new Date(`${year}-${month}-${day}`);
        const currentYear = new Date()

        const differenceInDays = formattedDate.getTime() - currentYear.getTime()
        const daysDifference = Math.ceil(differenceInDays / (1000 * 60 * 60 * 24));

        if (Math.sign(daysDifference) < 0) {
            throw new Error('Schedule should be within 5 years');
        }
    })
];

exports.userValidation = [
    body('firstName').isLength({ min: 2 }).withMessage('Frist Name should have a minimum of 2 characters.'),
    body('lastName').isLength({ min: 2 }).withMessage('Last Name should have a minimum of 2 characters.'),
];