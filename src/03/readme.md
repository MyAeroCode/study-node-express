### Middleware

라우트에 넘어가기 전에 처리되는 요청 핸들러를 `미들웨어`라고 합니다. `RequestHandler` 인터페이스를 구현하여 커스텀 미들웨어를 구현할 수 있습니다. 기본적인 스펙은 `챕터2`에서 소개했던 `라우트 핸들러`와 같습니다.

```ts
import express, { RequestHandler } from "express";

//
// express의 기본 모듈을 사용하여 app 객체를 생성.
export const app = express();

//
// 랜덤값이 0.5보다 작다면 에러를 발생시키는 미들웨어.
const mw1: RequestHandler = async function (req, res, next) {
    const val = Math.random();
    const criteria = 0.5;
    if (val < criteria) {
        //
        // next() with error
        next(`랜덤값이 기준보다 작습니다. (${val} < ${criteria})`);
    } else {
        //
        // next()
        next();
    }
};

//
// 미들웨어를 적용한다.
// 먼저 등록된 미들웨어부터 차례대로 처리된다.
app.use(mw1);
```

<br/>

`챕터2`에서 소개했던 `RouteHandler`와 마찬가지로 `...RequestHandler` 형태로 인자를 받기 때문에, 여러개의 미들웨어를 한꺼번에 적용할 수 있습니다.

```ts
//
// 여러개의 미들웨어를 나열하여 전달.
app.use(mw1, mw2);

//
// 여러개의 미들웨어를 배열로 묶어서 전달.
app.use([mw1, mw2]);

//
// 위의 두 방식을 혼용.
app.use(mw1, [mw2, mw3], mw4);
```
