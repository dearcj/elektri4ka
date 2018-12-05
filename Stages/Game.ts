import {Stage} from "../Neu/Stage";
import {$, _, SCR_HEIGHT, SCR_WIDTH} from "../main";
import {O} from "../Neu/BaseObjects/O";
import {fbpost, okpost, twpost, vkpost} from "../Socials";
import {API_PHP_FILE} from "./Menu";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {ProblemGenerator} from "../ProblemGenerator";
import {ToolsBar} from "../Objects/ToolsBar";

type LevelShape = {
    ShapeID: number,
    Quantity: number,
}

export let LevelsShapes: Array<Array<LevelShape>> = [
    [
        {
            ShapeID: 5,
            Quantity: 1,
        },
        {
            ShapeID: 6,
            Quantity: 1,
        }
    ],
    [
        {
            ShapeID: 10,
            Quantity: 1,
        },
        {
            ShapeID: 5,
            Quantity: 1,
        },
        {
            ShapeID: 9,
            Quantity: 1,
        }
    ],
    [
        {
            ShapeID: 10,
            Quantity: 2,
        },
        {
            ShapeID: 12,
            Quantity: 2,
        },
        {
            ShapeID: 9,
            Quantity: 2,
        },
        {
            ShapeID: 5,
            Quantity: 1,
        }
    ]];

export class Game extends Stage {
    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
        let tb = _.sm.findOne("score");
        let scoreStr = value.toString();
        let len = scoreStr.length;
        let str = ('00000' + scoreStr).slice(-5);
        (<TextBox>tb).text = str;
    }
    whiteSpace: PIXI.Graphics;
    private resModal: Array<O>;
    private _score: number = 0;
    secs: number = 0;
    level: number = 3;
    private timeInterval: any;
    public limit: number = 0;
    public pg;
    public toolsBar: ToolsBar;

    submitScore(s: number, social_id: string, name: string, last_name: string) {
        if (s == 0) return;
        $.post( API_PHP_FILE, { func: "submit", score: s.toString(), social_id: social_id, name: name, last_name: last_name   })
            .done(( data ) => {

            });
    }

    onShow() {
        super.onShow();
        this.toolsBar = new ToolsBar();

        this.pg = new ProblemGenerator();
        _.lm.load(this, 'gameui', null);
        this.pg.run();
        this.score = 1231;
      /*  let btnMenu = _.sm.findOne("menu");
       (<Button>btnMenu).click = () => {
            _.sm.openStage(_.menu);
        };
        let btnSubmit = _.sm.findOne("btnsubmit");
        (<Button>btnSubmit).textField.tint = 0x111111;

        let btnReset = _.sm.findOne("btnreset");
        (<Button>btnReset).click = () => {
            _.sm.openStage(_.game);
        };

        O.rp(btnMenu.gfx);
        _.sm.gui2.addChild(btnMenu.gfx);
        O.rp(btnReset.gfx);
        _.sm.gui2.addChild(btnReset.gfx);

        (<Button>btnSubmit).click = () => {
            if (this.level == 3) {
                _.game.ShowResModal();
            } else {
                this.level++;
                _.sm.openStage(_.game);
            }
        };

        let lev = _.sm.findOne("lev");
        (<TextBox>lev).text = this.level.toString();
        this.secs = 0;
        this.updateTime();
        this.timeInterval = _.sm.camera.setInterval(() => {
            this.secs++;
            this.updateTime();
        }, 1);
        this.limit = 1000;

        if (this.level == 1) {
            this.limit = 11;
        }

        if (this.level == 2) {
            this.limit = 18;
        }

        this.whiteSpace= new PIXI.Graphics();
        this.whiteSpace.x = 0;
        this.whiteSpace.clear();
        this.whiteSpace.beginFill(0xffffff,1);
        this.whiteSpace.drawRect(SCR_WIDTH, 0, 300, SCR_HEIGHT);
        this.whiteSpace.endFill();
        _.sm.gui.addChild(this.whiteSpace);
        // _.game.ShowResModal(); */
    }

    CloseResModal() {
        _.sm.removeList(this.resModal);
    }

    onHide(s: Stage) {
        this.whiteSpace = O.rp(this.whiteSpace);
        this.timeInterval = _.killTween(this.timeInterval);
        super.onHide(s);
        this.toolsBar.killNow();
    }

    ShowResModal() {
        this.timeInterval = _.killTween(this.timeInterval);
        this.resModal = _.lm.load(_.game, 'modal', null);
        let btnClose = _.sm.findOne("btncancel", this.resModal);
        let win = _.sm.findOne("scorewin", this.resModal);
        let ending = this._score % 10;
        let xxx = 'клеток';
        if (ending == 1) xxx = 'клетку';
        if (ending == 2 || ending == 3 || ending == 4 ) xxx = 'клетки';
        (<TextBox>win).text = 'в ' + this._score.toString() + ' ' + xxx;

        let vk = <Button>_.sm.findOne("btnvk", this.resModal);
        let tw = <Button>_.sm.findOne("btntw", this.resModal);
        let ok = <Button>_.sm.findOne("btnok", this.resModal);
        let fb = <Button>_.sm.findOne("btnfb", this.resModal);
        vk.click = () => {
            vkpost(`Упакуй меня, если сможешь!
Эта математическая игра будет покруче 2048`);
        };

        fb.click = () => {
            fbpost();
        };

        let g = _.cs("btnton1.png");
        g.scale.x = 1.5;
        g.scale.y = 1.5;
        let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
        btnTON.init({text:"N+1", fontscale: 0.7,});
        (<Button>btnTON).click = () => {
            window.open((<any>window).LINK_TO_SOCIAL);
        };

        _.sm.gui2.addChild(btnTON.gfx);
    }

    SetScore(x: number) {
        this._score = x;
        if (x == 0)
            (<TextBox>_.sm.findOne("_score")).text = ''; else
            (<TextBox>_.sm.findOne("_score")).text = this.AddZeroes(x);
    }

    private AddZeroes(x: number): string {
        if (x < 10) return '00' + x.toString();
        if (x < 100) return '0' + x.toString();
        return x.toString();
    }

    private updateTime() {
        let mins = Math.floor(this.secs / 60);
        let secs = this.secs % 60;
        let time = _.sm.findOne("time");
        (<TextBox>time).text = mins + ":" + (secs > 10 ? secs.toString() : "0" + secs.toString());
    }
}