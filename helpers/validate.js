const validator = require("validator");
const validateArticle = (params) => {

    let validar_titulo = !validator.isEmpty(params.title) &
        validator.isLength(params.title, { min: 5, max: undefined })

    let validar_contenido = !validator.isEmpty(params.title)

    if (!validar_titulo || !validar_contenido) {
        throw new Error("No se ha validado la informacion")
    }
}

module.exports = {
    validateArticle
}