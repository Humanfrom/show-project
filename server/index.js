const express = require('express');
const corsMiddleware = require('./src/middleware/cors.middleware');
const start = require('./src/app');

const authRouter = require("./src/routes/auth.routes");
const apiRouter = require("./src/routes/api.routes");
const app = express();

app.use(corsMiddleware);
app.use(express.json())
app.use('/auth', authRouter);
app.use('/api', apiRouter);

start(app);