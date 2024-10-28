import express from 'express'
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import { join, dirname } from 'path'  // Aquí no es necesario volver a importar `path` por separado
import { fileURLToPath } from 'url';
import usuarios from './routes/routes.js'
import datosPersonales from './routes/RoutesDP.js'
import VAdministradorGen from './routes/routesAG.js'
import Locales from './routes/routerLocales.js'
import cors from 'cors';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());

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

// Configurar la carpeta uploads como estática
app.use('/uploads', express.static('uploads'));


//routes-------------------------------------------
app.get('/', async (req, res) => {
    res.status(200).json({ message: 'hello world' });
});

app.use(usuarios);
app.use(datosPersonales);
app.use(VAdministradorGen);
app.use(Locales);

//-----------------------------------------------
app.use(express.static(join(__dirname, 'public')));

export default app;
