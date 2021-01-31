const auth = require("../Middlewares/Auth.middleware");
const UserController = require("../Controllers/User.controller");

const { Router } = require("express");

const UserRouter = new Router();



// Create new user
UserRouter.post('/register', UserController.register);

// Login user
UserRouter.post("/login", UserController.login);

// Logout user
UserRouter.post("/logout", auth, UserController.logout);

// User favorites
UserRouter.get("/me/favorites", auth, UserController.favorites);

module.exports = UserRouter;