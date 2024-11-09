import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';

import routes from './routes';

import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { isHideInProduction } from '.';


function buildFastify(opts = {}) {
    //---------------------------------------------
    // Initiate fastify
    //---------------------------------------------
    const app = fastify(opts);
    const store = new RedisStore({
        client: new Redis({
            enableAutoPipelining: true,
            port: 6379, // Redis port
            host: "127.0.0.1", // Redis host
            username: "default", // needs Redis >= 6
            password: "1234",
            db: 0, // Defaults to 0
        })
    });
    //---------------------------------------------
    // Error Handler Globally
    //---------------------------------------------
    app.setErrorHandler(function (error, request, reply) {
        const statusCode = error.statusCode;
        if (!statusCode || statusCode >= 500) {
            this.log.error(error);
            reply.status(500).send({
                statusCode: 500,
                code: "CUSTOM_ERR_INTERNAL_SERVER",
                error: "Internal Server Error",
                message: "Something went wrong in server."
            })
        } else {
            this.log.info(error)
            reply.status(statusCode).send(error);
        }
    })
    //---------------------------------------------
    // Plugin(s)
    //---------------------------------------------
    app.register(fastifyCookie);
    app.register(fastifySession, {
        secret: "a secret with minimum length of 32 characters",
        cookie: {
            maxAge: 60 * 60 * 1 * 1000, // sec * min * hr * day * 1000
            secure: isHideInProduction ? isHideInProduction : false,
            sameSite: isHideInProduction ? 'none' : undefined
        },
        store
    })
    //---------------------------------------------
    // Route(s)
    //---------------------------------------------
    app.get('/', (req, reply) => { reply.send({ 'hello': 'world!' }) });
    app.register(routes.authRoute, { prefix: '/api/auth' });


    return app;
}
export default buildFastify;