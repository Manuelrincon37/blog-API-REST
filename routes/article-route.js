const express = require("express")
const multer = require("multer")
const router = express.Router()
const ArticleControler = require("../controllers/article-controller")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images/articles")
    },
    filename: function (req, file, cb) {
        cb(null, "articulo" + Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage })


// Rutas de pruebas
router.get("/ruta-de-prueba", ArticleControler.test);
router.get("/curso", ArticleControler.curso);

//Ruta util(POST)
router.post("/crear", ArticleControler.create)
router.get("/articulos/:ultimos?", ArticleControler.listArticles)
router.get("/articulo/:id?", ArticleControler.showOne)
router.delete("/articulo/:id?", ArticleControler.deleteArticle)
router.put("/articulo/:id?", ArticleControler.edit)
router.post("/subir-imagen/:id", [upload.single("file0")], ArticleControler.uploadImg);
router.get("/imagen/:imageFile", ArticleControler.image)
router.get("/buscar/:busqueda", ArticleControler.find)

module.exports = router;