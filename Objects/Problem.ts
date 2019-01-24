import {O} from "../Neu/BaseObjects/O";
import {Vec2} from "../Neu/Math";
import {_, SCR_WIDTH} from "../main";
import {ProblemType} from "../ProblemGenerator";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {HeavenBitmapText} from "../Neu/PIXIPlugins/HeavenBitmapText";
import {ButtonTool} from "./ButtonTool";
import {TweenMax} from "../Neu/Application";
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
    private textField2: HeavenBitmapText;

    solveAnimation() {
        TweenMax.to(this.gfx, 1.4, {alpha: 0.});
        for (let x of this.toolsSolved) {
            TweenMax.to(x.gfx, 1.4, {alpha: 0.});
        }
    }

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

            s.gfx.alpha = 1;
            s.gfx.interactive= false;
            s.gfx.y = this.y + 6 + s.gfx.height / 4;
            s.gfx.width = 80;
            s.gfx.height = 80;
            this.alignTools();

            return true;
        } else {
            this.wrongSolutionAnim();

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
            this.gfxBrick.color.lightRgba = 0xff4633;

        } else {
            this.bigProblemSprite = O.rp(this.bigProblemSprite);
        }
    }
    private _bigProblem: boolean = false;

    constructor (pos: Vec2 = null, gfx: PIXI.DisplayObject = null, problemType: ProblemType) {
        super(pos, null);
        this.problemType = problemType;
        this.gfx = _.cc(
        this.gfxBrick = new PIXI.heaven.Sprite(PIXI.Texture.WHITE);
        let lines = problemType.text.split("\n");

        this.textField = TextBox.createTextField({}, {fontscale: 0.5, align: "left", text: lines[0]});
        this.textField.x = 14 + this.textField.width / 2;
        this.textField.y = 12 + -14;
        this.textField.tint = 0x111111;


        if (lines.length > 1) {
            this.textField2 = TextBox.createTextField({}, {fontscale: 0.5, align: "left", text: lines[1]});
            this.textField2.x = 14 + this.textField2.width / 2;
            this.textField2.y = 12 + 10;
            this.textField2.tint = 0x111111;
        }

        this.gfx.addChild(this.gfxBrick);

        if (problemType.type == 0) {
            this.bigProblem = true;
        }

        this.gfx.addChild(this.textField);

        if (this.textField2)
        this.gfx.addChild(this.textField2);

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

    public failanim() {
        TweenMax.to(this.gfxBrick.color, 0.05, {lightG: 0, lightB: 0, yoyo: true, repeat: 4});
        TweenMax.to(this.gfx, 0.9, {alpha: 0.});

        for (let x of this.toolsSolved) {
            TweenMax.to(x.gfx, 0.9, {alpha: 0.});
        }
    }


    private wrongSolutionAnim() {
        TweenMax.to(this, 0.05, {y: this.y - 2, yoyo: true, repeat: 5});
        TweenMax.to(this.gfx, 0.05, {alpha: 0.8, yoyo: true, repeat: 5});
        //TweenMax.to(this.gfx.scale, 0.05, {x: 0.97, y: 0.97, yoyo: true, repeat: 5});
    }
}