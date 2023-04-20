const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

// Enable cors
app.use(cors());

app.use("/api/v1", require("./routes"))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

/* 
●GET -/api/v1/tags
This endpoint should fetch the tags from the target api and answer them. 
it works as a pure request proxy.

●GET -/api/v1/cats/filter?tag={{filtertag}}&omit={{number}}&total={{number}}
This endpoint should return information matching the filter tag.
all three fields for the url query parameters must be enforced and validated (requests that do not feature tag, omit and total parameters should return theappropriate errorand reference the error).

●GET -api/v1/cats/match?string={{substr}}This endpoint should return information about cats in a structured format. The stringkey is mandatory.The substr value will be used to find tag names that have the substring in their name.Example: if substr = br, information about cats that have bread,brazil,brown,abroad...should be compiled in the response. you can decide the structure of the response.In order to test your solution, a postman collection should be provided as well as instructionsto launch your project (https://www.postman.com/downloads/)Bonus: The project should contain a Dockerfile in order to generate adocker image of yourproject. Please provide a sh or bat script to perform the build and launchthe container.
*/
