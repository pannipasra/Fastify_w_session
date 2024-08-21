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
                return { 'login': `hi, ${name}!` }
            } catch (err) {
                throw err;
            }
        }
    )
}