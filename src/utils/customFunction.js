const { v4: uuidv4 } = require('uuid');

const generateSixDigitId = (length) => {
    const uuid = uuidv4().replace(/-/g, '').toUpperCase(); // Remove dashes and convert to uppercase
    const hexPart = uuid.substring(0, length); // Extract the first 'length' characters
    return hexPart;
}

module.exports = { generateSixDigitId }