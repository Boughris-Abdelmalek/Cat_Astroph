const axios = require("./axios");

const getTags = async () => {
    // Fetch all tags
    const response = await axios.get(`/api/tags`);
    const tags = await response.data;

    return tags;
};

const getCatNumber = async () => {
    // Fetch the cat count
    const response = await axios.get(`/api/count`);
    const count = response.data.number;

    return count;
};

const getCats = async (number) => {
    let catNumber = number || await getCatNumber();
    // Fetch all cats
    const response = await axios.get(`/api/cats?limit=${number}`);
    const cats = await response.data;

    return cats;
};

const getCatsByFilter = async (filtertag, omit, total) => {
    const count = await getCatNumber();

    const cats = await getCats(count);

    const catsByTag = cats.filter((cat) =>
        cat.tags.some((tag) => filtertag.includes(tag))
    );

    // Remove duplicate cats
    const uniqueCats = Array.from(new Set(catsByTag));

    const startIndex = omit || 0;
    const endIndex = (omit || 0) + total;

    const paginatedCats = uniqueCats.slice(startIndex, endIndex);

    // Construct the response object
    const responseObj = {
        count: paginatedCats.length,
        cats: paginatedCats,
        startIndex,
        endIndex,
    };

    return responseObj;
};

module.exports = {
    getTags,
    getCatsByFilter,
    getCats,
};
