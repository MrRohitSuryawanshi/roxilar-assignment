import  { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import './PriceBarChart.css'; // Import the CSS file

const PriceBarChart = () => {
    const [month, setMonth] = useState('11');  // Default to November
    const [priceData, setPriceData] = useState([]);
    const [loading, setLoading] = useState(true);

    const months = [
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
        { value: '12', label: 'December' }
    ];

    const fetchPriceData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/products/bar-chart?month=${month}`);
            setPriceData(response.data);
        } catch (error) {
            console.error('Error fetching price range data:', error);
            setPriceData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPriceData();
    }, [month]);

    return (
        <div className="barchart-container">
            <div className="barchart-card">
                <h2>Price Ranges for {months.find(m => m.value === month)?.label}</h2>
                
                {/* Dropdown for Month Selection */}
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {months.map(m => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>

                {loading ? (
                    <p>Loading...</p>
                ) : priceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <RechartsBarChart data={priceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#82ca9d" barSize={50} />  {/* Set barSize to adjust the width */}
                        </RechartsBarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No data available for the selected month.</p>
                )}
            </div>
        </div>
    );
};

export default PriceBarChart;
