import express from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

// ---------------------------------------------------
//  라우팅 메소드
// ---------------------------------------------------

//
// GET method route
app.get("/", async function callback(req, res) {
    res.send("Hello, World! Via GET");
});

//
// Post method route
app.post("/", async function callback(req, res) {
    res.send("Hello, World! Via POST");
});

//
// Method chain
app.route("/")
    .put(async function (req, res) {
        res.send("Hello, World! Via PUT");
    })
    .delete(async function (req, res) {
        res.send("Hello, World! Via DELETE");
    });

// ---------------------------------------------------
//  라우팅 경로 결정
// ---------------------------------------------------

//
// Static Path
app.get("/about", async function (req, res) {
    res.send("about");
});

//
// Pattern Path
// ? : 바로 앞의 글자가 없거나 1글자인 경우에 매칭.
//      /xyabc
//      /xyzabc
app.get("/xyz?abc", async function (req, res) {
    res.send("xyz?abc");
});

//
// Pattern Path
// + : 바로 앞의 글자가 1글자 이상인 경우에 매칭.
//      /xyzabc
//      /xyzzabc
//      /xyzzzabc
app.get("/xyz+abc", async function (req, res) {
    res.send("xyz+abc");
});

//
// Pattern Path
// * : 0글자 이상의 문자열에 매칭.
//      /xyzabc
//      /xyz-abc
//      /xyz--abc
app.get("/xyz*abc", async function (req, res) {
    res.send("xyz*abc");
});

//
// Pattern Path
// () : 여러 글자를 하나로 취급.
//      /xyz
//      /xyzabc
app.get("/xyz(abc)?", async function (req, res) {
    res.send("xyz(abc)?");
});

//
// RegExp Path
//      /1
//      /12
//      /123
app.get(/^\/[0-9]+$/, async function (req, res) {
    res.send("/^/[0-9]+$/");
});

// ---------------------------------------------------
//  모듈식 라우팅
// ---------------------------------------------------

const outerRouter = express.Router();
const innerRouter = express.Router();

//
// 외부 라우터 설정
outerRouter
    .get("/", async function (req, res) {
        res.send("outer");
    })
    .get("/a", async function (req, res) {
        res.send("a");
    })
    .get("/b", async function (req, res) {
        res.send("b");
    });

//
// 내부 라우터 설정
innerRouter
    .get("/", async function (req, res) {
        res.send("inner");
    })
    .get("/x", async function (req, res) {
        res.send("x");
    })
    .get("/y", async function (req, res) {
        res.send("y");
    });

//
// app은 라우터를 use할 수 있음.
app.use("/out", outerRouter);

//
// 라우터는 또 다른 라우터를 use할 수 있음.
outerRouter.use("/in", innerRouter);

/**
 * URL Param
 */

app.get("/hello/:who", async function (req, res, next) {
    const { who } = req.params;
    res.send(`Hello, ${who}!`);
});

/**
 * Route Handler
 */

//
// 단일 콜백
app.get("/example/a", async function (req, res) {
    console.log("example a - 1");
    res.send("example a - 1");
});

//
// 다중 콜백
app.get(
    "/example/b",
    async function cb1(req, res, next) {
        console.log("example b - 1");

        //
        // next()를 통해 다음 콜백으로 넘긴다.
        // 첫 번째 인자에 에러발생 이유를 넘길 수 있음.
        const value = Math.random();
        const criteria = 0.5;
        if (value < criteria) {
            next(`랜덤값이 기준보다 작습니다. (${value} < ${criteria})`);
        } else {
            next();
        }
    },
    async function cb2(req, res, next) {
        console.log("example b - 2");
        res.send("example b - 2");

        //
        // send()를 호출한 이후에도 next()를 사용할 수 있음.
        next();
    },
    async function cb3(req, res, next) {
        console.log("example b - 3");

        //
        // 콜백그룹이 send()를 두번 호출하면 안됨.
        try {
            res.send("example b - 3");
        } catch (e) {
            console.log("send()를 두번 호출하면 안됩니다.");
        }
    },
    async function cb4(req, res, next) {
        //
        // 세 번째 콜백에 next()를 호출하지 않았으므로,
        // 마지막 콜백에는 절대 도달할 수 없음.
        throw new Error(`도달할 수 없는 영역.`);
    }
);

// ---------------------------------------------------
//  404 페이지
// ---------------------------------------------------
app.get("*", async function (req, res) {
    res.send("404 error page");
});
