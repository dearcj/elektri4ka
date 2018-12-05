import {O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {_} from "main";
import {TweenMax} from "../Neu/Application";

export class AngryBar extends O {
    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.update()
    }

    private _value: number = 0;
    private smiles:  PIXI.heaven.Sprite[] = [];
    constructor (pos: Vec2 = null, gfx: PIXI.DisplayObject = null) {
        super(pos, null);
        this.gfx = _.cc(_.sm.gui);
        this.value = 0;

        this.smiles.push(_.cs("smile_4_1", this.gfx));
        this.smiles.push(_.cs("smile_3_1", this.gfx));
        this.smiles.push(_.cs("smile_2_1", this.gfx));
        this.smiles.push(_.cs("smile_1_1", this.gfx));

        let inx = 0;
        for (let x of this.smiles) {
            x.scale.set(0.6);
            x.x =  inx * 80;
            inx ++;
        }
        TweenMax.to(this, 10, {value: 1, yoyo: true, repeat: -1})
    }

    init(p: any) {
        if (this.layer) {
            O.rp(this.gfx);
            this.layer.addChild(this.gfx);
        }

        if (p.value) {
            this.value = parseFloat(p.value);
        }
    }

    private update() {
        let delta = 1 / (this.smiles.length + 1);
        for (let i = 0; i < this.smiles.length; i++) {
            let x = this.smiles[i];
            if (this.value > (i + 1) * delta && this.value <= (i + 2) * delta) {
                x.alpha = 1;
            } else {
                if ((this.value > (i) * delta && this.value <= (i + 1) * delta) ||
                    (this.value > (i + 2) * delta && this.value <= (i + 3) * delta) ) {
                    x.alpha = 0.5;
                } else {
                    x.alpha = 0.3;
                }
            }
        }

        if (this.smiles.length > 0 && this.value < delta) {
            this.smiles[0].alpha = 1;
        }

    }
}