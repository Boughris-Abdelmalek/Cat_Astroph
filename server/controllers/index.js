const { getTags, getCatsByFilter, getCats } = require("../utils/api");

const apicache = require("apicache");
const cache = apicache.middleware;

exports.getAllTags = async (req, res) => {
    try {
        const tags = await getTags();

        res.status(200).json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.getAllCats = async (req, res) => {
    try {
        const cats = await getCats();

        res.status(200).json(cats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.filterCats = async (req, res) => {
    const { filtertag, omit, total } = req.query;

    // Enforce queries
    if (!filtertag || !omit || !total) {
        return res.status(400).json({
            error: "Bad Request",
            messsage: "filtertag, omit and total parameters are required",
        });
    }

    const omitNum = parseInt(omit);
    const totalNum = parseInt(total);

    if (isNaN(omitNum) || isNaN(totalNum)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "omit and total should be valid numbers",
        });
    }

    try {
        const paginatedCats = await getCatsByFilter(
            filtertag,
            omitNum,
            totalNum
        );

        res.status(200).json(paginatedCats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.matchCats = async (req, res) => {
    const { string, omit, total } = req.query;

    // Checks if the string variable is not defined, or if it's defined, it's not a string or an empty string after trimming.
    if (!string || typeof string !== "string" || string.trim().length === 0) {
        res.status(400).json({
            error: "Invalid query parameter. 'substr' should be a non-empty string",
        });
        return;
    }

    // Parse skip and limit query parameters to integers
    const omitNum = parseInt(omit);
    const totalNum = parseInt(total);

    if (isNaN(omitNum) || isNaN(totalNum)) {
        return res.status(400).json({
            error: "Bad Request",
            message: "skip and limit should be valid numbers",
        });
    }
    try {
        const tags = await getTags();

        // Filter tags based on substr
        const filteredTags = tags.filter((tag) => tag.includes(string));

        const paginatedCats = await getCatsByFilter(
            filteredTags,
            omitNum,
            totalNum
        );

        res.status(200).json(paginatedCats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
