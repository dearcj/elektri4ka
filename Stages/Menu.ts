import {Stage} from "../Neu/Stage";
import {$, _} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {vkpost} from "../Socials";

export let API_PHP_FILE = "http://levelgroup.ru/game.php";
export class Menu extends Stage {

    addLine(inx: number, data: any) {
        if (_.sm.stage != this) return;
        let tbname = new TextBox([180, 580 + inx * 60]);
        tbname.init({ text: data.name + (data.lastname != "")?(" " + data.lastname):""});
        let tbscore = new TextBox([570, 580 + inx * 60]);
        tbscore.init({align: "right", text: data.score.toString()});

    }

    getLeaderboard() {
        $.post( API_PHP_FILE, { func: "leaderboard" })
            .done(( data ) => {
                let d = JSON.parse(data);
                let inx = 0;
                for (let x of d) {
                    if (inx > 10) break;
                    this.addLine(inx, d[inx]);
                    inx++;
                }///
            });
    }

    onShow() {
        super.onShow();
        _.lm.load(this, 'menu', null, null, _.screenCenterOffset);
        (<Button>_.sm.findOne("btnplay")).click = ()=>{
           // vkpost("lalalal");
            _.rules.withPlay = true;
            _.sm.openStage(_.rules);
        };

        (<Button>_.sm.findOne("btnrules")).click = ()=>{
            _.rules.withPlay = false;
            _.sm.openStage(_.rules)
        };

        (<Button>_.sm.findOne("btnscore")).click = ()=>{
            _.sm.openStage(_.scores)
        };


        if ((<any>window).RESULT_MODAL_IN_MENU) {
            _.game.score = 999;
            _.game.ShowResModal();
        }

       // let g = _.cs("btnton1.png");
       // g.scale.x = 1.5;
       // g.scale.y = 1.5;
       // let btnTON = new Button(_.sm.findOne("btntonpos").pos, g);
       // btnTON.init({text:"N+1", fontscale: 0.7,});
       // (<Button>btnTON).click = () => {
       //     window.open((<any>window).LINK_TO_SOCIAL);
       // };

        //_.sm.gui2.addChild(btnTON.gfx);

     // /   this.getLeaderboard();
    }
}