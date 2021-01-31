const auth = require("../Middlewares/Auth.middleware");
const ImageController = require("../Controllers/Image.controller");

const { Router } = require("express");

const ImageRouter = new Router();

// Create new favorite
ImageRouter.post("/favorite", auth, ImageController.favorite);

// Delete favorite
ImageRouter.delete("/favorite", auth, ImageController.unfavorite);

// Get favorite images
ImageRouter.get("/favorite", auth, ImageController.all);

// Search for images
ImageRouter.get("/search", auth, ImageController.search);

// Render image search page
ImageRouter.get("/", auth, ImageController.results);

// Change image name
ImageRouter.patch("/", auth, ImageController.changeName);

module.exports = ImageRouter;