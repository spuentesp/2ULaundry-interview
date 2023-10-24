import {getInvoices} from './invoice-get.js';

// Define a mock database object for testing
const mockDatabase = {
    all: jest.fn(),
};

jest.mock('../db/database', () => ({
    db: () => mockDatabase,
}));

describe('getInvoices', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Clear mock function calls after each test
    });

    it('should return all invoices when no filters are provided', async () => {
        const request = {};
        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        mockDatabase.all.mockImplementation((query, filterValue, callback) => {
            // Simulate a successful database query
            callback(null, [{invoice_number: '123'}]);
        });

        await getInvoices(request, reply);

        expect(reply.send).toHaveBeenCalledWith([{invoice_number: '123'}]);
    });

    it('should return filtered invoices when filter parameters are provided', async () => {
        const request = {
            query: {
                filter_field: 'status',
                filter_value: 'paid',
            },
        };

        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        mockDatabase.all.mockImplementation((query, filterValue, callback) => {
            // Simulate a successful database query with filtering
            callback(null, [{invoice_number: '123', status: 'paid'}]);
        });

        await getInvoices(request, reply);

        expect(reply.code).toHaveBeenCalledWith(200);
        expect(reply.send).toHaveBeenCalledWith([{invoice_number: '123', status: 'paid'}]);
    });

    it('should handle database errors', async () => {
        const request = {
            query: {
                filter_field: 'status',
                filter_value: 'paid',
            },
        };

        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        mockDatabase.all.mockImplementation((query, filterValue, callback) => {
            // Simulate a database query error
            callback(new Error('Database error'));
        });

        await getInvoices(request, reply);

        expect(reply.code).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: 'Database error'});
    });

    it('should handle missing filter_field or filter_value', async () => {
        const request = {
            query: {
                filter_field: 'status',
            },
        };

        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await getInvoices(request, reply);

        expect(reply.code).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: 'Both filter_field and filter_value are required for filtering'});
    });

    it('should handle invalid filter_field', async () => {
        const request = {
            query: {
                filter_field: 'invalidField',
                filter_value: 'paid',
            },
        };

        const reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await getInvoices(request, reply);

        expect(reply.code).toHaveBeenCalledWith(400);
        expect(reply.send).toHaveBeenCalledWith({message: 'Invalid filter_field'});
    });
});
