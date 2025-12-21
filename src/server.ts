import express ,{ Express } from "express"
import { registerGlobalMiddleware } from "./middleware";
import  HealthRouter from "./routes/health.route";
export class Server {
    private static instance: Server;
    private readonly app: Express;
    constructor(){
        this.app = express();
        this.setConfiguration();
        registerGlobalMiddleware(this.app);
        this.setRoutes();
        this.handleError();
    }
    private setConfiguration(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private setRoutes(){
        this.app.use('/health', HealthRouter);
    }

    private handleError(){
      
    }
    static getServerInstance(){
        if(this.instance){
            return this.instance.app;
        }
        this.instance = new Server();
        return this.instance.app;
    }
}