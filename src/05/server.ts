import express, { RequestHandler, ErrorRequestHandler } from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// 커스텀 요청 핸들러
const occurError: RequestHandler = async function (req, res, next) {
    next("항상 에러가 발생합니다.");
};

//
// 커스텀 요청 핸들러
const logger: RequestHandler = async function (req, res, next) {
    console.log("LOGGED");
    next();
};

//
// 커스텀 요청 핸들러
const cleaner: RequestHandler = async function (req, res, next) {
    console.log("DONE");
    next();
};

//
// 커스텀 에러 핸들러
const errHandler1: ErrorRequestHandler = async function (err, req, res, next) {
    console.log("err mw1");

    const val = Math.random();
    const criteria = 0.5;
    if (val < criteria) {
        //
        // 에러를 함께 전달하면 다음 "에러" 핸들러로 이동함.
        next(val);
    } else {
        //
        // 에러를 전달하지 않으면, 다음 "요청" 핸들러로 이동함.
        next();
    }
};

//
// 커스텀 에러 핸들러
const errHandler2: ErrorRequestHandler = async function (err, req, res, next) {
    console.log("err mw2");
    res.status(500).send("에러 발생!");
};

//
// 미들웨어를 적용한다.
// 먼저 등록된 미들웨어부터 차례대로 처리된다.
app.use(occurError);
app.use(logger);
app.use(errHandler1);
app.use(errHandler2);
app.use(cleaner);

//
// Hello, World!
app.get("/", function (req, res) {
    res.send("Hello, World!");
});
