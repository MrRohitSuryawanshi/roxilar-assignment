import  { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CategoryPieChart.css'; // Import the CSS file

// Color palette for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733', '#C70039', '#900C3F', '#581845'];

const CategoryPieChart = () => {
    const [month, setMonth] = useState('11');  // Default to November
    const [categoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Month options for dropdown
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

    // Fetch category data from the API when the month changes
    const fetchCategoryData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/products/categories?month=${month}`);
            setCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching category data:', error);
            setCategoryData([]);
        } finally {
            setLoading(false);
        }
    };

    // Call the fetch function whenever the `month` changes
    useEffect(() => {
        fetchCategoryData();
    }, [month]);

    return (
        <div className="piechart-container">
            <div className="piechart-card">
                <h2>Category Counts for {months.find(m => m.value === month)?.label}</h2>
                
                {/* Month Dropdown */}
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    {months.map(m => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>

                {loading ? (
                    <p>Loading...</p>
                ) : categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                dataKey="count"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={150}
                                fill="#8884d8"
                                label
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No data available for the selected month.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPieChart;
