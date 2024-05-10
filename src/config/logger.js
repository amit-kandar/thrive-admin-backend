const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf, colorize } = format;

const custom_format = printf((info) => {
    const { level, message, timestamp } = info;
    return `[${timestamp}] [${level}] ${message}`;
});

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'blue'
    }
};

const developmentLogger = () => {
    return createLogger({
        levels: customLevels.levels,
        format: combine(
            colorize({ all: true, colors: customLevels.colors }),
            timestamp({ format: "YY-MM-DD HH:MM:SS" }),
            custom_format,
        ),
        transports: [
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.Console(),
        ],
    });
};

const productionLogger = () => {
    return createLogger({
        levels: customLevels.levels,
        format: combine(
            colorize({ all: true, colors: customLevels.colors }),
            timestamp(),
            custom_format,
        ),
        transports: [
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            new transports.File({ filename: 'logs/info.log', level: 'info' }),
            new transports.Console(),
        ],
    });
};

let logger = developmentLogger();

if (process.env.NODE_ENV === 'production') {
    logger = productionLogger();
}

module.exports = logger;
