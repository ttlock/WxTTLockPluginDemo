declare module ILockRecord {
    namespace Params {
        /** 上传操作记录参数 */
        interface Upload {
            lockId: number; // 智能锁ID
            records: string; // 智能锁操作记录
        }
    }
}