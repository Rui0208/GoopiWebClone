const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    account: Joi.string()
      .email({ tlds: { allow: false } })
      .min(6)
      .max(50)
      .required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    account: Joi.string()
      .email({ tlds: { allow: false } })
      .min(6)
      .max(50)
      .required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

const profileValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    account: Joi.string()
      .email({ tlds: { allow: false } })
      .min(6)
      .max(50)
      .required(),
    phoneNumber: Joi.string().regex(/^\d{10}$/),
    lineId: Joi.string(),
  });

  return schema.validate(data);
};

const prodouctValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    quantity: Joi.number().min(0).max(9999).required(),
    price: Joi.number().min(0).max(999999).required(),
    category: Joi.string()
      .valid("TOP", "BOTTOM", "HEADWEAR", "ACCESSORIES")
      .required(),
    brand: Joi.string().required(),
    imageUrl: Joi.array().items(Joi.string()).min(1).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.prodouctValidation = prodouctValidation;
module.exports.profileValidation = profileValidation;
