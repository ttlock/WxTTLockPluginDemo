/** @namespace 数据类型判断 */
export namespace Assert {
    /** @function 判断是否为空值 */
    export function isUndefined(e?: any): e is undefined {
        return typeof e === "undefined";
    };

    /** @function 判断是否为布尔值 */
    export function isBoolean(e?: any): e is boolean {
        return typeof e === "boolean";
    };

    /** @function 判断是否为数字 */
    export function isNumber(e?: any, positive?: boolean): e is number {
        return typeof e === "number" && !isNaN(e) && (positive ? (e > 0) : true);
    };

    /** @function 判断是否为字符串 */
    export function isString(e?: any): e is string {
        return typeof e === "string";
    };

    /** @function 判断参数是否为方法参数 */
    export function isFunction<T = Function>(e?: any): e is T {
        return typeof e === "function";
    };

    /** @function 判断参数是否为对象参数 */
    export function isObject<T>(e?: any): e is T {
        return typeof e === "object" && !!e;
    };

    /** @function 判断参数是否为数组 */
    export function isArray<T = any>(e?: Array<T>): e is Array<T> {
        return (e instanceof Array && e.length >= 0);
    };
}
