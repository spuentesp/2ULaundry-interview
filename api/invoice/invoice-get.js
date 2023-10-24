import {db} from "../db/database.js";

const validFields = [
    'id',
    'invoice_number',
    'total',
    'currency',
    'invoice_date',
    'due_date',
    'vendor_name',
    'remittance_address',
    'status',
];

export const getInvoices = async (request, reply) => {
    try {
        const filterField = request?.query?.filter_field;
        const filterValue = request?.query?.filter_value;

        // Validate filter parameters
        if (filterField || filterValue) {
            if (!filterField || !filterValue) {
                throw new Error('Both filter_field and filter_value are required for filtering');
            }
            if (!validFields.includes(filterField)) {
                throw new Error('Invalid filter_field');
            }
        }

        // Build the SQL query
        let query = 'SELECT * FROM invoices';
        if (filterField && filterValue) {
            query += ` WHERE ${filterField} = ?`;
        }

        // Get the database instance
        const database = db();

        // Execute the query
        const rows = await new Promise((resolve, reject) => {
            database.all(query, filterValue, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        reply.code(200).send(rows);
    } catch (error) {
        console.error(error);
        reply.code(400).send({message: error.message});
    }
};
