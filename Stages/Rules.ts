import {Stage} from "../Neu/Stage";
import {$, _} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {vkpost} from "../Socials";
import {ScrollBox} from "../Objects/ScrollBox";
import {O} from "../Neu/BaseObjects/O";


export class Rules extends Stage {

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

        if ((<any>window).RESULT_MODAL_IN_MENU) {
            _.game.score = 999;
            _.game.ShowResModal();
        }


        (<Button>_.sm.findOne("btnback")).click = ()=>{
            _.sm.openStage(_.menu)
        };

        let scrollbox = _.sm.findByType(ScrollBox)[0];
        let c = this.layers["scrollbox"].children;
        console.log(c);

        let m = _.sm.findMultiple("toscrollbox");

        for (let x of m) {
            O.rp(x.gfx);

            scrollbox.masked.addChild(x.gfx);
        }
    }
}