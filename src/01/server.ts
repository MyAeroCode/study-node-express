import express from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// 최상위 경로에 `Hello, World!`를 반환하는 함수를 라우팅.
app.get("/", async function callback(req, res) {
    res.send("Hello, World!");
});
