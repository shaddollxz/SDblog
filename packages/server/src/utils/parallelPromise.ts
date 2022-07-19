/**
 * 并发执行队列中的异步任务
 * 第二个参数是最大并发量 浏览器最多只能同时发送6个请求
 */
export async function parallelPromise<T>(
    tasks: {
        func: (...arg: T[]) => Promise<unknown>;
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
