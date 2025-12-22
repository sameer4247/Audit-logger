import express ,{ Request, Response, Express, NextFunction } from "express"
import  HealthRouter from "./routes/health.route";
import BookRouter from "./routes/book.route";
import UserRouter from "./routes/user.route";
import { handleErrorMiddleware } from "./middleware/error.middleware";
import { injectContextMiddleware } from "./middleware/context.middleware";
import { loggingMiddleware } from "./middleware/logging.middleware";
import { NotFoundError } from "./common/utils/custom-error";
import { auditLogMiddleware } from "./middleware/audit.middleware";
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
        this.app.use('/api/v1/users', UserRouter);
        this.app.use((req, res, next) => {
            const error = new NotFoundError(req.originalUrl);
            next(error);
        }) //404 not found
    }
    private registerGlobalMiddleware(){
        this.app.use(auditLogMiddleware);
        this.app.use(loggingMiddleware);
        this.app.use(injectContextMiddleware);
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