declare module "selfsigned" {
    type Attrs = {
        name: string;
        value: string;
    }[];

    type Options = {
        days: number;
    };

    type Pems = {
        private: string;
        public: string;
        cert: string;
    };

    type Callback = (err: any, pems: Pems) => void;

    export function generate(): Pems;
}
