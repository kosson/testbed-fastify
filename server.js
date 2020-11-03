import createApp from './app.js';

const start = async () => {
    const app = createApp({
        logger: true
    });
    try {
        await app.listen(process.env.PORT || 3000);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();