// Logger, off in release
import winston from 'winston'

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: './lib/logs/error.log', level: 'error' }),
        new winston.transports.Console({ format: winston.format.simple(), level: 'info' })
    ]
})

if (process.env.NODE_ENV == 'development') {
    logger.add(new winston.transports.Console({ format: winston.format.simple(), level: 'debug' }))
    logger.add(new winston.transports.File({ filename: './lib/logs/dev.log', level: 'debug' }))
}

// Loader for classes to make the available throughout the module


// Main Classes

export { default as accountData } from "./core/accountData.mjs";
export { default as client } from "./core/client.mjs";
export { default as message } from "./core/message.mjs";
export { eventEmitter as events } from "./core/events.mjs";

// Utility
