/**
 * 并发执行队列中的异步任务
 * 第二个参数是最大并发量 浏览器最多只能同时发送6个请求
 */
export async function parallelPromise<Func extends (...arg: any) => Promise<any>, T = Parameters<Func>>(
    tasks: {
        func: Func;
        args: T[];
    }[],
    max = 4
) {
    const pool: Promise<unknown>[] = [];
    const result: unknown[] = [];
    const errors: unknown[] = [];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i]
            .func(...tasks[i].args)
            .then((fulfilled) => (result[i] = fulfilled))
            .catch((e) => (errors[i] = e))
            .finally(() => pool.splice(pool.indexOf(task), 1));

        pool.push(task);
        if (pool.length == max) {
            await Promise.race(pool);
        }
    }
    await Promise.all(pool);
    return { fulfilled: result, rejected: errors };
}

/** @deprecated 并发池 开发完成后替换掉上面的方法 */
export class ParallelPool {
    private tasks: { func: (...arg: any[]) => Promise<any>; args: any[] }[] = [];

    constructor(readonly max: number) {}

    /** 向并发池中添加事件 */
    append(func: (...arg: any[]) => Promise<any>, arg: Parameters<typeof func>) {
        this.tasks.push({ func, args: [arg] });
    }

    /** 开始并发执行 */
    async run() {
        const pool: Promise<unknown>[] = [];
        const result: unknown[] = [];
        const errors: unknown[] = [];

        for (let i = 0; i < this.tasks.length; i++) {
            const task = this.tasks[i]
                .func(...this.tasks[i].args)
                .then((fulfilled) => (result[i] = fulfilled))
                .catch((e) => (errors[i] = e))
                .finally(() => pool.splice(pool.indexOf(task), 1));

            pool.push(task);
            if (pool.length == this.max) {
                await Promise.race(pool);
            }
        }
        await Promise.all(pool);
        return { fulfilled: result, rejected: errors };
    }
}
