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
router.post("/create", ArticleControler.create)
router.get("/articles/:last?", ArticleControler.listArticles)
router.get("/article/:id?", ArticleControler.showOne)
router.delete("/article/:id?", ArticleControler.deleteArticle)
router.put("/edit-article/:id?", ArticleControler.edit)
router.post("/upload-img/:id", [upload.single("file0")], ArticleControler.uploadImg);
router.get("/img/:imageFile", ArticleControler.image)
router.get("/search/:busqueda", ArticleControler.find)

module.exports = router;