const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User.model");

const auth = async (req, res, next) => {

    try {

        const token = req.cookies.AuthToken;

        if(!token) {
            throw new Error("user not loggedin.");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findOne({
            _id: decoded._id,
            "tokens.token" : token
        });

        if (!user)
            throw new Error();

        req.authenticated = true;
        req.authToken = token;
        req.user = user;

        console.log(`🔓 [Auth] -> Authorized : ${user.username}`);

        next();

    } catch (e) {
        
        console.log(`🔐 [Auth] -> ${e}`)
        req.authenticated = false;

        next();

    }

}

module.exports = auth;