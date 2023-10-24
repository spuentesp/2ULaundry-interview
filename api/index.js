import process from "os";
import Fastify from "fastify";
import cors from '@fastify/cors'
import {format} from "date-fns";
import {getInvoices} from "./invoice/invoice-get.js";
import {approveInvoice} from "./approve_invoice/approve-invoice-post.js";
import {invoicePost} from "./invoice/invoice-post.js";

const fastify = Fastify({logger: true})

await fastify.register(cors, {
    origin: '*'
})
fastify.get('/', (request, reply) => {
    const uptimeInSeconds = process.uptime();
    const startTime = new Date(Date.now() - (uptimeInSeconds * 1000));

    reply.code(200).send({
        uptime: uptimeInSeconds,
        startTime: format(startTime, 'yyyy-MM-dd HH:mm:ss'),
        message: "server is running"
    });
});

fastify.post('/invoice', invoicePost);
fastify.get('/invoice', getInvoices);

fastify.post('/invoice/approve', approveInvoice);

try {
    fastify.listen({
        host: '0.0.0.0', port: 3000,
        listenTextResolver: (address) => {
            return `server is listening at ${address}`
        }
    });
} catch (err) {
    fastify.log.error(err)
}
