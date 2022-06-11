export class Card {
    constructor(
        readonly id: number,
        public name: string,
        private _all: number,
        private _min: number,
        private _max: number
    ) {}

    get all() {
        return this._all;
    }
    set all(v: number) {
        if (v == 0) {
            this._all = this._min = this._max = 0;
        } else {
            if (v < this.max) this._all = this.max = v;
            else if (v < this.min) this._all = this.min = v;
            else this._all = v;
        }
    }

    get min() {
        return this._min;
    }
    set min(v: number) {
        if (v > this._max) this._min = this._max;
        else if (v > this._all) this._min = this._all;
        else if (v < 0) this._min = 0;
        else this._min = v;
    }

    get max() {
        return this._max;
    }
    set max(v: number) {
        if (v > this._all) this._max = this._all;
        else if (v < this._min) this._max = this._min;
        else this._max = v;
    }
}
