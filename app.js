/*jslint node: true */
'use strict';

import * as path from 'path'; // https://stackoverflow.com/questions/41553291/can-you-import-nodes-path-module-using-import-path-from-path
const __dirname = path.resolve(); // https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl

import fastify from 'fastify';
import *  as fastifyEnv from 'fastify-env';
import *  as fastifyStatic from 'fastify-static';
import *  as fastifyCors from 'fastify-cors';
import *  as fastifyHelmet from 'fastify-helmet';
import *  as fastifyCookie from 'fastify-cookie';
import *  as fastifyCSRF from 'fastify-csrf';
import autoload from 'fastify-autoload'; // încărcarcarea automată a rutelor
import *  as pov from 'point-of-view';
import handlebars from 'handlebars';
import { join } from 'desm';

export default function (opts, next) {

    const app = fastify(opts);

    // creează zona publică - înregistrezi pluginul!!!
    app.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/public/'
    });

    app.register(pov, {
        engine: {
            handlebars
        },
        layout: './templates/layout.hbs',
        options: {
            partials: {
                header: './templates/partials/header.hbs',
                footer: './templates/partials/footer.hbs'
            }
        }
    });

    // CONFIGURAREA MEDIULUI!!!
    const schema = {
        type: 'object',
        required: ['PORT', 'BASE_URL'],
        properties: {
            BASE_URL: { type: 'string' },
            PORT: { type: 'integer', default: 3000 },
            COOKIE_SECRET: { type: 'string' }
        }
    };
    app.register(fastifyEnv, {
        schema,
        dotenv: true
    });

    // CORS
    app.register(fastifyCors, {
        origin: true
    });

    // HELMET
    app.register(fastifyHelmet, { 
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                frameAncestors: ["'self'"],
                imgSrc: ["'self'", 'data:', 'via.placeholder.com', 'cdn.discordapp.com'], // list all the good source
                objectSrc: ["'none'"],
                scriptSrc: ["'self'", 'kit.fontawesome.com'], // list all the good source
                scriptSrcAttr: ["'none'"],
                styleSrc: ["'self'", 'https:', "'unsafe-inline'"]
            }
        }
    });

    app.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET
    });

    app.register(fastifyCSRF, { cookieOpts: { signed: true } });

    // importă rutele
    // import hello from './routes/helloworld.js'; // dacă folosești fastify-autoload, nu mai este nevoie de întregistrarea fiecărei rute individuale
    // app.register(hello);
    app.register(autoload, {
        dir: join(import.meta.url, 'routes') // import.meta.url aduce url-ul acestui fișier
    });

    // dacă este ceruă o rută care nu există, se va reîncărca automat indexul
    app.setNotFoundHandler(function letsGoToHomepage (request, reply) {
        reply.view('/templates/error.hbs', error);
        // reply.redirect('/');
    });

    return app;
}