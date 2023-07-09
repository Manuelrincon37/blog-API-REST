const { connection } = require("./database/connection")
const express = require("express")
const cors = require("cors");


//Inicializar la app
console.log("App de node arrancada");

// Conectar a la base de datos
connection();

// Crear servidor Node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors());

// Convertir body a objeto JS
app.use(express.json()); // Recibir datos de content-type: app/json
app.use(express.urlencoded({ extended: true })); // recibir datos mediante form/urlencoded


//RUTAS
const article_routes = require("./routes/article-route")


//Cargar las rutas
app.use("/api", article_routes)


//Rutas de prueba harcodeadas
app.get("/probando", (req, res) => {
    console.log("se ha ejecutado el Endpoint: probando");
    return res.status(200).json(
        {
            curso: "master en react"
        }
    )
})

//Crear servidor y escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor corriendo en el puerto 3900");
})