let id = 0;

export class Card {
    readonly id: number;
    constructor(public name: string, public all: number, public min: number, public max: number) {
        this.id = id++;
    }

    changename(v: string, _: number) {
        this.name = v;
    }

    changeall(v: number, handSize: number) {
        if (v == 0) {
            this.all = this.min = this.max = 0;
        } else {
            if (v < this.max) this.all = this.max = v;
            else if (v < this.min) this.all = this.min = v;
            else this.all = v;
        }
    }

    changemin(v: number, handSize: number) {
        if (v > handSize) v = handSize;
        if (v > this.max) this.max = v;
        else if (v > this.all) this.min = this.all;
        else if (v < 0) this.min = 0;
        this.min = v;
    }

    changemax(v: number, handSize: number) {
        if (v > handSize) v = handSize;
        if (v > this.all) this.max = this.all;
        else if (v < this.min) this.min = v;
        this.max = v;
    }
}
