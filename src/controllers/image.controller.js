const express = require("express");
const { getUser } = require("../models/users/user.model");
const router = express.Router();

router.put("/account-image/:id", async (req, res) => {
    try {
        const userId = req.params.id
        const { image } = req.body;
        console.log(image)
        // if (!image) {
        //     return res.status(400).json({ msg: "No image selected" });
        // }
        // const result = await updateUser(userId, image)
        // res.status(result.responseCode).json(result)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = communityRouter;