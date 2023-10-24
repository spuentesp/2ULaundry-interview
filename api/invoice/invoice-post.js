import {db} from "../db/database.js";

const checkIfInvoiceExists = (database, invoiceNumber) => {
    return new Promise((resolve, reject) => {
        database.get('SELECT * FROM invoices WHERE invoice_number = ?', invoiceNumber, (err, existingInvoice) => {
            if (err) {
                reject(err);
            }
            resolve(existingInvoice);
        });
    });
};

const insertInvoice = (database, invoice) => {
    return new Promise((resolve, reject) => {
        const stmt = database.prepare('INSERT INTO invoices (invoice_number, total, currency, invoice_date, due_date, vendor_name, remittance_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(
            invoice.invoice_number,
            invoice.total,
            invoice.currency,
            invoice.invoice_date,
            invoice.due_date,
            invoice.vendor_name,
            invoice.remittance_address,
            'pending',
            (err) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                }
                resolve();
            }
        );
    });
};

export const invoicePost = async (request, reply) => {
    try {
        const invoice = request.body;

        if (!invoice) {
            return reply.code(400).send({message: 'Bad Request - Empty request body'});
        }

        const requiredFields = ['invoice_number', 'total', 'currency', 'invoice_date', 'due_date', 'vendor_name', 'remittance_address'];

        for (const field of requiredFields) {
            if (!invoice[field]) {
                return reply.code(400).send({message: `Bad Request - Missing field: ${field}`});
            }
        }

        const database = db();

        try {
            const existingInvoice = await checkIfInvoiceExists(database, invoice.invoice_number);

            if (existingInvoice) {
                return reply.code(400).send({message: 'Bad Request - Invoice number already exists'});
            }

            await insertInvoice(database, invoice);

            return reply.code(200).send({message: 'Invoice submitted successfully'});
        } catch (error) {
            console.error(error);
            return reply.code(500).send({message: 'Internal Server Error'});
        }
    } catch (error) {
        console.error(error);
        return reply.code(500).send({message: 'Internal Server Error'});
    }
}
