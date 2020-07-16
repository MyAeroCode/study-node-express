import express, { RequestHandler } from "express";
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
// 랜덤값이 0.5보다 작다면 에러를 발생시키는 미들웨어.
const mw1: RequestHandler = async function (req, res, next) {
    const val = Math.random();
    const criteria = 0.5;
    if (val < criteria) {
        //
        // next() with error
        next(`랜덤값이 기준보다 작습니다. (${val} < ${criteria})`);
    } else {
        //
        // next()
        next();
    }
};

//
// 통과된 모든 요청에 대해 로그를v 기록하는 미들웨어.
const mw2: RequestHandler = async function (req, res, next) {
    console.log("LOGGED");
    next();
};

//
// 미들웨어를 적용한다.
// 먼저 등록된 미들웨어부터 차례대로 처리된다.
app.use(mw1);
app.use(mw2);

//
// Hello, World!
app.get("/", function (req, res) {
    res.send("Hello, World!");
});
