import express from "express";
import awsServerlessExpress from "aws-serverless-express";
import { APIGatewayEvent, Context } from "aws-lambda";
import cors from "cors";

export const app = express();

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
