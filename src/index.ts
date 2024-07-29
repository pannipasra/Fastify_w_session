import fastify from 'fastify';
import dotenv from "dotenv";
import buildFastify from './appFastify';

dotenv.config();

//----------------
// Define the port
//----------------
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3078;
const ADDRESS: string = process.env.ADDRESS ? process.env.ADDRESS : '0.0.0.0';
//--------------------------
// Defind Options for server
//-------------------------- 
// Define a type for the environment
type Environment = 'development' | 'production' | 'test';
// Assuming `environment` is coming from an environment variable
const environment: Environment = process.env.NODE_ENV 
                                ? process.env.NODE_ENV as Environment 
                                : 'development'; 
export const isHideInProduction = environment !== 'development' 
                                ? true 
                                : false;
console.log('[isHideInProduction]',isHideInProduction);
// https://github.com/pinojs/pino-pretty
// https://github.com/pinojs/pino-pretty
const envToLogger = {
    // Develop mode use "pino-pretty"
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    // Production mode focused PERFORMANCE use "pino"
    production: true,
    test: false,
}
//-----------------------------
// Initiate Server with options
//-----------------------------
const server = buildFastify({
    logger: envToLogger[environment] ?? true // defaults to true if no entry matches in the map
});
//-------------------------
// Start the Fastify server
//-------------------------
server.listen({ host: ADDRESS, port: PORT }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
});