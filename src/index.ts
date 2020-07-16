import prompt from "prompt-sync";

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
        const chapterNumber = Number(prompt()("Chapter Number : "));
        const chapter = `./${formatNumber(chapterNumber)}/server.ts`;
        const { startServer } = await import(chapter);
        startServer();
    } catch (e) {
        console.error(e);
    }
}
bootstrap();
