import  { useState, useEffect } from 'react';
import axios from 'axios';
import './TransactionsTable.css';  // Assuming you have a separate CSS file for styling

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState('03'); // Default to March (03)

    const monthOptions = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const url = `http://localhost:5000/api/products/transactions?page=${page}&search=${encodeURIComponent(search)}&month=${selectedMonth}`;
            console.log('Fetching URL:', url);
            
            const response = await axios.get(url);
            console.log('API Response:', response.data);
    
            setTransactions(response.data.transactions || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, search, selectedMonth]); // Include selectedMonth in the dependency array

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '300px', padding: '10px' }}
                />
                <div>
                <label htmlFor="month">Select Month:</label>
                <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setPage(1); // Reset to first page on month change
                    }}
                    style={{ padding: '10px' }}
                >
                    {monthOptions.map(month => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                </div>
            </div>

            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.id}</td>
                                    <td>{tx.title}</td>
                                    <td>{tx.description}</td>
                                    <td>{tx.price}</td>
                                    <td>{tx.category}</td>
                                    <td>{tx.sold ? 'Yes' : 'No'}</td>
                                    <td>
                                        {tx.image ? (
                                            <img src={tx.image} alt={`Product ${tx.title}`} style={{ width: '50px', height: '50px' }} />
                                        ) : (
                                            <p>No image</p>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No transactions found</td>  
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <p>Page {page} of {Math.ceil(total / 10)}</p> {/* Display current page and total pages */}
                </div>
                <div>
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <button onClick={() => setPage(page + 1)}>Next</button>
                </div>
            <p>Total Transactions: {total}</p>
            </div>
        </div>
    );
};

export default TransactionsTable;
