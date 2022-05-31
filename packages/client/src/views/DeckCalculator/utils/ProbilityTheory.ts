export class ProbabilityTheory {
    constructor() {}

    /**
     * 求排列
     * @param n 总数
     * @param m 取出的数
     */
    static A(n: number, m: number) {
        if (m > n) throw "";
        return this.factorial(n) / this.factorial(n - m);
    }

    /**
     * 求组合
     * @param n 总数
     * @param m 取出的数
     */
    static C(n: number, m: number) {
        if (m > n) throw "";
        return this.factorial(n) / (this.factorial(m) * this.factorial(n - m));
    }

    /** 求阶乘 */
    static factorial(n: number) {
        this.notNegative(n);
        if (n == 0) return 1;
        if (n > 170) return Infinity;

        let r = 1;
        for (let i = 2; i <= n; i++) {
            r *= i;
        }
        return r;
    }

    /** 不为负数 */
    static notNegative(n: number) {
        if (n < 0) {
            throw "value cant be negative";
        }
    }
}
