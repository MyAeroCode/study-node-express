import express from "express";
import cors from "cors";
import https from "https";

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
    // HTTPS로 실행
    https
        .createServer(
            {
                key: pems.private,
                cert: pems.cert,
            },
            app
        )
        .listen(3000, () => {
            console.log("https://localhost:3000");
        });
}

//
// CORS
app.use("/", cors());

//
// GET
app.get("/", async function (req, res) {
    res.send("Hello, HTTPS!");
});
