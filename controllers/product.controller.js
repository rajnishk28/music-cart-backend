const Product = require('../models/product.model');

const searchAndSortProducts = async (req, res) => {
    try {
        let query = {};
        const searchQuery = req.query.search || '';
        const sortBy = req.query.sortBy || '';

        if (searchQuery) {
            // If search query is provided, only search by name
            query = { name: { $regex: new RegExp(searchQuery, 'i') } };
        }

        let sortOptions = {};
        switch (sortBy) {
            case 'company':
            case 'color':
            case 'price':
            case 'headphoneType':
                sortOptions[sortBy] = 1;
                break;
            default:
                sortOptions['name'] = 1;
        }

        const products = await Product.find(query).sort(sortOptions);
        return res.status(200).json({ products });
    } catch (err) {
        return res.status(500).json({ error: 'Error searching and sorting products' });
    }
}

module.exports = { searchAndSortProducts };
