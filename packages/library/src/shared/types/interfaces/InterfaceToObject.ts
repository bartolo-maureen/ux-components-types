export type InterfaceToObject<T> = {
    [K in keyof T]: K;
};
