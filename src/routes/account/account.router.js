const express = require("express");
const { httpGetAccount, httpChangePassword, logout } = require("../../controllers/account/account.controller");
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const multer = require('multer');
const { authorizationUser } = require("../../middleware/authoriseUser");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

const accountRouter = express.Router()
accountRouter.use(authorizationUser)
accountRouter.get("/view/:id", httpGetAccount);
accountRouter.put("/change-password/", httpChangePassword);
accountRouter.post("/logout", logout)

accountRouter.route('/view/image/:id').post(upload.single('photo'), (req, res) => {
    console.log(req.file)

});

module.exports = accountRouter