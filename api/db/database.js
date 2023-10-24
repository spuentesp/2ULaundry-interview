import sqlite3 from "sqlite3";

let instancedDb = null;

export const db = () => {
    //no database? no problem.
    if (!instancedDb) {
        sqlite3.verbose()
        const db = new sqlite3.Database('invoices.db');

        // Initialize the database table
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS invoices (id INTEGER PRIMARY KEY, invoice_number TEXT UNIQUE, total TEXT, currency TEXT, invoice_date TEXT, due_date TEXT, vendor_name TEXT, remittance_address TEXT, status TEXT)');
        });
        instancedDb = db;
    }
    //if not, return the existing instance.
    return instancedDb;
}

