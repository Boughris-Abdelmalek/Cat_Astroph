const axios = require("../utils/axios");

// Magic values
const MAX_RETRIES = 3;
const DEFAULT_CAT_SKIP = 10;
const DEFAULT_CAT_LIMIT = 0;

const getCatsByFilter = async (filtertag, omit, total) => {
    // Ensure filtertag is a string before splitting
    filtertag = typeof filtertag === "string" ? filtertag : "";

    const params = new URLSearchParams({
        // find cats that have at least one tag that matches the substring provided in the query parameter.
        ["tags"]: filtertag.split(",").join(","),
        ["skip"]: omit,
        ["limit"]: total,
    });

    // Fetch all cats that correspond to the params
    const response = await axios.get(`/api/cats?${params}`);
    const cats = await response.data;

    return cats;
};

exports.getAllTags = async (req, res) => {
    try {
        // Fetch all tags
        const response = await axios.get(`/api/tags`);
        const tags = await response.data;

        res.status(200).json(tags);
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
        const cats = await getCatsByFilter(filtertag, omit, total);

        res.status(200).json(cats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

exports.matchCats = async (req, res) => {
    const { string } = req.query;

    // Checks if the string variable is not defined, or if it's defined, it's not a string or an empty string after trimming.
    if (!string || typeof string !== "string" || string.trim().length === 0) {
        res.status(400).json({
            error: "Invalid query parameter. 'substr' should be a non-empty string",
        });
        return;
    }

    try {
        // Fetch all tags
        const response1 = await axios.get(`/api/tags`);
        const tags = response1.data;

        // Filter tags based on substr
        const filteredTags = tags.filter((tag) => tag.includes(string));

        // Fetch cats that have any of the filtered tags
        const promises = filteredTags.map((tag, index) => {
            return new Promise((resolve) => {
                // Adding a delay of index * 50 ms to not saturate the api
              setTimeout(() => {
                  resolve(getCatsByFilter(tag, DEFAULT_CAT_SKIP, DEFAULT_CAT_LIMIT));
                }, index * 50);
            });
          });

        const catsByTag = await Promise.all(promises).then((result) => {
            return result.flat();
        }).catch((error) => {
            console.error(error);
            throw new Error("Too many requests");
        });

        // Remove duplicate cats
        const uniqueCats = Array.from(new Set(catsByTag));

        // Construct the response object
        const responseObj = {
            tags: filteredTags,
            count: uniqueCats.length,
            cats: uniqueCats,
        };

        res.status(200).json(responseObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
