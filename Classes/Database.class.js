
class Database {

    constructor () {

        this.mongoose = require("mongoose");

        this.config = {

            ADDRESS : process.env.DB_ADDRESS,
            PORT : process.env.DB_PORT,
            NAME : process.env.DB_NAME,

            options : {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
            }

        };

    }

    async connect () {

        const URL = `mongodb://${this.config.ADDRESS}:${this.config.PORT}/${this.config.NAME}`

        try {

            await this.mongoose.connect(URL, this.config.options);
            return true;

        } catch (e) {
            return false;
        }

    }

    async disconnect () {

        try {

            await this.mongoose.disconnect();
            return true;

        } catch (e) {
            return false;
        }


    }


}


module.exports = Database;