import express from "express";
import cors from "cors";
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

//
// 커스텀 미들웨어에서 헤더 설정
// app.use(async function (req, res, next) {
// res.header("Access-Control-Allow-Origin", "*");
// next();
// });

//
// 미들웨어 수준에서 CORS 적용
app.use(cors());

//
// Hello, World!
app.post(
    "/",
    // cors(), // 라우트 핸들러 수준에서 CORS 적용
    async function (req, res) {
        //
        // 라우트 핸들러에서 헤더 설정
        // res.header("Access-Control-Allow-Origin", "*");

        res.send("Hello, World!");
    }
);
