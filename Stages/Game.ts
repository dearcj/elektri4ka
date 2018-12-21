import {Stage} from "../Neu/Stage";
import {$, _, SCR_HEIGHT, SCR_WIDTH} from "../main";
import {O} from "../Neu/BaseObjects/O";
import {fbpost, okpost, twpost, vkpost} from "../Socials";
import {API_PHP_FILE} from "./Menu";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {ProblemGenerator} from "../ProblemGenerator";
import {ToolsBar} from "../Objects/ToolsBar";
import {Linear, TweenMax} from "../Neu/Application";
import {AngryBar} from "../Objects/AngryBar";

export const LEVEL_TIME = 150.;

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
    public progressAnim: any;
    private paused: boolean = false;
    private pauseTint: PIXI.Sprite;
    private initProgressW: number;

    pause(mode: boolean) {
        this.pauseTint = O.rp(this.pauseTint);
        if (mode) {
            this.pauseTint = new PIXI.Sprite(PIXI.Texture.WHITE);
            this.pauseTint.width = SCR_WIDTH;
            this.pauseTint.height = SCR_HEIGHT;
            this.pauseTint.alpha = 0.5;
            (<Button>_.sm.findOne("btnpause")).gfx.alpha = 0;
            (<Button>_.sm.findOne("btnstart")).gfx.alpha = 1;

            _.sm.gui.addChild(this.pauseTint);
            this.pauseTint.tint = 0x333344;
            TweenMax.pauseAll(true, true, true);
        } else {
            (<Button>_.sm.findOne("btnpause")).gfx.alpha = 1;
            (<Button>_.sm.findOne("btnstart")).gfx.alpha = 0;

            TweenMax.resumeAll(true, true, true);
        }
        this.paused = mode;

        this.pg.pause(mode);
    }

    get progress(): number {
        return this._progress;
    }

    set progress(value: number) {
        this._progress = value;
        let pb = _.sm.findOne("progressbar");
        pb.gfx.width = this.initProgressW * value;
        if (value < 0.00001)
            pb.gfx.scale.x= 0.00001;
    }
    private _progress: number;
    get score(): number {
        return this._score;
    }

    set score(value: number) {
        this._score = value;
        let tb = _.sm.findOne("score");
        let scoreStr = value.toString();
        let len = scoreStr.length;
        let str = ('0000' + scoreStr).slice(-4);
        (<TextBox>tb).text = str;
    }
    whiteSpace: PIXI.Graphics;
    private resModal: Array<O>;
    private _score: number = 0;
    secs: number = 0;
    level: number = 3;
    private timeInterval: any;
    public limit: number = 0;
    public pg: ProblemGenerator;
    public toolsBar: ToolsBar;

    submitScore(s: number, social_id: string, name: string, last_name: string) {
        if (s == 0) return;
        $.post( API_PHP_FILE, { func: "submit", score: s.toString(), social_id: social_id, name: name, last_name: last_name   })
            .done(( data ) => {

            });
    }

    onShow() {
        this.resModal = null;
        super.onShow();
        this.toolsBar = new ToolsBar([0,0], null);
        this._progress = 0;
        this.progressAnim = TweenMax.to(this, LEVEL_TIME, {progress: 1, ease: Linear.easeNone,
            onComplete: ()=>{
            this.ShowResModal();
        }});


        this.pg = new ProblemGenerator();
        _.lm.load(this, 'gameui', null);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause(true)
            } else {
                this.pause(false)
            }
        });

        (<Button>_.sm.findOne("btnstart")).gfx.alpha = 0;
        (<Button>_.sm.findOne("btnpause")).click = () => {
            this.pause(!this.paused)
        };

        (<Button>_.sm.findOne("btnmenu")).click = () => {
            _.sm.openStage(_.menu)
        };

        (<Button>_.sm.findOne("btnstart")).click = () => {
            this.pause(!this.paused)
        };
        this.pg.run();
        this.score = 0;

        let pb = _.sm.findOne("progressbar");
        this.initProgressW = pb.gfx.width;

        pb.gfx.anchor.x = 0;
        pb.x -= pb.width / 2;

        this.pause(false);

        _.sm.findByType(AngryBar)[0].value = 1;
    }

    CloseResModal() {
        _.sm.removeList(this.resModal);
    }

    onHide(s: Stage) {
        this.whiteSpace = O.rp(this.whiteSpace);
        this.timeInterval = _.killTweens(this.timeInterval);
        this.progressAnim = _.killTweens(this.progressAnim);
        super.onHide(s);
        this.toolsBar.killNow();
    }

    ShowResModal() {
        if (this.resModal) {
            return;
        }

        this.pg.pause(true);
        TweenMax.pauseAll(true, true, true);
        this.resModal = _.lm.load(_.game, 'winmodal', null);
        let win = _.sm.findOne("scorewin", this.resModal);
        (<TextBox>win).text = "Вы набрали " + this.score + " очков";

        let vk = <Button>_.sm.findOne("btnvk", this.resModal);
        let fb = <Button>_.sm.findOne("btnfb", this.resModal);
        let retry = <Button>_.sm.findOne("btnretry", this.resModal);
        retry.click=() => {
          _.sm.openStage(this);
        };
        vk.click = () => {
            vkpost(``);
        };

        fb.click = () => {
            fbpost();
        };

/*        let g = _.cs("btnton1.png");
        g.scale.x = 1.5;
        g.scale.y = 1.5;
        let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
        btnTON.init({text:"N+1", fontscale: 0.7,});
        (<Button>btnTON).click = () => {
            window.open((<any>window).LINK_TO_SOCIAL);
        };

        _.sm.gui2.addChild(btnTON.gfx);*/
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