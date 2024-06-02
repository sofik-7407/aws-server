const mongoose = require("mongoose");
const Permission = require('../model/permission');
const responseLib = require("../libs/responseLib");
const checkLib = require("../libs/checkLib");

const serverPermission = async (req, res) => {
    try {
        // Fetch the permission document
        let permission = await Permission.findOne();

        if (!permission) {
            throw new Error("Permission document not found");
        }

        // Toggle the permission value
        permission.permission = !permission.permission;

        // Save the updated permission document
        await permission.save();

        const message = permission.permission ? "Permission is now true" : "Permission is now false";
        const apiResponse = responseLib.generate(true, message, {});
        res.status(200).send(apiResponse);
    } catch (err) {
        const apiResponse = responseLib.generate(false, err.message, {});
        res.status(500).send(apiResponse);
    }
};

module.exports = {
    serverPermission
}
