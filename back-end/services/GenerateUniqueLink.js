const { v4: uuidv4 } = require("uuid");

const generateUniqueLink = () => {    // Generating unique link
    const uniqueId = uuidv4();
    return uniqueId;
};

module.exports = generateUniqueLink;