export default async function (app) {

    app.addSchema({
        $id: 'test',
        type: 'object',
        properties: {
            hello: { type: 'string' }
        }
    });

    // declară ruta
    app.get('/', async (request, reply) => {
        // reply.send(app.getSchemas());
        reply.view('./templates/index.hbs', { text: 'SALUTĂRI DE LA MAMAIA' });
    });
}