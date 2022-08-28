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

interface TaskItem {
    func: (...arg: any[]) => Promise<any>;
    args: any[];
}
interface Task {
    [key: string]: (TaskItem | undefined)[];
}
interface TaskState {
    end: boolean; // 当前任务是否全部完成
    taskEnd: boolean; // 任务是否不再接收新任务 设置为true时才会触发onFinish
    resolveCount: number;
}
type Result = { fulfilled: any[]; rejected: any[] };
interface CallBack {
    (result: Result): void;
}
interface Options {
    parallelTaskCount?: number; // 多个任务时并行的任务数
    max: number; // 最大并行数
}
/**
 * 并发池
 * 通过max选项设置最大并行数 浏览器最多同时发送6个http请求 并发数一般不要超过5个
 * 通过parallelTaskCount选项设置并发任务的并行数量
 */
export class ParallelPool {
    private keys: string[] = [];
    private tasks: Task = {};
    private state: Record<string, TaskState> = {};
    private callbacks: Record<string, CallBack[]> = {};
    private fulfilleds: Record<string, any[]> = {};
    private rejecteds: Record<string, any[]> = {};
    private pool: Promise<unknown>[] = [];
    private _pause = true;
    private declare iterator: AsyncGenerator;
    readonly options: Required<Options>;

    constructor(options: Options) {
        this.options = Object.assign<Partial<Options>, Options>(
            { parallelTaskCount: 1 },
            options
        ) as Required<Options>;
        this.setIterator();
    }

    /** 暂停线程池的运行 但是已经开始的异步不会暂停 */
    pause() {
        this._pause = true;
    }
    /** 暂停后继续 */
    play() {
        if (this._pause) {
            this._pause = false;
            this.run();
        }
    }
    /** 任务结束 必须调用该函数后才能触发结束的回调 */
    end(key: string) {
        this.state[key].taskEnd = true;
        if (this.tasks[key].length == 0) {
            this.useFinish(key, { fulfilled: [], rejected: [] });
        }
    }
    /** 设置指定任务完成时的回调 */
    onFinish(key: string, cb: CallBack) {
        if (this.callbacks[key]) {
            this.callbacks[key].push(cb);
        } else {
            this.callbacks[key] = [cb];
        }
    }
    private useFinish(key: string, result: Result) {
        if (this.callbacks[key]) {
            for (const cb of this.callbacks[key]) {
                cb(result);
            }
            this.removeTask(key);
        }
    }

    /** 向并发池中添加事件 */
    push(key: string, tasks: TaskItem[]): void;
    push(key: string, func: TaskItem["func"], arg: TaskItem["args"]): void;
    push(key: string, tasksOrFunc: TaskItem[] | TaskItem["func"], arg?: TaskItem["args"]) {
        if (this.state[key]?.taskEnd) return;

        let tasks: TaskItem[];
        if (!Array.isArray(tasksOrFunc)) {
            tasks = [{ func: tasksOrFunc, args: arg! }];
        } else {
            tasks = tasksOrFunc;
        }

        this.pause();
        this.pushTask(key, tasks);
        this.play();
    }

    /**
     * 开始并发执行任务 如果后续有任务插入
     * 不要对它使用`await` 通过使用onFinish设置回调获取迭代结果
     */
    private async run(): Promise<void> {
        if (!this._pause) {
            const { done } = await this.iterator.next();
            if (!done && !this._pause) {
                await this.run();
            }
        }
    }

    /** 根据构造函数的option设置迭代器 */
    private setIterator() {
        this.iterator =
            this.options.parallelTaskCount == 1 ? this.orderlyGenerator() : this.crossedGenerator();
    }
    /** 按照设置交错执行并行任务的迭代器 */
    private async *crossedGenerator(): AsyncGenerator<undefined> {
        let recorder: Record<string, number> = {};
        while (this.keys.length) {
            if (
                this.keys.length <= this.options.parallelTaskCount &&
                recorder[this.keys.at(-1)!] &&
                recorder[this.keys.at(-1)!] >= this.tasks[this.keys.at(-1)!].length
            ) {
                //* 在最后一批任务推入并发池时跳出循环
                break;
            }

            for (let i = 0; i < this.options.parallelTaskCount; i++) {
                const key = this.keys[i];
                if (key && !this.state[key].end) {
                    recorder[key] === undefined ? (recorder[key] = 0) : recorder[key]++;

                    const task = this.tasks[key][recorder[key]];
                    if (task) {
                        const promise = this.createTask(key, task, recorder[key]);
                        this.tasks[key][recorder[key]] = undefined;
                        if (recorder[key] == this.tasks[key].length - 1) {
                            //* 如果一个任务将要完成时另一个任务也全部进入并行池
                            //* 这时会卡死 所以这里直接等待最后一个任务结束
                            await promise;
                            yield;
                        } else {
                            this.pool.push(promise);
                            if (this.pool.length >= this.options.max) {
                                await Promise.race(this.pool);
                                yield;
                            }
                        }
                    }
                }
            }
        }
        await Promise.all(this.pool);
        // @ts-ignore
        recorder = null;
        yield;
    }
    /** 有序执行并行任务的迭代器 */
    private async *orderlyGenerator(): AsyncGenerator<undefined> {
        for (const key of this.keys) {
            if (this.state[key].end) continue;

            const tasks = this.tasks[key];
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i]) {
                    this.pool.push(this.createTask(key, tasks[i]!, i));
                    tasks[i] = undefined;
                    if (this.pool.length >= this.options.max) {
                        await Promise.race(this.pool);
                        yield;
                    }
                }
            }
        }
        await Promise.all(this.pool);
        yield;
    }

    private createTask(key: string, task: TaskItem, i: number) {
        const result = task
            .func(...task.args)
            .then((fulfilled) => (this.fulfilleds[key][i] = fulfilled))
            .catch((e) => (this.rejecteds[key][i] = e))
            .finally(() => {
                this.pool.splice(this.pool.indexOf(result), 1);
                this.state[key].resolveCount++;
                if (this.state[key].resolveCount == this.tasks[key].length) {
                    //* 最后一个任务
                    this.state[key].end = true;
                    if (this.state[key].taskEnd) {
                        this.useFinish(key, {
                            fulfilled: this.fulfilleds[key],
                            rejected: this.rejecteds[key],
                        });
                    }
                }
            });

        return result;
    }
    private pushTask(key: string, task: TaskItem[]) {
        const state = this.state[key];
        if (state) {
            //* 在旧任务中添加
            if (state.end) {
                //* 旧任务已经全部执行完
                // 将以前的任务设为undefind再接上新的 重新迭代时就能跳过旧任务
                this.tasks[key] = new Array(this.tasks[key].length).concat(...task);
                this.state[key].end = false;
                this.setIterator();
            } else {
                //* 旧任务还没有全部执行完
                this.tasks[key].push(...task);
            }
        } else {
            //* 新增任务
            this.tasks[key] = [...task]; // 浅复制一次 避免影响外部
            this.keys.push(key);
            this.state[key] = { end: false, taskEnd: false, resolveCount: 0 };
            this.rejecteds[key] = [];
            this.fulfilleds[key] = [];
            this.callbacks[key] ||= [];
            if (this.options.parallelTaskCount == 1 && this.pool.length < this.options.max) {
                this.setIterator();
            }
        }
    }
    private removeTask(key: string) {
        delete this.tasks[key];
        // prettier-ignore
        this.keys.splice(this.keys.findIndex((item ) => item == key), 1)
        delete this.state[key];
        delete this.rejecteds[key];
        delete this.fulfilleds[key];
        delete this.callbacks[key];
    }
}
