import {Stage} from "../Neu/Stage";
import {$, _} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {vkpost} from "../Socials";
import {ScrollBox} from "../Objects/ScrollBox";
import {O} from "../Neu/BaseObjects/O";


export class Rules extends Stage {
    withPlay: boolean = false;

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


        (<Button>_.sm.findOne("btnback")).click = ()=>{
            _.sm.openStage(_.menu)
        };

        let scrollbox = _.sm.findByType(ScrollBox)[0];

        let m = _.sm.findMultiple("toscrollbox");

        for (let x of m) {
            O.rp(x.gfx);
            scrollbox.masked.addChild(x.gfx);
        }

        let btnplay = _.sm.findOne("btnplay");
        if (this.withPlay) {
            O.rp(btnplay.gfx);
            scrollbox.masked.addChild(btnplay.gfx);
            (<Button>btnplay).click = () => {
                _.sm.openStage(_.game);
            };
            (<Button>_.sm.findOne("btnback")).killNow();
        } else {
            btnplay.killNow();
        }


    }
}