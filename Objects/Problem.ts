import {O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {_, SCR_WIDTH} from "../main";
import {ProblemType} from "../ProblemGenerator";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {HeavenBitmapText} from "../Neu/PIXIPlugins/HeavenBitmapText";
import {ButtonTool} from "./ButtonTool";
const CellHeight: number = 78;

export class Problem extends O {
    public solutions : number[] = [];
    public solved: boolean = false;
    readonly problemType: ProblemType;
    private bigProblemSprite: PIXI.heaven.Sprite;
    public gfxBrick: PIXI.Sprite;
    private textField: HeavenBitmapText;
    toolsSolved: ButtonTool[]= [];
    line: number = 0;

    onDestroy() {
        super.onDestroy();

        this.toolsSolved = null;
    }

    dropSolution(s: ButtonTool): boolean {
        if (this.solutions.indexOf(s.solution.type) >= 0) {
            return false;
        }

        if (this.problemType.solutions.indexOf(s.solution.type) >= 0) {
            this.solutions.push(s.solution.type);

            this.toolsSolved.push(s);

            s.gfx.alpha = .8;
            s.gfx.interactive= false;
            s.gfx.y = this.y + 6 + s.gfx.height / 4;
            s.gfx.scale.set(0.5);
            this.alignTools();

            return true;
        } else {
            return false;
        }
    }

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
        }
    }
    private _bigProblem: boolean = false;

    constructor (pos: Vec2 = null, gfx: PIXI.DisplayObject = null, problemType: ProblemType) {
        super(pos, null);
        this.problemType = problemType;
        this.gfx = _.cc(
        this.gfxBrick = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.textField = TextBox.createTextField({}, {fontscale: 0.5, align: "left", text: problemType.text});
        this.textField.x = 14 + this.textField.width / 2;
        this.textField.y = -14;
        this.textField.tint = 0x111111;
        this.gfx.addChild(this.gfxBrick);

        if (problemType.type == 0) {
            this.bigProblem = true;
        }

        if (problemType.complicated) {
            this.gfxBrick.tint = 0xff601a;
        }
        this.gfx.addChild(this.textField);

        this.gfxBrick.height = CellHeight;
        this.gfxBrick.width = 20;
    }

    private alignTools() {
        let w = SCR_WIDTH - this.gfx.x;
        let inx = this.toolsSolved.length - 1;
        for (let x of this.toolsSolved) {
            x.gfx.x = this.gfx.x + w - 80*inx - x.gfx.width / 2;
            inx--;
        }
    }
}