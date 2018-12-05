import {O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {_} from "../main";
import {ProblemType} from "../ProblemGenerator";
const CellHeight: number = 65;

export class Problem extends O {
    public solved: boolean = false;
    readonly problemType: ProblemType;
    private bigProblemSprite: PIXI.heaven.Sprite;
    public gfxBrick: PIXI.Sprite;

    get bigProblem(): boolean {
        return this._bigProblem;
    }

    set bigProblem(value: boolean) {
        this._bigProblem = value;
        if (value) {
            this.bigProblemSprite = _.cs("icon_problembar_chp", this.gfx);
            this.bigProblemSprite.scale.set(0.5);
            this.bigProblemSprite.y = 35;
            this.bigProblemSprite.x = 50;
            this.gfxBrick.tint = 0xff4633;
        } else {
            this.bigProblemSprite = O.rp(this.bigProblemSprite);
            this.gfxBrick.tint = 0xffffff;
        }
    }
    private _bigProblem: boolean = false;

    constructor (pos: Vec2 = null, gfx: PIXI.DisplayObject = null, problemType: ProblemType) {
        super(pos, null);
        this.problemType = problemType;
        this.gfx = _.cc(
        this.gfxBrick = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.gfx.addChild(this.gfxBrick);
        this.bigProblem = true;

        this.gfxBrick.height = CellHeight;
        this.gfxBrick.width = 20;
    }
}