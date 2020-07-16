import express from "express";
import awsServerlessExpress from "aws-serverless-express";
import { APIGatewayEvent, Context } from "aws-lambda";
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
// CORS
app.use("/", cors());

//
// GET
app.get("/", async function (req, res) {
    res.send("Hello, World! Via GET");
});

//
// POST
app.post("/", async function (req, res) {
    res.send("Hello, World! Via POST");
});

//
// URL Param
app.post("/hello/:name", async function (req, res) {
    const { name } = req.params;
    res.send(`Hello, ${name}!`);
});

const server = awsServerlessExpress.createServer(app);

export function handler(event: APIGatewayEvent, context: Context) {
    awsServerlessExpress.proxy(server, event, context);
}
