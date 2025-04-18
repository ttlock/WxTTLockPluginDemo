export function isUndefined(e?: any): e is undefined {
    return typeof e === "undefined";
}

export function isBoolean(e?: any): e is boolean {
    return typeof e === "boolean";
}

export function isNumber(e?: any, positive?: boolean): e is number {
    return typeof e === "number" && !isNaN(e) && (positive ? (e > 0) : true);
}

export function isString(e?: any): e is string {
    return typeof e === "string";
}

export function isFunction<T = Function>(e?: any): e is T {
    return typeof e === "function";
}

export function isObject<T>(e?: any): e is T {
    return typeof e === "object" && !!e;
}

export function isArray<T = any>(e?: Array<T>): e is Array<T> {
    return (e instanceof Array && e?.length >= 0);
}
