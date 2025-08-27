# backend de la aplicacion

-verificar la version de node (node -v) - use siempre la version LTS (long time support - soporte o garantia de largo plazo)

# paquetes basicos que necesitamos
    nodemon : actualiza el servidor ante los cambios
    express : hacer las rutas de los metodos http (get, post,put,delete)
    cors : administrar la seguridad de las ips CORS (Cross-Origin Resource Sharing), en español "Intercambio de recursos de origen cruzado"
    mysql : capa para conectar con la base de datos mysql - mariadb

    npm i express nodemon cors mysql2

# se va a trabajar con es6 por lo tabnto debemos escribir en en package.json  
"type": "module", 
"start": "nodemon index.js",

- creacion de la base de datos en mysql con los requerimientos del documento 

- creacion del .env

- intalamos el dontenv
npm i dotenv 

-creacion de la carpeta src y dentro el archivo dbConexion.js

-hicimos logica de conexion a la base de datos

-creamos el index.js e importamos todo 

-prueba de conexion con la base de datos // para probar si funciono import "./src/dbConexion.js"

# creamos los modulos 
    buscar por codigo
    buscar por codigo_qr 
    crear
    eliminar definitivamente
    cambiar el estado 
    actualizar datos 

# encriptación de la contraseña
    npm install bcrypt

# generar token
    npm install jsonwebtoken
    
