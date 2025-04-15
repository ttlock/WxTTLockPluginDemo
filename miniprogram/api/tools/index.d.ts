declare interface HttpResponseResult<T = any> {
    errcode?: number; // 服务器错误码
    errmsg?: string; // 服务器错误信息
    description?: string; // 服务器错误描述
    data?: T; // 数据信息
}

declare interface TTLockError<T = any> {
	errorCode: number;
	errorMsg: string;
	description?: string;
	electricQuantity?: number;
	wxInterface?: string;
	data?: T;
}