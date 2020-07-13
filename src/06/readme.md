### `CORS`

다른 도메인에서의 요청을 허용해야 한다면, 다음 방법을 통해 `CORS`을 설정해야 합니다.

-   라우트 핸들러에서 `응답 헤더` 설정
-   미들웨어에서 `응답 헤더` 설정
-   `CORS` 미들웨어 적용

<br/>

#### 라우트 핸들러에서 응답헤더 설정

표준 스펙에 의하면 `Access-Control-Allow-Origin` 헤더의 값으로 `CORS` 허용 도메인을 설정할 수 있습니다.

```ts
app.post("/", async function (req, res) {
    //
    // 라우트 핸들러에서 헤더 설정
    res.header("Access-Control-Allow-Origin", "*");

    res.send("Hello, World!");
});
```

<br/>

#### 미들웨어에서 응답헤더 설정

각각의 라우트 핸들러에서 헤더를 설정하기 귀찮다면, 미들웨어로 끌어올려서 사용할 수 있습니다.

```ts
//
// 커스텀 미들웨어에서 헤더 설정
app.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
```

<br/>

#### `CORS` 미들웨어 사용

도메인 규칙이 간단하면 위의 방법도 나쁘지 않지만, 도메인 규칙이 복잡해지면 구현하기 까다로워집니다. 바퀴부터 만들지 말고 `CORS` 미들웨어를 사용하는 방법을 추천합니다.

```bash
npm install cors
npm install @types/cors -D
```

```ts
import cors from "cors";

//
// 미들웨어 수준에서 적용
app.use(cors());

//
// 라우트 수준에서 적용
app.get("/", cors(), async function(req, res){
    ...
})
```

<br/>

**Origin :**

```ts
//
// 모든 도메인에서 허용
cors();

//
// 단일 도메인
cors({
    origin: "http://example.com",
});

//
// 다중 도메인
cors({
    origin: [
        "http://example1.com",
        "http://example2.com",
        "http://example3.com",
    ],
});

//
// 불리언
cors({
    origin: true, // 항상 허용
    origin: false, // 항상 금지
});

//
// 정규식에 일치하면 허용
cors({
    origin: [/example\.com$/],
    methods: ["GET", "POST"],
});

//
// 함수 (true를 반환하면 허용, false이면 금지)
cors({
    //
    // domain : string | undefined
    // callback : function(err, allow) => void
    origin: function (domain, callback) {
        //
        // 콜백의 첫 번째 인자는 에러
        // 콜백의 두 번째 인자는 허용여부
    },
});
```

<br/>

**기타 옵션 :**

-   `allowedHeaders` : `Access-Control-Allow-Headers` 헤더를 설정합니다.

-   `credentials` : `Access-Control-Allow-Credentials` 헤더를 설정합니다.

-   `exposedHeaders` : `Access-Control-Expose-Headers` 헤더를 설정합니다.
