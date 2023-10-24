import React from 'react';

const InvoiceList = ({invoices, onApprove}) => {
    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Invoice Number</th>
                <th>Total</th>
                <th>Currency</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Vendor Name</th>
                <th>Remittance Address</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {invoices.map((invoice) => (
                <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{invoice.invoice_number}</td>
                    <td>{invoice.total}</td>
                    <td>{invoice.currency}</td>
                    <td>{invoice.invoice_date}</td>
                    <td>{invoice.due_date}</td>
                    <td>{invoice.vendor_name}</td>
                    <td>{invoice.remittance_address}</td>
                    <td>{invoice.status}</td>
                    <td>
                        <button onClick={() => onApprove(invoice.id)}>
                            Approve
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default InvoiceList;
