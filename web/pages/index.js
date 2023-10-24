import Link from 'next/link';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to the Invoice App</h1>
            <Link href="/invoices">View Invoices
            </Link>
        </div>
    );
};

export default HomePage;

