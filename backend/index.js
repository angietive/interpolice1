import express from "express"; //hecho con es6
import "dotenv/config";

// Debug: Verificar variables de entorno importantes
console.log('=== VARIABLES DE ENTORNO ===');
console.log('SALT:', process.env.SALT ? 'Definida' : 'No definida');
console.log('TOKEN_LIVE:', process.env.TOKEN_LIVE ? 'Definida' : 'No definida');
console.log('APP_PORT:', process.env.APP_PORT || 'No definida');
console.log('==========================');

// para probar si funciono import "./src/dbConexion.js"
import db from "./src/config/dbConexion.js";
import ciudadano from "./src/modulos/ciudadanos/ciudadano.routes.js"; //hecho con es6
import usuarios from "./src/modulos/usuarios/usuarios.routes.js"; 
import loginRoutes from "./src/modulos/login/login.routes.js";
import delitosRoutes from "./src/modulos/delitos/delito.routes.js";
import evidenciasRoutes from "./src/modulos/evidencias/evidencia.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
import cors from "cors";


const app = express();

app.use(express.json());

app.use(cors());
app.use('/qr', express.static(path.join(__dirname, 'public/qr')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.use("/", ciudadano)
app.use("/", usuarios)
app.use("/", loginRoutes);
app.use("/delitos", delitosRoutes);
app.use("/", evidenciasRoutes);

const puerto = process.env.APP_PORT || 4100;

app.listen(puerto, () => {
  console.log(`api ejecutandose en el puerto ${puerto}`);
});