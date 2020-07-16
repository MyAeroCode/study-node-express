import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import http from "http";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// server bootstrap function
export function startServer() {
    http.createServer(app).listen(3000, () => {
        console.log("http://localhost:3000");
    });
}

/**
 * 페이로드를 req.body와 req.files에 할당하는 미들웨어 적용.
 */

//
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//
// application/json
app.use(bodyParser.json());

//
// plain/text
app.use(bodyParser.text());

//
// multipart/form-data
app.use(multer().any());

//
// ehco
app.post("/", async function (req, res) {
    console.group("req");
    console.log("req.headers", req.headers);
    console.log("req.query", req.query);
    console.log("req.body", req.body);
    console.log("req.files", req.files);
    console.groupEnd();

    res.send("Hello, World!");
});
