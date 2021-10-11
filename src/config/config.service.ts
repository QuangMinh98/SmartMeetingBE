export class ConfigService {
    private readonly envConfig: { [key: string]: any } = null;

    constructor() {
        this.envConfig = {
            jwtKey: process.env.JWT_KEY,
            tokenExpireIn: process.env.TOKEN_EXPIREIN,
            connectionString: process.env.CONNECTION_STRING,
            connectionStringProd: process.env.CONNECTION_STRING_PROD,
            mailAddress: process.env.MAIL_ADDRESS,
            mailPassword: process.env.MAIL_PASSWORD,
            thingworxHost: process.env.THINGWORX_HOST,
            thingworxAppKey: process.env.THINGWORX_APP_KEY,
            firebaseURL: process.env.FIREBASE_URL,
            firebaseToken: process.env.FIREBASE_TOKEN
        };
    }

    get(key: string): any {
        return this.envConfig[key];
    }
}
