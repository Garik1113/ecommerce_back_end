import dotenv from 'dotenv';
import express, { Request, Response, NextFunction, Express } from 'express';
import ErrorHandler from './models/errorHandler';
import MainRouter from './routers/mainRouter';
import bodyParser from 'body-parser';
import Database from './db/mongoDb';

dotenv.config({
    path: '.env'
});

/** 
 * Express server application class.
 * @description Will later contain the routing system
*/

class Server {
    public app: Express = express();
    public router = MainRouter;
};

const server = new Server();

 // support application/json type post data
server.app.use(bodyParser.json());

//support application/x-www-form-urlencoded post data
server.app.use(bodyParser.urlencoded({ extended: true }));

server.app.use('/api', server.router);
server.app.use((err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        status: "error",
        statusCode: err.statusCode,
        message: err.message,
        errors: err.errors
    });
});



(async (port = process.env.APP_PORT || 5000) => {
    await server.app.listen(port, () => console.log(`Listening on port ${port}`));
    await Database.connect();
})();