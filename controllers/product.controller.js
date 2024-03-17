const Product = require('../models/product.model');

const searchAndSortProducts = async (req, res) => {
    try {
        let query = {};
        const name = req.query.name || '';
        const colorFilter = req.query.color || '';
        const companyFilter = req.query.company || '';
        const priceMin = req.query.priceMin || 0; // assuming priceMin is the minimum price
        const priceMax = req.query.priceMax || Infinity; // assuming priceMax is the maximum price
        const headphoneType = req.query.headphone || '';
        const sortBy = req.query.sortBy || ''; // Sorting option

        if (name) {
            query.name = { $regex: new RegExp(name, 'i') };
        }

        if (colorFilter) {
            query.color = { $regex: new RegExp(colorFilter, 'i') };
        }

        if (companyFilter) {
            query.company = { $regex: new RegExp(companyFilter, 'i') };
        }

        if (headphoneType) {
            query.headphoneType = { $regex: new RegExp(headphoneType, 'i') };
        }

        query.price = { $gte: priceMin, $lte: priceMax }; // Filter by price range

        let sortOptions = {};
        switch (sortBy) {
            case 'lowestPrice':
                sortOptions.price = 1;
                break;
            case 'highestPrice':
                sortOptions.price = -1;
                break;
            case 'aToZ':
                sortOptions.name = 1;
                break;
            case 'zToA':
                sortOptions.name = -1;
                break;
            default:
                sortOptions.name = 1; // Default sorting by name in ascending order
        }

        const products = await Product.find(query).sort(sortOptions);

        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ error: 'Error searching and sorting products' });
    }
}

module.exports = { searchAndSortProducts };
