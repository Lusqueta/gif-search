const ImageModel = require("../Models/Image.model");
const axios = require("axios");

const GIPHY_SEARCH_URL = "http://api.giphy.com/v1/gifs/search";

class ImageController {

    async favorite ( req, res ) {

        try {

            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const user = req.user;

            const {uid, name} = req.body;

            const exists = await ImageModel.findOne({uid, name, owner: user._id});

            if ( exists ) {
                throw new Error("Image already favorite.");
            }

            const image = new ImageModel({
                ...req.body,
                owner: user._id
            });

            await image.save()

            console.log(`✅ [favorite] -> ${user.username} added ${name} [${uid}] to his favorites.`)

            res.status(200).send();


        } catch (e) {
            
            console.log(`😭 [favorite] -> ${e}`);
            res.status(400).send();

        }

    }

    async allByUser ( user ) {

        const images = await ImageModel.find({owner: user._id});

        images.forEach( e => e.favorite = true );

        return images;

    }

    async all ( req, res ) {

        try {

            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const user = req.user;

            const images = await ImageModel.find({
                owner: user._id
            });
            
            console.log(`📚 [all] -> ${user.username} requested all his favorites [${images.length}]`)

            res.status(200).send(images);


        } catch (e) {
            
            console.log(`😭 [readImages] -> ${e}`);
            res.status(400).send();

        }

    }

    async results ( req, res ) {

        try {

            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const query = req.query.q;

            res.status(200).render("search.ejs", {query});


        } catch (e) {
            
            console.log(`😭 [all] -> ${e}`);
            res.status(400).send();

        }

    }

    async search ( req, res ) {

        try {

            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const user = req.user;
        
            const {
                searchString,
                offset,
                limit,
            } = req.query;

            const result = await axios.get(`${GIPHY_SEARCH_URL}?api_key=${process.env.GIPHY_API_KEY}&q=${searchString}&offset=${offset}&limit=${limit}`);
            const userFavorites = await ImageModel.find({owner: req.user._id});

            let data = result.data.data;

            data = data.map( obj => {

                const found = userFavorites.find( e => e.uid == obj.id);

                let name = "";

                if (found)
                    name = found.name;

                return {
                    uid: obj.id,
                    name,
                    favorite: found? true : false
                };

            });

            console.log(`🔎 [search] -> ${user.username} searched for "${searchString}" and got ${data.length} results.`)

            res.status(200).send(data);


        } catch (e) {
            
            console.log(`😭 [search] -> ${e}`);
            res.status(400).send();

        }

    }

    async unfavorite ( req, res ) {
        
        try {

            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const user = req.user;

            const { uid } = req.body;

            const deleted = await ImageModel.findOneAndDelete({owner: user._id, uid});

            if ( !deleted ) {
                throw new Error("Image is not favorite.");
            }

            console.log(`❌ [unfavorite] -> ${user.username} removed an gif from favorites.`)

            res.status(200).send();


        } catch (e) {
            
            console.log(`😭 [unfavorite] -> ${e}`);
            res.status(400).send();

        }

    }

    async changeName (req, res) {

        try {
            
            if (!req.authenticated) {
                res.status(401).send();
                return;
            }

            const user = req.user;

            const { uid, name } = req.body;

            const image = await ImageModel.findOne({owner: user._id, uid});

            if ( !image ) {
                throw new Error("Image is not favorite.");
            }

            const prevName = image.name;

            image.name = name;

            image.save();

            console.log(`📝 [change name] -> ${user.username} changed ${prevName} to ${name}.`)

            res.status(200).send();


        } catch (e) {
            
            console.log(`😭 [change name] -> ${e}`);
            res.status(400).send();

        }

    }

}

module.exports = new ImageController;