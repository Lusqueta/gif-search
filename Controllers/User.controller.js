const UserModel = require("../Models/User.model");
const bcrypt = require("bcryptjs");

const ImageController = require("../Controllers/Image.controller");

class UserController {


    async register ( req, res ) {

        try {

            const userNameTaken = await UserModel.findOne({username: req.body.username});
            const emailTaken = await UserModel.findOne({email: req.body.email});

            if (userNameTaken) {
                throw new Error("Username taken.");
            }

            if (emailTaken) {
                throw new Error("Email taken.");
            }

            const user = await new UserModel(req.body);
            const token = await user.generateAuthToken();

            await user.save();

            console.log(`🆕 [register] -> new user "${user.username}" registered.`);

            res.cookie("AuthToken", token);
            res.status(201).send({token});

        } catch (e) {
            
            console.log(`😭 [register] -> ${e}`);
            res.status(400).send(e.message);

        }

    }

    async favorites ( req, res ) {

        try {

            if ( !req.authenticated ) {
                res.status(401).send();
                return;
            }

            const user = req.user;
            const favorites = await ImageController.allByUser(user);

            res.status(200).render("userFavorites.ejs", {user, favorites});

        } catch (e) {

            console.log(`😭 [favorites] -> ${e}`);
            res.status(404).send();

        }

    }

    async login ( req, res ) {

        try {

            const {email, password} = req.body;

            const found = await UserModel.findOne({email});

            if(!found || ! await bcrypt.compare(password, found.password)) {
                throw new Error("Unable to login.");
            }

            const token = await found.generateAuthToken();

            await found.save();

            console.log(`🎟 [login] -> ${found.username} logged in.`)

            res.cookie("AuthToken", token);
            res.status(200).send();


        } catch (e) {

            console.log(`😭 [login] -> ${e}`);
            res.status(401).send();

        }

    }

    async logout ( req, res ) {

        try {

            if ( !req.authenticated ) {
                res.status(401).send();
                return;
            }

            const user = req.user;
            const acutalToken = req.authToken;

            user.tokens = user.tokens.filter( token => {
                token.token !== acutalToken.token
            });

            await user.save();

            console.log(`🚪 [logout] -> ${user.username} logged out.`)

            res.clearCookie("AuthToken");

            res.status(200).send();


        } catch (e) {

            console.log(`😭 [logout] -> ${e}`);
            res.status(500).send();

        }

    }

}

module.exports = new UserController;