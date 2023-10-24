import {invoicePost} from './invoice-post'; // Import your function
import {db} from '../db/database'; // Import the db function

describe('invoicePost', () => {
    let reply;

    beforeEach(() => {
        reply = {
            code: jest.fn(() => reply),
            send: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('should handle a valid invoice and return success', async () => {
        const requestBody = {
            invoice_number: '12345',
            total: '199.99',
            currency: 'USD',
            invoice_date: '2019-08-17',
            due_date: '2019-09-17',
            vendor_name: 'Acme Cleaners Inc.',
            remittance_address: '123 ABC St. Charlotte, NC 28209',
        }

        // Mock request and reply objects
        const request = {
            body: requestBody
        };

        // Mock the prepare, run, and finalize methods from the db function
        db().prepare = jest.fn(() => ({
            run: jest.fn(),
            finalize: jest.fn(),
        }));

        // Call your function
        await invoicePost(request, reply);

        // Check if the reply methods were called as expected
        expect(reply.code).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith({message: 'Invoice submitted successfully'});

        // Check if the prepare, run, and finalize methods were called as expected
        await expect(db().prepare).toHaveBeenCalledWith(
            'INSERT INTO invoices (invoice_number, total, currency, invoice_date, due_date, vendor_name, remittance_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
    });

    it('should handle an empty invoice and return a bad request', async () => {
        // Mock request and reply objects with missing fields
        const request = {
            body: null,
        };


        // Call your function
        await invoicePost(request, reply);

        // Check if the reply methods were called as expected
        expect(reply.code).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: 'Bad Request - Empty request body'});
    });

    it('should handle an invalid invoice and return a bad request', async () => {
        // Mock request and reply objects with missing fields
        const request = {
            body: {},
        };


        // Call your function
        await invoicePost(request, reply);

        // Check if the reply methods were called as expected
        expect(reply.code).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({
            message: 'Bad Request - Missing fields', "missingFields": ["invoice_number",
                "total",
                "currency",
                "invoice_date",
                "due_date",
                "vendor_name",
                "remittance_address"]
        })
    });
});
