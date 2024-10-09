import  { useState, useEffect } from 'react';
import axios from 'axios';
import './Statistics.css'; // Import the CSS file

const Statistics = () => {
    const [month, setMonth] = useState('11'); // Default to November
    const [totalSales, setTotalSales] = useState(0);
    const [totalSold, setTotalSold] = useState(0);
    const [totalNotSold, setTotalNotSold] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch statistics whenever the month changes
    useEffect(() => {
        const fetchStatistics = async () => {
            if (!month) {
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`http://localhost:5000/api/products/statistics?month=${month}`);
                console.log('API Response:', response.data); // Log the response
                
                // Ensure response has the expected fields
                if (response.data) {
                    setTotalSales(response.data.totalAmount || 0); // Default to 0 if undefined
                    setTotalSold(response.data.totalSold || 0); // Default to 0 if undefined
                    setTotalNotSold(response.data.totalNotSold || 0); // Default to 0 if undefined
                }
            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to fetch statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, [month]); // Fetch statistics when the month changes

    return (
        <div className="statistics-container">
            <div className="statistics-card">
                <h1>Statistics</h1>
                <div>
                    <label htmlFor="month">Select Month:</label>
                    <select
                        id="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                    >
                        <option value="">--Select Month--</option>
                        {Array.from({ length: 12 }, (_, i) => {
                            const monthValue = new Date(0, i).toLocaleString('default', { month: 'long' });
                            return (
                                <option key={i} value={String(i + 1).padStart(2, '0')}>
                                    {monthValue}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {totalSales >= 0 && (
                    <div>
                        <h2>Statistics for {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</h2>
                        <p>Total Sales Amount: Rs. {totalSales.toFixed(2)}</p>
                        <p>Total Sold Items: {totalSold}</p>
                        <p>Total Not Sold Items: {totalNotSold}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistics;
