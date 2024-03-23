const Product = require('../models/product.model');

const searchAndSortProducts = async (req, res) => {
    try {
        let query = {};
        const search = req.query.name || '';
        const colorFilter = req.query.color || '';
        const companyFilter = req.query.company || '';
        const priceMin = req.query.priceMin || 0; // assuming priceMin is the minimum price
        const priceMax = req.query.priceMax || Infinity; // assuming priceMax is the maximum price
        const headphoneType = req.query.headphone_type || '';
        const sortBy = req.query.sortBy || ''; // Sorting option

        if (search) {
            query.name = { $regex: new RegExp(search, 'i') };
        }

        if (colorFilter) {
            query.color = { $regex: new RegExp(colorFilter, 'i') };
        }

        if (companyFilter) {
            query.company = { $regex: new RegExp(companyFilter, 'i') };
        }

        if (headphoneType) {
            query.headphone_type = { $regex: new RegExp(headphoneType, 'i') };
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

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        // console.log(req.params.id)
        const product = await Product.findById(productId);
        // console.log(product)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        return res.status(200).json({ product });
    } catch (err) {
        return res.status(500).json({ error: 'Error fetching product details' });
    }
};

module.exports = { searchAndSortProducts, getProductById };
