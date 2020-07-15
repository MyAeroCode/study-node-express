### Deploy to AWS Lambda

`serverless` 프레임워크와 `aws-serverless-express`를 사용하면 `Express`서버를 서버리스하게 배포할 수 있습니다.

<br/>

#### 필수 패키지 설치

먼저 필요한 패키지부터 설치하겠습니다.

```bash
npm i aws-serverless-express aws-lambda
npm i @types/aws-serverless-express @types/aws-lambda -D
```

<br/>

타입스크립트에서 작성한 코드를 배포하기 위해 `serverless-plugin-typescript`와 오프라인 테스팅을 위한 `serverless-offline` 플러그인도 같이 설치합니다.

```bash
npm install serverless-plugin-typescript serverless-offline -D
```

<br/>

#### 핸들링 객체 생성하기

먼저 평범하게 리졸버를 작성한 뒤.

```ts
import express from "express";

export const app = express();

app.get("/", async function (req, res) {
    res.send("Hello, World!");
});
```

<br/>

`aws-serverless-express`를 통해 `app`을 연결하고, 핸들러를 만든 뒤에 외부에 노출시킵니다.

```ts
import awsServerlessExpress from "aws-serverless-express";
import { APIGatewayEvent, Context } from "aws-lambda";

const server = awsServerlessExpress.createServer(app);

export function handler(event: APIGatewayEvent, context: Context) {
    awsServerlessExpress.proxy(server, event, context);
}
```

<br/>

#### 서버리스 설정파일 작성하기

`serverless.yml`을 작성하고 프로젝트 루트에 위치시킵니다. 플러그인 부분에서 `serverless-plugin-typescript`가 `serverless-offline`보다 위에 있어야 함에 주의해주세요.

```yml
#
# 람다함수 이름
service: study-node-express

#
# AWS 람다 스펙
provider:
    runtime: nodejs12.x
    name: aws
    stage: dev
    region: ap-northeast-2
    memorySize: 128
    timeout: 5

#
# 핸들러 경로와, 해당 핸들러를 노출시킬 경로.
functions:
    main:
        handler: src/08/server.handler
        events:
            - http:
                  path: /
                  method: get

#
# 플러그인 부분
plugins:
    - serverless-plugin-typescript
    - serverless-offline
```

<br/>

#### URL Param

`URL Param`이 설정되었다면 `serverless.yml`에서는 다음과 같이 설정해주세요.

**route :**

```ts
app.use("/hello/:name", async function (req, res) {
    //
    // ...
});
```

**serverless.yml :**

```yml
- http:
      path: /hello/{name}
      method: post
```

<br/>

#### CORS

`serverless.yml`에서 `CORS`옵션을 건들지 않아도, 코드에서 `CORS`미들웨어를 적용하면 됩니다.

```ts
app.use(cors());
```

<br/>

#### 오프라인 환경에서 실행

다음 명령어로 로컬환경에서 람다를 테스트할 수 있습니다.

```bash
npx sls offline
```

<br/>

#### 람다함수 배포

다음 명령어로 람다에 배포할 수 있습니다.

```bash
npx sls deploy
```

<br/>

#### 람다함수 삭제

배포된 람다함수를 제거하려면 다음 명령어를 입력해주세요.

```bash
npx sls remove
```
