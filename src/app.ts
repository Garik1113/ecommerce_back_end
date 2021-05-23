import express, { Request, Response, NextFunction, Express } from 'express';
import ErrorHandler from './models/errorHandler';
import MainRouter from './routers/mainRouter';
import bodyParser from 'body-parser';
import Database from './db/mongoDb';
import cors from 'cors';
import expressUpload from 'express-fileupload';
import config from 'config';
import { getTokenFromRequest } from './helpers/jwt';
import jwt  from 'jsonwebtoken';
import path from 'path';

const app: Express = express();
const router = MainRouter;
 // support application/json type post data
app.use(bodyParser.json());

app.use(cors());

app.use(expressUpload())
app.use(express.static(path.resolve(__dirname, '../images')))
app.use('/images', express.static(path.resolve(__dirname, '../images'))); 
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use("*", async(req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = getTokenFromRequest(req);
    if (token) {
        jwt.verify(token, config.get("CUSTOMER_SECRET_TOKEN"), (err: any, customerId: any) => {
            if (customerId) {
               req.body.customerId = customerId;
            }
        });
        jwt.verify(token, config.get("ACCESS_SECRET_TOKEN"), (err: any, userId: any) => {
            if (userId) {
               req.body.userId = userId;
            }
        }) 
    }
    next()
})
app.use('/', router);
app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(203).send({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
        errors: err.errors
    });
});

const start = async () => {
    const port = config.get("PORT") || 5000;
    await app.listen(port, () => console.log(`Listening on port ${port}`));
    await Database.connect(); 
};

start()