import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import usuarios from './routes/routes.js';
import datosPersonales from './routes/RoutesDP.js';
import VAdministradorGen from './routes/routesAG.js';
import Locales from './routes/routerLocales.js';
import SubAdmin from './routes/routedSubAdmin.js';
import cors from 'cors';
import compression from 'compression'; // Importa compression
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

app.use(cors({
    origin: 'https://meticulous-optimism-production.up.railway.app',  // Asegúrate de que coincida con tu frontend
    credentials: true,  // Habilitar el envío de cookies
}));
// app.use(compression()); // Añade la compresión aquí
app.options('*', cors());
app.set('views', join(__dirname, 'views'));
app.engine('hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Configurar la carpeta uploads como estática
app.use('/uploads', express.static('uploads'));

// Rutas
app.get('/', async (req, res) => {
    res.status(200).json({ message: 'hello world' });
});

app.use(
    usuarios);
app.use(datosPersonales);
app.use(VAdministradorGen);
app.use(Locales);
app.use(SubAdmin);

// Estática
app.use(express.static(join(__dirname, 'public')));

export default app;
