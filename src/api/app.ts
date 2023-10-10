import express from 'express';
import { htmlHandler } from './html.handler';
import { svgHandler } from './svg.handler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router();

router.get('/top-langs.svg', svgHandler);
router.get('/top-langs.html', htmlHandler);

app.use('/api', router);

export default app;
