import express from "express";
import http from "http";
import socketIo from "socket.io";
import socketIoClient from "socket.io-client";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
const app = express();
const httpServer = http.createServer(app);
const socketServer = socketIo(httpServer);

//
// server bootstrap function
export function startServer() {
    //
    // NameSpace
    const namespace0 = socketServer.of("/"); // default
    const namespace1 = socketServer.of("/namespace1");
    const namespace2 = socketServer.of("/namespace2");

    //
    // 클라이언트가 namespace0에 접속하면 발생할 콜백.
    namespace0.on("connection", (socket) => {
        //
        // 서버 콘솔에 로깅
        console.log(`New user connected. [id = ${socket.id}]`);

        //
        // 클라이언트가 "chat" 이벤트를 발생시키면 실행할 콜백을 정의한다.
        socket.on("chat", (msg) => {
            //
            // 이벤트를 발생시킨 클라이언트에게 송신.
            socket.emit("result", true);

            //
            // 이벤트를 발생시킨 클라이언트를 제외하고,
            // namespace1에 속한 모든 클라이언트에게 송신.
            socket.broadcast.emit("chat", msg);
        });
    });

    //
    // 클라이언트가 namespace1에 접속하면 발생할 콜백.
    namespace1.on("connection", (socket) => {
        //
        // 서버 콘솔에 로깅
        console.log(`New user connected. [id = ${socket.id}]`);

        //
        // 클라이언트가 "chat" 이벤트를 발생시키면 실행할 콜백을 정의한다.
        socket.on("chat", (msg) => {
            //
            // 이벤트를 발생시킨 클라이언트에게 송신.
            socket.emit("result", true);

            //
            // 이벤트를 발생시킨 클라이언트를 제외하고,
            // namespace1에 속한 모든 클라이언트에게 송신.
            socket.broadcast.emit("chat", msg);
        });
    });

    //
    // 클라이언트가 namespace2에 접속하면 발생할 콜백.
    namespace2.on("connection", (socket) => {
        //
        // 특정 Room에 접속시키고 서버 콘솔에 로그를 출력한다.
        // RoomId는 [0, 3) 범위 중 하나의 값이다.
        const roomId = String(Math.floor(Math.random() * 10) % 3);
        socket.join(roomId);
        console.log(
            `New user connected. [id = ${socket.id}] [room = ${roomId}]`
        );

        //
        // 해당 룸에 속한 모든 클라이언트에게 메세지를 보낸다.
        socket
            .to(roomId)
            .broadcast.emit("chat", `[${socket.id}]님이 방에 들어오셨습니다.`);

        //
        // 클라이언트가 "exit" 이벤트를 발생시키면 실행할 콜백을 정의한다.
        socket.on("exit", (msg) => {
            //
            // 이벤트를 발생시킨 클라이언트를 제외하고,
            // 해당 룸에 속한 모든 클라이언트에게 송신.
            socket
                .to(roomId)
                .broadcast.emit(
                    "chat",
                    `[${socket.id}]님이 방에서 나가셨습니다.`
                );

            //
            // 해당 룸에서 나간다.
            socket.leave(roomId);
        });

        //
        // 클라이언트가 "chat" 이벤트를 발생시키면 실행할 콜백을 정의한다.
        socket.on("chat", (msg) => {
            //
            // 이벤트를 발생시킨 클라이언트에게 송신.
            socket.emit("result", true);

            //
            // 이벤트를 발생시킨 클라이언트를 제외하고,
            // namespace1에 속한 모든 클라이언트에게 송신.
            socket.broadcast.emit("chat", msg);
        });
    });

    //
    // HttpServer를 실행한다.
    httpServer.listen(3000, () => {
        console.log("http://localhost:3000");
        startClient();
    });
}

//
// client bootstrap function
export async function startClient() {
    //
    // 주어진 네임스페이스에 접속한다.
    function enterTo(path: string) {
        const socket = socketIoClient(path);

        //
        // 서버로부터 "chat" 이벤트를 수신하면 실행할 콜백을 정의한다.
        socket.on("chat", function (msg: any) {
            console.log(`[${socket.id}] read message from server : ${msg}`);
        });

        //
        // 서버와 접속하면, 서버에게 "chat" 이벤트를 송신한다.
        socket.on("connect", function () {
            socket.emit("chat", `Hello! My name is [${socket.id}]`);
        });

        //
        // 서버와의 연결이 해제되면 실행할 콜백을 정의한다.
        socket.on("disconnect", function () {
            //
            // 연결이 해제되면 id의 할당도 해제되므로 undefined이다.
            const socketId = socket.id;

            console.log(`disconnected`);
        });

        //
        // 1초 후에 연결을 종료한다.
        setTimeout(function () {
            socket.disconnect();
        }, 1000);
    }

    //
    // 네임스페이스 목록
    const namespaces = [
        "http://localhost:3000",
        "http://localhost:3000/namespace1",
        "http://localhost:3000/namespace2",
    ];

    //
    // 각각의 네임스페이스에 5명의 사용자를 접속시킨다.
    for (const namespace of namespaces) {
        console.group(namespace);
        for (let i = 0; i < 5; i++) {
            enterTo(namespace);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        console.groupEnd();
    }
}
