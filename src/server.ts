import express ,{ Request, Response, Express, NextFunction } from "express"
import  HealthRouter from "./routes/health.route";
import BookRouter from "./routes/book.route";
import UserRouter from "./routes/user.route";
import { handleErrorMiddleware } from "./middleware/error.middleware";
export class Server {
    private static instance: Server;
    private readonly app: Express;
    constructor(){
        this.app = express();
        this.setConfiguration();
        this.registerGlobalMiddleware();
        this.setRoutes();
        this.handleError();
    }
    private setConfiguration(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private setRoutes(){
        this.app.use('/health', HealthRouter);
        this.app.use('/api/v1/books', BookRouter);
        this.app.use('/api/v1/users', UserRouter)
    }
    private registerGlobalMiddleware(){
    }
    private handleError(){
        this.app.use(handleErrorMiddleware); //this will be at the very last
    }
    static getServerInstance(){
        if(this.instance){
            return this.instance.app;
        }
        this.instance = new Server();
        return this.instance.app;
    }
}