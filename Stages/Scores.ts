import {Stage} from "../Neu/Stage";
import {$, _} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {vkpost} from "../Socials";
import {ScrollBox} from "../Objects/ScrollBox";
import {O} from "../Neu/BaseObjects/O";
export class Scores extends Stage {

    addLine(inx: number, data: any) {
        if (_.sm.stage != this) return;
        let tbname = new TextBox([180, 120 + inx * 60]);
        tbname.init({ text: data.name + (data.lastname != "")?(" " + data.lastname):""});
        let tbscore = new TextBox([570, 120 + inx * 60]);
        tbscore.init({align: "right", text: data.score.toString()});
        let scrollbox = _.sm.findByType(ScrollBox)[0];
        O.rp(tbname.gfx);
        O.rp(tbscore.gfx);

        scrollbox.masked.addChild(tbname.gfx, tbscore.gfx)
    }

    getLeaderboard() {
        $.post( (<any>window).API_PHP_FILE, { func: "leaderboard" })
            .done(( data ) => {
                let d = JSON.parse(data);
                let inx = 0;
                for (let x of d) {
                //   if (inx > 10) break;
                    this.addLine(inx, d[inx]);
                    inx++;
                }///
            });
    }

    onShow() {
        super.onShow();
        _.lm.load(this, 'scores', null);

        if ((<any>window).RESULT_MODAL_IN_MENU) {
            _.game.score = 999;
            _.game.ShowResModal();
        }

        (<Button>_.sm.findOne("btnback")).click = ()=>{
            _.sm.openStage(_.menu)
        };

        let scrollbox = _.sm.findByType(ScrollBox)[0];
        scrollbox.maxScroll = 550;

       // let g = _.cs("btnton1.png");
       // g.scale.x = 1.5;
       // g.scale.y = 1.5;
       // let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
       // btnTON.init({text:"N+1", fontscale: 0.7,});
       // (<Button>btnTON).click = () => {
       //     window.open((<any>window).LINK_TO_SOCIAL);
       // };

        //_.sm.gui2.addChild(btnTON.gfx);

        this.getLeaderboard();
    }
}