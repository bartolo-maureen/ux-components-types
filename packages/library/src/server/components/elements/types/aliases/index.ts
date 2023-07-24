export type RequestHandler = (
    payload: any,
    resolve: (result?: any) => void,
    reject: (e?: any) => void
) => void;
