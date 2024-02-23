export const EnvConfigutation = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3002,
    mongodb: process.env.MONGODB,
    default_limit: +process.env.DEFAUTL_LIMIT || 7,
})