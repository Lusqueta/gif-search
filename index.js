// .env parser
require("dotenv").config();

const ServerClass = require("./Classes/Server.class");

const cookieParser = require("cookie-parser");
const express = require("express");

( async () => {

    const Server = new ServerClass();

    await Server.initDatabase();

    await Server.registerMiddlewares([
        { middleware: express.json() },
        { middleware: cookieParser()},
        { middleware: express.urlencoded() }
    ]);

    await Server.registerRouters();
    
    await Server.start( () => {
        console.clear();
        console.log("🚀 Server started. 🚀");
    });

})();