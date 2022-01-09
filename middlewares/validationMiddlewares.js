const Joi = require("joi");

module.exports = {
  addPostValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      phone: Joi.string().min(6).max(15).required(),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error)
      return res.status(400).json({ message: validationResult.error.details });

    next();
  },
};
