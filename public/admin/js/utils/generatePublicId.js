const crypto = require("crypto");

const generatePublicId = (originalName) => {
    // remove extension
    if(!originalName){
        throw new Error("parameter is missing in generatePublicId() function")
    }
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");

    // sanitize filename
    const cleanName = nameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/-+/g, "_")
        .replace(/^-+|-+$/g, "");

    const random = crypto.randomBytes(4).toString("hex");

    return `${Date.now()}_${random}_${cleanName}`;
};

module.exports = generatePublicId
