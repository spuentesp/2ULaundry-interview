import Link from 'next/link';
import {useEffect, useState} from 'react';
import axios from 'axios';
import InvoiceList from "./components/InvoiceList";


const API_ADDR = "http://localhost:3001/"

const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);

    async function fetchInvoices() {
        try {
            const response = await axios.get(API_ADDR + 'invoice?filter_field=status&filter_value=pending');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            alert("Error fetching invoices::" + error);
        }
    }

    useEffect(() => {
        // Fetch the list of invoices when the component mounts
        fetchInvoices();
    }, []);

    const approveInvoice = async (invoiceId) => {
        try {
            // Send a POST request to approve the invoice
            await axios.post(API_ADDR + 'invoice/approve', {invoice_id: invoiceId});
            // Refresh the invoice list
            fetchInvoices().then(() => {
                alert("invoice approved.")
            })
        } catch (error) {
            console.error('Error approving invoice:', error);
            alert("Error approving invoice::" + error)
        }
    };

    return (
        <div>
            <h1>Invoices</h1>
            <Link href="/">
                Go back to Home
            </Link>

            {/* Use the InvoiceList component to display invoices */}
            <InvoiceList invoices={invoices} onApprove={approveInvoice}/>
        </div>
    );
};

export default InvoicesPage;
