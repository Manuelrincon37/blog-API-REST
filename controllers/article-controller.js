const fs = require("fs")
const { validateArticle } = require("../helpers/validate");
const Article = require("../models/Article");
const path = require("path")

const test = (rec, res) => {

    return res.status(200).json({
        mesnaje: "soy una accion de prueba en mi controlador de articulos"
    })
}

const curso = (req, res) => {
    console.log("se ha ejecutado el Endpoint: probando");
    return res.status(200).json(
        {
            curso: "master en react"
        }
    )
}

const create = (req, res) => {
    // Recoger parametros por POST para guardar
    let params = req.body;

    //Validar datos con "validator"
    try {
        validateArticle(params)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Crear objeto a guardar
    const article = new Article(params);

    //asginar valores a objeto en el modelo (manual o automatico)

    // Guardar el articulo en la base de datos
    article.save()
        .then((savedAricle) => {
            return res.status(200).json({
                status: 'success',
                Articulo: savedAricle,
                mensaje: 'Articulo creado con exito'
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el articulo: ' + error.message
            });
        });

    //Devolver resultado


    // Este log se muestra en consola
    console.log("Se ha ejecutado el endpoint: `Crear`");
    // return res.status(200).json({
    //     //Este mensjae se muestra en navegador o Postman
    //     mensaje: "Accion de guardar",
    //     params,
    // })
}

const listArticles = (req, res) => {

    let consulta = Article.find({});

    if (req.params.ultimos) {
        consulta.limit(2)
    }

    consulta.sort({ date: -1 })
        .then((articles) => {

            if (!articles) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se han encontrado articulos",
                });
            }

            return res.status(200).json({
                status: "Success",
                parametro: req.params.ultimos,
                contador: articles.length,
                articles
            })
        })
}

const showOne = (req, res) => {
    //Recoger una id por Url
    let articleId = req.params.id;
    //Buscar el articulo
    Article.findById(articleId)
        .then(article => {
            // Si no existe, devolver error
            if (!article) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se ha encontrado el artículo"
                });
            }
            return res.status(200).json({
                status: "Success",
                article
            });
        })
        .catch(error => {
            // Manejar el error
            return res.status(500).json({
                status: "error",
                mensaje: "Error al buscar el artículo"
            });
        });
    //Devolver resutado
}

const deleteArticle = (req, res) => {
    let articleId = req.params.id;
    Article.findOneAndDelete({ _id: articleId })
        .then(deletedAricle => {

            if (!deletedAricle) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "Error al borrar el artículo"
                });
            }

            return res.status(200).json({
                status: "Succsess",
                article: deletedAricle,
                mensaje: "Metodo de borrar"
            })
        })
        .catch(error => {
            // Manejar el error
            return res.status(500).json({
                status: "error",
                mensaje: "Server error"
            });
        });
}

const edit = (req, res) => {
    // Recoger id del articulo a editar
    let articleId = req.params.id;
    // Recoger datos del body
    let params = req.body
    // Validar datos
    try {
        validateArticle(params)
    } catch (error) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Faltan datos por enviar"
        })
    }
    // Buscar y actualizar articulo 
    Article.findOneAndUpdate({ _id: articleId }, params, { new: true })
        .then((editedArticle) => {

            if (!editedArticle) {
                return res.status(500).json({
                    status: "Error",
                    mensaje: "Error al editar"
                })
            }
            return res.status(200).json({
                status: "Success",
                editedArticle
            })
        })
        .catch(error => {
            return res.status(500).json({
                status: "Error",
                mensaje: "Error al editar"
            })
        })
    // Devolver respuesta
}

const uploadImg = (req, res) => {
    //Configurar multer

    //Recoger el fichero de la imagen
    if (!req.file && !req.files) {
        return res.status(404).json({
            status: "Error",
            mensaje: "peticion invalida"
        })
    }

    //Nombre del archivo
    let fileName = req.file.originalname

    //Extension del archivo
    let fileSplit = fileName.split("\.")
    let fileExtension = fileSplit[1]

    //Comprobar extension correcta
    if (fileExtension != "png" && fileExtension != "jpg"
        && fileExtension != "jpeg" && fileExtension != "gif") {
        //Borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Extencion de archivo invalida"
            })
        })

    } else {
        // Recoger id del articulo a editar
        let articleId = req.params.id;

        // Buscar y actualizar articulo 
        Article.findOneAndUpdate({ _id: articleId }, { img: req.file.filename }, { new: true })
            .then((editedArticle) => {

                if (!editedArticle) {
                    return res.status(500).json({
                        status: "Error",
                        mensaje: "Error al editar"
                    })
                }
                return res.status(200).json({
                    status: "Success",
                    articulo: editedArticle,
                    fichero: req.file
                })
            })
            .catch(error => {
                return res.status(500).json({
                    status: "Error",
                    mensaje: "Error al editar"
                })
            })
    }

    //Si todo va bien actualizar el articulo
}


const image = (req, res) => {
    let imageFile = req.params.imageFile
    let filePath = "./images/articles/" + imageFile

    fs.stat(filePath, (error, exist) => {
        if (exist) {
            return res.sendFile(path.resolve(filePath))
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "imagen no existe",
                error,
                exist,
                imageFile,
                filePath
            })
        }
    })
}

const find = (req, res) => {
    //Sacar el string de busqueda
    let busqueda = req.params.busqueda
    //Find OR
    Article.find({
        "$or": [
            { "title": { "$regex": busqueda, "$options": "i" } },
            { "content": { "$regex": busqueda, "$options": "i" } }
        ]
    }).sort({ date: -1 }).then((foundArticles) => {
        if (!foundArticles || foundArticles.length <= 0) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontro articulo"
            })
        }
        return res.status(200).json({
            status: "Success",
            foundArticles
        })

    })
    //Ordenar

    //Ejecutar consulta

    //devolver resultado


}

module.exports = {
    test,
    curso,
    create,
    listArticles,
    showOne,
    deleteArticle,
    edit,
    uploadImg,
    image,
    find
}