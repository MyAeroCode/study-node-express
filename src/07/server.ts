import express from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// example)
//      http://localhost:3000/static/a.txt
//      http://localhost:3000/static/b.txt
//
// note 1)
//      .으로 시작하는 상대경로는 작업경로에 따라 의미가 다르므로 __dirname을 사용하는 것이 좋다.
//      __dirname은 현재 소스코드가 저장된 폴더경로를 가르킨다.
//
// note 2)
//      여러개의 static 미들웨어가 적용되면 먼저 적용된 순서대로 파일을 찾는다.
//
app.use("/static", express.static(__dirname + "/files1"));
app.use("/static", express.static(__dirname + "/files2"));

//
// Hello, World!
app.get("/", async function (req, res) {
    res.send("Hello, World!");
});
