interface Groups {
    size: string;
    id: string;
    child?: MenuTree;
}
export function isGroups(value: any): value is Groups {
    return true;
}
export class MenuTree extends Array<Groups> {
    constructor() {
        super();
    }
    get last() {
        return this[this.length - 1] || null;
    }
    insert(newNode: Groups) {
        //todo 如果大于上一级 则在下一级判断是否加入
        if (this.last && this.last.size < newNode.size) {
            this.last.child ??= new MenuTree();
            this.last.child.insert(newNode);
        } else {
            this.push(newNode);
        }
    }
}
