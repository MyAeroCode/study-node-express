### `Headers`, `Query`, `Body`

`Middleware Handler` 또는 `Route Handler`의 첫 번째 인자인 `req`를 읽으면, 헤더 및 페이로드에 관한 다양한 요청 정보를 얻을 수 있습니다.

```ts
app.use(async function MiddlewareHandler(req, res, next) {
    //...
});

app.get("/", async function RouteHandler(req, res, next) {
    // ...
});
```

<br/>

#### 헤더 데이터 읽기

`req.headers`에 `Map`형태로 저장됩니다.

```ts
async function handler(req, res, next){
    console.log("req.headers" : req.handers);
}
```

예를 들어서, 아래와 같은 요청 메세지가 왔다고 하면.

```http
POST / HTTP/1.1
Host: localhost:3000
Client-Key: my client key
Secret-Client-Key: my secret client key
```

`req.headers`에는 다음과 같은 형태로 저장됩니다.

```json
{
    "host": "localhost:3000",
    "client-key": "my client key",
    "secret-client-key": "my secret client key"
}
```

<br/>

#### 쿼리 데이터 읽기

`req.query`에 `Map`형태로 저장됩니다.

```ts
async function handler(req, res, next){
    console.log("req.query" : req.query);
}
```

예를 들어서, 아래와 같은 경로로 요청이 들어왔다고 가정합니다.

```text
http://localhost:3000/?a=x&b=y
```

위의 요청을 `HTTP Message`로 표현하면 다음과 같고.

```http
POST /?a=x&b=y HTTP/1.1
Host: localhost:3000
```

`req.query`에는 다음과 같은 형태로 저장됩니다.

```json
{
    "a": "x",
    "b": "y"
}
```

<br/>

#### 바디 데이터 읽기

`POST`와 같은 요청은 `PayLoad`가 함께 전달될 수 있으며 `req.body`에 `any` 형태로 저장됩니다. `PayLoad`를 해석하는 방법은 `Content-Type`에 따라 달라지기 때문에, 다양한 컨텐츠 타입의 해석을 도와주는 미들웨어인 `body-parser`와 `multer`가 필요합니다.

```ts
async function handler(req, res, next){
    console.log("req.body" : req.body);
}
```

<br/>

먼저 페이로드를 해석해주는 미들웨어를 설치하겠습니다.

```bash
npm install body-parser
npm install multer
```

각각의 미들웨어가 해석해주는 주요 컨텐츠 타입은 다음과 같습니다.

**body-parser :**

-   `application/x-www-form-urlencoded`
-   `application/json`
-   `plain/text`

**multer :**

-   `multipart/form-data`

<br/>

위의 미들웨어를 익스프레스에 `use()`하면, 해석기 미들웨어가 `req.body`와 `req.files`에 데이터를 할당해줍니다.

```ts
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

/**
 * 페이로드를 req.body와 req.files에 할당하는 미들웨어 적용.
 */

//
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

//
// application/json
app.use(bodyParser.json());

//
// plain/text
app.use(bodyParser.text());

//
// multipart/form-data
app.use(multer().any());
```

<br/>

먼저 `x-www-form-urlencoded`부터 살펴보겠습니다. 이 타입은 각각의 `Key-Value`를 `&`로 구분하고 `퍼센트 문자열`로 인코딩하여 저장합니다. `req.body`에 `Map`형태로 저장됩니다.

```http
POST / HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded

a=x&b=y
```

```json
{
    "a": "x",
    "b": "y"
}
```

<br/>

`application/json`은 `text/plain`의 특화형이며, 문자열을 `json`으로 파싱합니다. `req.body`에 `Map`형태로 저장됩니다.

```http
POST / HTTP/1.1
Host: localhost:3000
Content-Type: text/plain

{"a":"x", "b":"y"}
```

```json
{
    "a": "x",
    "b": "y"
}
```

<br/>

`plain/text`은 받은 문자열 그대로 `req.body`에 저장합니다. `application/json`이 먼저 정의되어 있다면, `JSON`으로 만드는데 실패한 데이터가 `text`로 처리됩니다.

```http
POST / HTTP/1.1
Host: localhost:3000
Content-Type: text/plain

Hello, World!
```

```text
Hello, World!
```

<br/>

`multipart/form-data`는 헤더에서 정의된 `boundary` 문자열로 구분되는 `Key-Value` 데이터이고, 각각의 `Value`는 `File`또는 `String`을 가르킵니다. 각각의 `Key`는 중복되어도 문제가 없다는 점에 유의해주세요.

```http
POST / HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"

a
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="y"

b
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="z"; filename="/C:/Users/AeroCode/Downloads/sample.txt"
Content-Type: text/plain

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

문자열을 가르키는 `x`, `y`는 `Map`의 형태로 `req.body`에 저장됩니다.

```json
{
    "x": "a",
    "y": "b"
}
```

파일을 가르키는 `z`는 어떤 `multer`의 미들웨어를 등록했는지에 따라 `Array`또는 `Map<string, Array>`형태로 `req.files`에 저장됩니다.

---

`multer.single(FIELD_NAME)`는 하나의 필드 이름만 허용합니다.

```ts
app.use(multer().single("x"));
```

저장될 타입은 다음과 같습니다.

-   `req.body` : `Map<string, string | string[]>`
-   `req.files` : 허용되지 않음

<br/>

`req.body`는 중복된 키의 여부에 따라 자료형이 바뀝니다. 중복된 키가 없다면 `Map<string, string>`으로 저장되고, 중복된 키가 있다면 `Map<string, string[]>`으로 저장됩니다.

**중복된 키 없음 :**

```http
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"

a
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```json
body {
    "x": "a"
}
```

<br/>

**중복된 키 있음 :**

```http
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"

a
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"

b
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```json
body {
    "x": ["a", "b"]
}
```

<br/>

---

`multer.fields(FIELD[])`는 리스트에 주어진 필드만 허용됩니다. 그러나, 리스트에 주어진 모든 필드를 전달할 필요는 없습니다.

```ts
app.use(multer().fields([{ name: "x" }, { name: "y" }]));
```

저장될 타입은 다음과 같습니다.

-   `req.body` : `Map<string, string | string[]>`
-   `req.files` : `Map<string, File[]>`

<br/>

파일은 중복된 키가 있든 없든 `Map<string, File[]>` 형태로 저장됩니다.

```json
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"; filename="/C:/Users/AeroCode/Downloads/sample.txt"
Content-Type: text/plain

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```json
files {
    "x": [
        {
            "fieldname": "x",
            "originalname": "sample.txt",
            "encoding": "7bit",
            "mimetype": "text/plain",
            "buffer": ...
        }
    ]
}
```

---

`multer.array(FIELD_NAME)`은 `single()`처럼 단 하나의 필드이름만 허용합니다. 다만 파일을 `Array` 형태로 저장합니다.

```ts
app.use(multer().array("x"));
```

저장될 타입은 다음과 같습니다.

-   `req.body` : `Map<string, string | string[]>`
-   `req.files` : `File[]`

<br/>

```http
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"; filename="/C:/Users/AeroCode/Downloads/sample.txt"
Content-Type: text/plain

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```json
files [
    {
        "fieldname": "x",
        "originalname": "sample.txt",
        "encoding": "7bit",
        "mimetype": "text/plain",
        "buffer": ...
    }
]
```

---

`multer.any()`는 모든 필드를 해석합니다. 다만 파일을 `Array` 형태로 저장합니다.

```ts
app.use(multer().any());
```

저장될 타입은 다음과 같습니다.

-   `req.body` : `Map<string, string | string[]>`
-   `req.files` : `File[]`

<br/>

```http
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="x"; filename="/C:/Users/AeroCode/Downloads/sample.txt"
Content-Type: text/plain

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="y"; filename="/C:/Users/AeroCode/Downloads/sample.txt"
Content-Type: text/plain

(data)
----WebKitFormBoundary7MA4YWxkTrZu0gW
```

```json
files [
    {
        "fieldname": "x",
        "originalname": "sample.txt",
        "encoding": "7bit",
        "mimetype": "text/plain",
        "buffer": ...
    },
    {
        "fieldname": "y",
        "originalname": "sample.txt",
        "encoding": "7bit",
        "mimetype": "text/plain",
        "buffer": ...
    }
]
```
