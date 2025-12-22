import 'dotenv/config';
import { Server } from './server';
const app = Server.getServerInstance();
const port = process.env.PORT || 3000;

const server = app.listen(port, () =>{ 
    console.log(`Server running on port ${port}`);
});