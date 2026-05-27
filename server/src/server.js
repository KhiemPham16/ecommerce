require('dotenv').config();
require('module-alias/register');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { connectDB } = require('~/libs/mongodb');
const { registerRoutes } = require('~/routes');
const { responseMiddleware } = require('~/middlewares/response');
const { errorHandler } = require('~/middlewares/errorHandler');

async function bootstrap() {
    await connectDB();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(responseMiddleware);

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true
        })
    );

    app.use(helmet());
    app.use(
        helmet.crossOriginResourcePolicy({
            policy: 'cross-origin'
        })
    );

    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan('common'));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Quá nhiều yêu cầu, vui lòng thử lại sau'
        }
    });

    app.use('/api/v1', limiter);

    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    registerRoutes(app);

    app.use(errorHandler);

    app.listen(port, () => {
        console.log(`Server listening on http://localhost:${port}`);
    });
}

bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
