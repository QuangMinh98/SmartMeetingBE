import * as dotenv from 'dotenv'
dotenv.config()

const node_env: string = process.env.NODE_ENV;

const config = {
    development: {
        jwtKey: process.env.JWT_KEY,
        connectionString: process.env.CONNECTION_STRING,
        connectionStringProd: process.env.CONNECTION_STRING_PROD,
        mailAddress: process.env.MAIL_ADDRESS,
        mailPassword: process.env.MAIL_PASSWORD,
        thingworxHost: process.env.THINGWORX_HOST,
        thingworxAppKey: process.env.THINGWORX_APP_KEY
    },
    production: {
        jwtKey: process.env.JWT_KEY,
        connectionString: process.env.CONNECTION_STRING,
        connectionStringProd: process.env.CONNECTION_STRING_PROD,
        mailAddress: process.env.MAIL_ADDRESS,
        mailPassword: process.env.MAIL_PASSWORD,
        thingworxHost: process.env.THINGWORX_HOST,
        thingworxAppKey: process.env.THINGWORX_APP_KEY
    }
}

export default config[node_env]