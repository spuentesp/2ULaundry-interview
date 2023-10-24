import {db} from "../db/database.js";

export const approveInvoice = (request, reply) => {
    try {
        const {invoice_id} = request.body;

        if (!invoice_id) {
            reply.code(400).send({message: 'Bad Request - Missing invoice_id'});
            return;
        }

        // Validate the format of the invoice_id (customize as needed).
        if (!isValidInvoiceId(invoice_id)) {
            reply.code(400).send({message: 'Bad Request - Invalid invoice_id format'});
            return;
        }

        const database = db();
        // Check if the invoice exists.
        const checkStmt = database.prepare('SELECT * FROM invoices WHERE id = ?');

        checkStmt.get(invoice_id, (checkError, checkResult) => {
            if (checkError) {
                console.error(checkError);
                reply.code(500).send({message: 'Internal Server Error'});
                return;
            }

            if (!checkResult) {
                // If no matching invoice is found, emit a 404 Not Found error.
                reply.code(404).send({message: 'Invoice not found'});
            } else {
                // If the invoice exists, update its status to "approved."
                const updateStmt = database.prepare('UPDATE invoices SET status = ? WHERE id = ?');
                updateStmt.run('approved', invoice_id, (updateError) => {
                    if (updateError) {
                        console.error(updateError);
                        reply.code(500).send({message: 'Internal Server Error'});
                    } else {
                        reply.code(200).send({message: 'Invoice approved successfully'});
                    }
                });
                updateStmt.finalize();
            }
        });
    } catch (error) {
        console.error(error);
        reply.code(500).send({message: 'Internal Server Error'});
    }
};

function isValidInvoiceId(invoice_id) {
    console.log('invoice_id::', invoice_id);
    // Assuming a format validation, customize as needed.
    // For example, it should be a positive integer.
    return /^\d+$/.test(invoice_id);
}
