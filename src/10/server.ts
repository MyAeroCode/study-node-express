import express from "express";
import cors from "cors";
import spdy from "spdy";
import path from "path";
import { Writable } from "stream";
import fs from "fs";
import http from "http";
import morgan from "morgan";

// @ts-ignore
import selfsigned from "selfsigned";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// server bootstrap function
export function startServer() {
    //
    // OPEN SSL 인증서
    const pems = selfsigned.generate();

    //
    // HTTP2 서버 생성
    spdy.createServer(
        {
            key: pems.private,
            cert: pems.cert,
        },
        app
    ).listen(3000, () => {
        console.log("http2", "https://localhost:3000");
    });

    //
    // HTTP 서버 생성
    http.createServer(app).listen(3001, () => {
        console.log("http ", "http://localhost:3001");
    });
}

//
// CORS
app.use("/", cors());

//
// Logger
app.use(morgan(":url"), function (req, res, next) {
    next();
});

//
// Use static middleware.
app.use("/resources", express.static(__dirname + "/resources"));

//
// GET
app.get("/", async function (req, res) {
    //
    // Hand over the necessary resources to the client.
    function pushFile(filePath: string) {
        //
        // Check if push is possible.
        if ((res as any).push) {
            //
            // Create push stream.
            const stream: Writable = (res as any).push(filePath, {
                req: { accept: "**/*" },
                res: {},
            });

            //
            // Register error event.
            stream.on("error", console.log);

            //
            // Write file to stream asynchronously.
            fs.readFile(path.join(__dirname, filePath), (err, buffer) => {
                if (err) {
                    //
                    // Failed to read file.
                    console.log(err);
                    stream.end();
                } else {
                    //
                    // If the file was read successfully.
                    stream.end(buffer);
                }
            });
        }
    }

    //
    // List of required files
    const filePaths = [
        "/resources/1.js",
        "/resources/2.js",
        "/resources/3.js",
        "/resources/4.js",
        "/resources/5.js",
        "/resources/hello.jpeg",
        "/resources/style.css",
    ];

    //
    // Send required files.
    filePaths.forEach((filePath) => pushFile(filePath));

    //
    // Send HTML File.
    res.sendFile(path.join(`${__dirname}/index.html`));
});
