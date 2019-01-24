import {Stage} from "../Neu/Stage";
import {$, _} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {vkpost} from "../Socials";
import {ScrollBox} from "../Objects/ScrollBox";
import {O} from "../Neu/BaseObjects/O";


export class Rules extends Stage {
    withPlay: boolean = false;
    private page: number;

    addLine(inx: number, data: any) {
        if (_.sm.stage != this) return;
        let tbname = new TextBox([180, 580 + inx * 60]);
        tbname.init({ text: data.name + (data.lastname != "")?(" " + data.lastname):""});
        let tbscore = new TextBox([570, 580 + inx * 60]);
        tbscore.init({align: "right", text: data.score.toString()});
    }


    onShow() {
        super.onShow();
        _.lm.load(this, 'rules', null);


        (<Button>_.sm.findOne("btnreturn")).click = ()=>{
            _.sm.openStage(_.menu)
        };

        let scrollbox = _.sm.findByType(ScrollBox)[0];

        let m = _.sm.findMultiple("toscrollbox");

        for (let x of m) {
            O.rp(x.gfx);
            scrollbox.masked.addChild(x.gfx);
        }

        let btnplay = _.sm.findOne("btnplay");
        let btnnext = _.sm.findOne("btnnext");
        let btnback= _.sm.findOne("btnback");
        btnplay.gfx.visible = false;

        this.page = 0;
        this.updateButtons();

        (<Button>btnnext).click = () => {
            this.page++;

            this.updateButtons();

        };

        (<Button>btnplay).click = () => {
            _.sm.openStage(_.game);
        };

        (<Button>btnback).click = () => {
            this.page--;

            this.updateButtons();

        };

        if (this.withPlay) {
        } else {
        }


    }

    updateButtons(): any {
        let scrollbox = _.sm.findByType(ScrollBox)[0];
        let btnplay = _.sm.findOne("btnplay");
        let btnnext = _.sm.findOne("btnnext");
        let btnback = _.sm.findOne("btnback");

        let offs = 100;

        if (this.page == 0) {
            scrollbox.masked.y= offs;
            btnback.gfx.visible = false;
            btnnext.gfx.visible = true;
        }

        if (this.page == 1) {
            scrollbox.masked.y= -730+ offs;
            btnnext.gfx.visible = true;
            btnback.gfx.visible = true;
        }

        if (this.page == 2) {
            scrollbox.masked.y= -1400 + offs;
            btnnext.gfx.visible = false;
            btnback.gfx.visible = true;
            if (this.withPlay) {
                btnplay.gfx.visible = true;
            } else {
                btnplay.gfx.visible = false;
            }
        } else {
        }


    }
}