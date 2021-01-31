const MainRouter = require("../Routers/Main.router");

class Server {

    constructor () {

        this.express = require("express");

        this.app = this.express();

        this.app.use(this.express.static(__dirname + "/../Public"));
    
        this.config = {
            PORT : process.env.PORT || 5000
        }

    }

    async registerMiddlewares (middlewareArray) {

        /*
        Middleware obj:
        {
            path,
            middleware
        }
        */

        middlewareArray.forEach( middlewareObj => {
            if (middlewareObj.path)
            this.app.use(middlewareObj.path, middlewareObj.middleware);
            else
            this.app.use(middlewareObj.middleware);
        });
        
    }

    async initDatabase () {

        const db = require("./Database.class");

        const Database = new db();

        await Database.connect();

    }

    async registerRouters (routers) {
        this.app.use(MainRouter);
    }

    async start ( callback ) {

        this.app.listen(this.config.PORT, callback);

    }




}

module.exports = Server;