import express from 'express';
import cors from 'cors'; // Import the cors middleware
import bodyParser from 'body-parser';
import server from './config/server'
import router from './adapters/routes/userRoutes'
import assignmentsRouter from './adapters/routes/assignmentRoutes'



const app = express();
const port = 3000;
// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use('/api/user', router);
app.use('/api/assignment', assignmentsRouter);



server(app, port);
