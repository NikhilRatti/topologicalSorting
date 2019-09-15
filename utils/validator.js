const Joi = require('@hapi/joi');



const schema = Joi.object({

    dependencyGraph: Joi.object().keys({
        tasks: Joi.array().items(
            Joi.object().keys({
                dependency: Joi.array().items(Joi.number()).required()
            }).required()
        ).required()
    }).required(),
    currentState: Joi.object().keys({
        tasks:  Joi.array().items(
            Joi.object().keys({
                status: Joi.string().valid("pending", "completed").required()
            }).required()
        ).required()
    }).required(),
    task: Joi.number().required()

})


module.exports = schema;