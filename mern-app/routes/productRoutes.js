const express = require("express");
const axios = require("axios");
const Product = require("../models/Product");
const router = express.Router();

// Initialize DB with seed data
router.get("/init", async (req, res) => {
  try {
    const { data } = await axios.get(process.env.THIRD_PARTY_API_URL);
    await Product.deleteMany({}); // Clear existing data
    await Product.insertMany(data); // Seed new data
    res.status(200).json({ message: "Database initialized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/transactions", async (req, res) => {
    const { page = 1, perPage = 10, search = "", month = "" } = req.query;
    const query = {}; // Start with an empty query

    if (month) {
        // Match only the month, regardless of the year
        query.$expr = {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month)]  // Match the month only
        };
    }

    if (search.trim() !== "") {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];

        if (!isNaN(search)) {
            const price = Number(search);
            query.$or.push({ price: price });
        }
    }

    try {
        const transactions = await Product.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage))
            .select('id title description price category sold image dateOfSale'); // Ensure the fields are selected
        const total = await Product.countDocuments(query);

        res.status(200).json({ transactions, total });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ error: err.message });
    }
});



// API to get statistics
router.get("/statistics", async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }


    try {
        const year = new Date().getFullYear(); // Get the current year

        // Match items for the selected month, regardless of the year
        const statistics = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)] // Match the month only
                    }
                }
            },
            {
                $group: {
                    _id: null, // We want a single document as output
                    totalAmount: { $sum: "$price" }, // Sum of prices
                    totalSold: { $sum: { $cond: ["$sold", 1, 0] } }, // Count of sold items
                    totalNotSold: { $sum: { $cond: ["$sold", 0, 1] } } // Count of not sold items
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the output
                    totalAmount: 1,
                    totalSold: 1,
                    totalNotSold: 1
                }
            }
        ]);

        res.status(200).json(statistics.length > 0 ? statistics[0] : { totalAmount: 0, totalSold: 0, totalNotSold: 0 });
    } catch (err) {
        console.error('Error fetching statistics:', err);
        res.status(500).json({ error: err.message });
    }
});



router.get("/categories", async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }


    try {
        // Match only the month, regardless of the year
        const categoryCounts = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]  // Match the month only
                    }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            }
        ]);

        res.status(200).json(categoryCounts);
    } catch (err) {
        console.error('Error fetching category counts:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/bar-chart", async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ error: "Month is required" });
    }


    try {
        // Match only the month, regardless of the year, and group by price range
        const priceRanges = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: "$dateOfSale" }, parseInt(month)]  // Match the month only
                    }
                }
            },
            {
                $bucket: {
                    groupBy: "$price",  // Field to group by (price)
                    boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901], // Define price range boundaries
                    default: "901+",  // Label for prices above 901
                    output: {
                        count: { $sum: 1 }  // Count the number of items in each range
                    }
                }
            }
        ]);

        res.status(200).json(priceRanges);
    } catch (err) {
        console.error('Error fetching price range data:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
