### Hello, World!

먼저 `Node.js` + `TypeScript` 환경에서 `express.js`를 사용할 수 있도록 필수 모듈을 설치합니다.

```bash
$ npm i express
$ npm i @types/express -D
```

<br/>

`express`의 `default module`를 사용하여 `app` 객체를 생성하고, 최상위 경로인 `/`에 `Hello, World!`를 반환하는 함수를 라우팅시킵니다.

```ts
import express from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// 최상위 경로에 `Hello, World!`를 반환하는 함수를 라우팅.
app.get("/", async function callback(req, res) {
    res.send("Hello, World!");
});
```

<br/>

이렇게 만들어진 `app`을 실행시키기 위해 `.listen()`을 사용합니다. 첫 번째 인자는 `포트번호`를 받으며, 두 번째 인자는 `웹 서버가 열리면 실행할 콜백함수`를 받습니다.

```ts
const port = 3000;
app.listen(port, () => {
    //
    // 실행중인 서버의 경로를 출력한다.
    console.log(`Server ready at http://localhost:${port}`);
});
```
