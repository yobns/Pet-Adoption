const filter = (req, res, next) => {
    const { searchTerm, type, breed, status, weight, color } = req.query;
    const filters = {};

    if (searchTerm) {
        const searchTermRegex = new RegExp(`.*${searchTerm}.*`, 'i');
        filters.$text = { $search: searchTermRegex };
    }

    if (type) {
        if (type === 'Other')
            filters.type = { $nin: ['Dog', 'Cat'] };
        else
            filters.type = type;
    }

    if (breed)
        filters.breed = { $regex: new RegExp(`.*${breed}.*`, 'i') };

    if (status)
        filters.status = status;

    if (weight)
        filters.weight = { $lte: weight };

    if (color)
        filters.color = color;

    req.filters = filters;
    next();
}

module.exports = { filter }