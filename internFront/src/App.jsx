//import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/PriceBarChart';
import CategoryPieChart from './components/CategoryPieChart';
import './App.css'; // Import the CSS file

const App = () => {
    return (
        <Router>
            <header>
                <h1>Product Information</h1>
            </header>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                            Transactions
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/statistics" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Statistics
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bar-chart" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Bar Chart
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pie-chart" className={({ isActive }) => (isActive ? 'active' : '')}>
                            Pie Chart
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <main>
                <Routes>
                    <Route path="/" element={<TransactionsTable />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/bar-chart" element={<BarChart />} />
                    <Route path="/pie-chart" element={<CategoryPieChart />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
