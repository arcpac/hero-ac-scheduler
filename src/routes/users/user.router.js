const express = require("express");
const {
  httpGetUsers,
  httpDeleteUser,
  httpAddNewUser,
  httpUpdateUser,
  httpGetUser,
  httpGetUsersCount,
  httpDeactivateUser,
} = require("../../controllers/user.controller");
const { authorizationUser } = require("../../middleware/authoriseUser");
const { checkUser } = require("../../utils/checkUserType");
const { userValidation } = require("../../utils/validator");

const userRouter = express.Router();
userRouter.use(authorizationUser)
userRouter.use(checkUser(["super_admin", "administrator", "moderator", "viewer"]))
userRouter.get("/users-stats", httpGetUsersCount);

userRouter.use(checkUser(["super_admin", "administrator"]))
userRouter.get("/", httpGetUsers);
userRouter.get("/:id", httpGetUser);
userRouter.put("/deactivate/:id", httpDeactivateUser);
userRouter.delete("/:id", httpDeleteUser);

userRouter.use(checkUser(["super_admin"]))
userRouter.post("/", userValidation, httpAddNewUser)
userRouter.put("/:id", userValidation, httpUpdateUser)

module.exports = userRouter;
