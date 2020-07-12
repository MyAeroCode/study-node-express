### Routing

`라우팅`이란 `클라이언트의 요청`을 `어떤 엔드포인트에 전달할지` 결정하는 방법을 말합니다. 각 라우트는 하나 이상의 `핸들러 함수`를 가질 수 있으며, `사용자의 요청`이 발생하면 `매칭된 라우트의 핸들러 함수들`이 순차적으로 실행됩니다. 따라서 각 라우트는 다음과 같은 형태로 정의됩니다.

```ts
app.METHOD(PATH, ...HANDLER);
```

<br/>

위의 의사코드는 3부분으로 나누어져 있습니다. 다음 절에서 각각에 대해 자세하게 설명합니다.

-   `METHOD`
-   `PATH`
-   `...HANDLER`

<br/>

### Method

해당 라우트가 처리할 `GET`, `POST`, `PUT`와 같은 `HTTP REQUEST METHOD`를 말합니다. 각 메소드의 이름을 소문자로 낮추어 사용합니다.

```ts
app.get(PATH, ...HANDLER);
app.post(PATH, ...HANDLER);
app.put(PATH, ...HANDLER);
...
```

<br/>

즉, 다음과 같이 `/` 경로에 `GET`, `POST` 요청을 처리할 수 있는 라우트를 생성할 수 있습니다.

```ts
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
```

<br/>

경로를 여러번 반복하는 적는 것이 싫다면 `Route Chain`을 사용할 수 있습니다.

```ts
app.route("/")
    .get(async function (req, res) {
        res.send("Hello, World! Via GET");
    })
    .post(async function (req, res) {
        res.send("Hello, World! Via POST");
    });
```

<br/>

### Path

해당 라우트가 처리할 경로를 말합니다. 3가지 방법으로 정의할 수 있습니다.

-   정적 경로
-   `패턴 문자열`을 사용한 동적 경로
-   `정규식 표현식`을 사용한 동적 경로

<br/>

**정적 경로 :**

`패턴 문자열`을 사용하지 않은 모든 문자열은 정적 경로로 처리됩니다. 각 경로 문자열은 `/`으로 시작해야 함에 주의해주세요.

```ts
app.get("/", async function callback(req, res) {
    res.send("루트 페이지");
});

app.get("/about", async function (req, res) {
    res.send("소개 페이지");
});
```

<br/>

**패턴 문자열 :**

다음과 같은 `패턴 문자열`을 사용하면 `간단한 동적 경로`를 처리할 수 있습니다.

-   `?` : 바로 앞의 글자가 0개 또는 1개인 경우에 매칭.
-   `+` : 바로 앞의 글자가 1개 이상인 경우에 매칭.
-   `*` : 0글자 이상의 문자열에 매칭.
-   `()` : 여러 글자를 하나로 취급.

```ts
app.get("/xyz?abc", ...HANDLER);
// xyabc
// xyzabc

app.get("/xyz+abc", ...HANDLER);
// xyzabc
// xyzzabc
// xyzzzabc
// ...

app.get("/xyz*abc", ...HANDLER);
// xyzabc
// xyz0abc
// xyz12abc
// xyz345abc
// ...

app.get("/xyz(abc)?", ...HANDLER);
// xyz
// xyzabc
```

어떤 요청이 여러개의 라우터에 매칭된다면, 가장 먼저 정의된 라우터에 전달됩니다. 예를 들어, `xyzabc`경로로 발생된 요청은, 먼저 정의된 `/xyz+abc`로 전달됩니다.

<br/>

**정규 표현식 :**

`정규 표현식`을 사용하여 `복잡한 패턴`도 표현할 수 있습니다. 예를 들어, `숫자로만 이루어진` 경로에 매칭되는 라우터를 다음과 같이 생성할 수 있습니다.

```ts
app.get(/^\/[0-9]+$/, ...HANDLER);
```

잠깐 부가적인 요소들을 해설하자면,

-   각 경로는 `/`으로 시작해야 하고, 하나 이상의 숫자로만 이루어져야 하기 때문에 `\/`와 `[0-9]+`를 사용하였습니다.
-   `^`와 `$`는 문자열의 처음과 끝에 매칭됩니다. 만약 이것을 사용하지 않았다면 `/zzz/12345`와 같은 문자열도 매칭됩니다. `/12345` 부분이 매칭되기 때문입니다.

<br/>

### Handler

라우터가 어떻게 요청을 처리할지 정의한 `1개 이상`의 콜백함수 집합을 뜻합니다. 각 콜백함수 기본형은 다음과 같습니다.

```ts
//
// 동기형 함수
app.get(PATH, function (req, res, next) {
    //
    // ...
});

//
// 비동기형 함수
app.get(PATH, async function (req, res, next) {
    //
    // ...
});
```

<br/>

콜백함수 인자들을 `...callback` 형태로 받아들이기 때문에, 다음과 같이 `1개 이상`의 콜백을 정의할 수 있습니다. 이것은 `express`의 기능보다는 `JavaScript`의 문법입니다.

```ts
//
// 인자에 차례차례 붙이는 것도 가능.
app.get(PATH, cb1, cb2);

//
// 배열로 전달하는 것도 가능.
app.get(PATH, [cb1, cb2]);

//
// 둘을 혼용하는 것도 가능.
app.get(PATH, cb1, [cb2, cb3], cb4, [cb5]);
```

<br/>

각각의 콜백함수는 다음과 같은 일을 할 수 있습니다.

-   `next()`를 통해 다음 콜백함수를 실행시킨다.
-   `응답 함수`를 통해 데이터를 반환한다.

<br/>

**next :**

`next()`의 설명을 통해 알 수 있듯이, 다음 콜백함수는 저절로 실행되는 것이 아니라 `next()`가 명시적으로 호출된 경우에만 실행됩니다. 즉, `next()`를 실행하지 않는다면 다음 콜백함수는 절대로 실행되지 않습니다.

```ts
app.get(
    PATH,
    async function cb1(req, res, next) {
        console.log("cb1");
    },
    async function cb2(req, res, next) {
        console.log("cb2"); // 도달할 수 없는 영역.
    }
);
```

<br/>

`next()`의 첫 번째 인자는 `에러 메세지`를 받습니다. 이 경우에도 다음 콜백이 실행되지 않습니다.

```ts
app.get(
    PATH,
    async function cb1(req, res, next) {
        console.log("cb1");
        next("에러 메세지");
    },
    async function cb2(req, res, next) {
        console.log("cb2"); // 도달할 수 없는 영역.
    }
);
```

<br/>

다만, 마지막 콜백함수는 `next()`를 굳이 실행하지 않아도 됩니다.

```ts
app.get(
    PATH,
    async function cb1(req, res, next) {
        console.log("cb1");
        next();
    },
    async function cb2(req, res, next) {
        console.log("cb2");

        //
        // 해도 되고, 안해도 됨.
        // next();
    }
);
```

<br/>

**res :**

`res.send()`와 같이 사용자에게 응답을 반환하는 함수를 `응답 함수`라고 합니다. `콜백함수 그룹`은 반드시 하나의 응답을 반환해야 하며, 여러번 `응답 함수`를 실행하려고 하면 에러가 발생합니다. 하나의 콜백에서 여러번 `응답 함수`를 실행하는 것도 허용되지 않습니다.

```ts
app.get(PATH, async function (req, res) {
    res.send("Hello");
    res.send("World"); // Error.
});

app.get(
    PATH,
    async function cb1(req, res, next) {
        res.send("Hello");
        next();
    },
    async function cb2(req, res, next) {
        res.send("World");
    }
);
```

<br/>

첫 번째 인자인 `req`는 클라이언트의 요청 정보를 담고있는 객체이며, 두 번째 인자인 `res`는 응답 정보를 설정할 수 있는 함수들의 집합입니다. 이번 챕터에서는 `res`에 대해서만 살펴봅니다.

<br/>

`res`는 다음 함수들을 포함하고 있습니다.

| Method             | Desc                                                   |
| ------------------ | ------------------------------------------------------ |
| `res.download()`   | `특정 파일을 다운로드`되도록 하는 응답을 반환합니다.   |
| `res.end()`        | 응답 프로세스를 끝냅니다.                              |
| `res.json()`       | `json` 데이터를 반환합니다.                            |
| `res.jsonp()`      | `jsonp` 지원을 통해 `json`데이터를 반환합니다.         |
| `res.redirect()`   | `특정 경로로 리다이렉트`되도록 하는 응답을 반환합니다. |
| `res.send()`       | 다양한 유형의 데이터를 반환합니다.                     |
| `res.sendFile()`   | 데이터를 `OctetStream` 형태로 반환합니다.              |
| `res.sendStatus()` | 인자로 주어진 `상태코드`에 대한 기본응답을 반환합니다. |

<br/>

### Module Level Router

`express.Router()`로 라우터 객체를 생성하고, `use()`로 라우터 객체를 적용시키는 것으로, 라우팅 경로를 `모듈 형태로 관리`할 수 있습니다.

```ts
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
```

위의 코드는 다음과 같은 경로들을 생성합니다.

-   `/out`
-   `/out/a`
-   `/out/b`
-   `/out/in`
-   `/out/in/x`
-   `/out/in/y`

<br/>

어느 것을 먼저 `use()`할 지는 중요하지 않습니다. 어느 것을 먼저하든 결과는 같습니다.

```ts
//
// 이렇게 해도 같고,
app.use("/out", outerRouter);
outerRouter.use("/in", innerRouter);

//
// 저렇게 해도 같다.
outerRouter.use("/in", innerRouter);
app.use("/out", outerRouter);
```

<br/>

### 404 Page

`*` 경로는 모든 경로와 일치하므로 맨 마지막에 `*` 경로를 추가하면, `위에서 매칭되지 않은 경로`를 끌고 올 수 있습니다. 이것은 `404 페이지`를 만들 때 매우 유용합니다.

```ts
//
// 먼저 아래의 라우터에 대해 매칭시켜보고...
app.get("/", ...HANDLER);
app.get("/about", ...HANDLER);
app.get("/contact", ...HANDLER);

//
// 위의 3개에서 걸러진 모든 요청이 매칭됨.
app.get("*", ...HANDLER);
```

<br/>

매칭되는 라우터가 여러개 있다면 먼저 정의된 것이 사용되므로, `*`를 위에 쓰지 않도록 주의해야 합니다.

```ts
//
// 모든 요청을 빼앗음.
app.get("*", ...HANDLER);

//
// 따라서, 아래의 라우터에 결코 도달할 수 없음.
app.get("/", ...HANDLER);
app.get("/about", ...HANDLER);
app.get("/contact", ...HANDLER);
```
