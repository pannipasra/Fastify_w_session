import { FastifyInstance } from 'fastify';
import { ParamsLoginObj, ParamsLoginType } from '../schemas/auth';

export const authRoute = async (app: FastifyInstance) => {
    app.get<{ Params: ParamsLoginType }>('/login/:name',
        {
            schema: {
                params: ParamsLoginObj
            }
        },
        async (req, reply) => {
            try {
                const { name } = req.params;
                // This route will set parameters for mocking login action 🧐 
                req.session.set<any>('username', name);
                req.session.set<any>('token', `mock-token-${name}`);
                req.session.set<any>('authenticate', true);
                return { 
                    message: `hi, ${name}!`,
                    sessionId: req.session.sessionId
                }
            } catch (err) {
                throw err;
            }
        }
    )
    app.get("/info", {}, async (req, reply) => {
        try {
            // This route for checking session info
            return {
                messgae: "/info",
                sessionId: req.session.sessionId,
                session: req.session
            }
        } catch (err) {
            throw err
        }
    })
    app.get("/logout", {}, async (req, reply) => {
        try {
            // This route will destroy current session
            await req.session.destroy();
            // Redirect is essential here,
            // since, session has been destroyed. 
            // There no any session left, 
            // so it needed to initialize new session (that is not this path, absolutely)
            return reply.redirect('/api/auth/info');
        } catch (err) {
            throw err;
        }
    })
}