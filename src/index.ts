import { Express } from "express";

async function bootstrap() {
    try {
        /**
         * 두 자리 정수로 변환한다.
         */
        function formatNumber(num: number): string {
            const prefix = num < 10 ? "0" : "";
            return prefix + num;
        }

        //
        // 주어진 챕터의 서버를 실행시킨다.
        const port = 3000;
        const chapter = `./${formatNumber(Number(process.argv[2]))}/server.ts`;
        const app = (await import(chapter)).app as Express;
        app.listen(port, () => {
            //
            // 실행중인 서버의 경로를 출력한다.
            console.log(`Server ready at http://localhost:${port}`);
        });
    } catch (e) {
        console.error(e);
    }
}
bootstrap();
