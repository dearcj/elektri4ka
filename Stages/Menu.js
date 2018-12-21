var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../Neu/Stage", "../main", "../Neu/BaseObjects/TextBox"], function (require, exports, Stage_1, main_1, TextBox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.API_PHP_FILE = "http://levelgroup.ru/game.php";
    var Menu = /** @class */ (function (_super) {
        __extends(Menu, _super);
        function Menu() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Menu.prototype.addLine = function (inx, data) {
            if (main_1._.sm.stage != this)
                return;
            var tbname = new TextBox_1.TextBox([180, 580 + inx * 60]);
            tbname.init({ text: data.name + (data.lastname != "") ? (" " + data.lastname) : "" });
            var tbscore = new TextBox_1.TextBox([570, 580 + inx * 60]);
            tbscore.init({ align: "right", text: data.score.toString() });
        };
        Menu.prototype.getLeaderboard = function () {
            var _this = this;
            main_1.$.post(exports.API_PHP_FILE, { func: "leaderboard" })
                .done(function (data) {
                var d = JSON.parse(data);
                var inx = 0;
                for (var _i = 0, d_1 = d; _i < d_1.length; _i++) {
                    var x = d_1[_i];
                    if (inx > 10)
                        break;
                    _this.addLine(inx, d[inx]);
                    inx++;
                } ///
            });
        };
        Menu.prototype.onShow = function () {
            _super.prototype.onShow.call(this);
            main_1._.lm.load(this, 'menu', null);
            main_1._.sm.findOne("btnplay").click = function () {
                // vkpost("lalalal");
                main_1._.sm.openStage(main_1._.game);
            };
            main_1._.sm.findOne("btnrules").click = function () {
                main_1._.sm.openStage(main_1._.rules);
            };
            main_1._.sm.findOne("btnscore").click = function () {
                main_1._.sm.openStage(main_1._.scores);
            };
            if (window.RESULT_MODAL_IN_MENU) {
                main_1._.game.score = 999;
                main_1._.game.ShowResModal();
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
        };
        return Menu;
    }(Stage_1.Stage));
    exports.Menu = Menu;
});
