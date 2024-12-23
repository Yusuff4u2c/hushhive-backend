const {
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");
const route = require("express").Router();

route.get("/", getUsers);
route.get("/:username", getUser);
route.patch("/:id", updateUser);
route.delete("/:id", deleteUser);

module.exports = route;
