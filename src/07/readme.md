### Static File

`express.static` 미들웨어를 사용하여 클라이언트에게 정적파일을 제공할 수 있습니다.

```ts
app.use("/static", express.static("./files/public"));
```

이제 다음과 같은 형태로 정적파일에 접근할 수 있습니다.

```text
http://localhost:3000/static/a.txt
http://localhost:3000/static/b.txt
```

<br/>

### 상대경로 사용하지 않기

`상대경로`는 작업 디렉터리에 의해 의미가 달라질 수 있으므로 `__dirname`을 사용하는 것이 좋습니다. `__dirname`은 해당 소스코드가 저장된 디렉터리 경로를 가르킵니다.

```ts
app.use("/static", express.static(`${__dirname}/files/public`));
```

<br/>

### 중복 사용시 탐색순서

하나의 경로에 여러개의 `express.static`을 적용할 수 있습니다. 이러한 경우에는 먼저 적용된 폴더를 탐색하고, 찾지 못한 경우에 다음 폴더를 찾습니다. 예를 들어, 다음과 같은 정적폴더가 있다고 가정해보겠습니다.

```text
📦07
 ┣ 📂files1
 ┃ ┗ 📜a.txt
 ┣ 📂files2
 ┃ ┣ 📜a.txt
 ┃ ┗ 📜b.txt
 ┣ 📜readme.md
 ┗ 📜server.ts
```

<br/>

다음 명령어는 `files1`을 먼저 찾고, 찾지 못한 경우에 `files2`를 탐색합니다.

```ts
app.use("/static", express.static(`${__dirname}/files1`));
app.use("/static", express.static(`${__dirname}/files2`));
```

<br/>

따라서,

`/static/a.txt`는 `files1/a.txt`를 가르키고,
`/static/b.txt`는 `files2/b.txt`를 가르킵니다.
