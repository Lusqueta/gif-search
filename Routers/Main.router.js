const UserRouter = require("./User.router");
const ImageRouter = require("./Image.router");
const auth = require("../Middlewares/Auth.middleware");

const { Router } = require("express");

const mainRouter = new Router();


mainRouter.get('/', auth, ( req, res ) => {

    if ( req.authenticated ) {
        res.status(200).redirect("/users/me/favorites");
        return;
    }
    
    res.status(200).render('./login.ejs');

});

mainRouter.get("/register", auth, (req, res) => {
    
    if ( req.authenticated ) {
        res.status(200).redirect("/users/me/favorites");
        return;
    }

    res.status(200).render("./register.ejs");

});

mainRouter.use("/images", ImageRouter);
mainRouter.use('/users', UserRouter);



module.exports = mainRouter;