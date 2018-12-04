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
define(["require", "exports", "./Stage", "../main", "../Neu/BaseObjects/O", "../Socials", "./Menu"], function (require, exports, Stage_1, main_1, O_1, Socials_1, Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LevelsShapes = [
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
        ]
    ];
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.score = 0;
            _this.secs = 0;
            _this.level = 3;
            _this.limit = 0;
            return _this;
        }
        Game.prototype.submitScore = function (s, social_id, name, last_name) {
            if (s == 0)
                return;
            main_1.$.post(Menu_1.API_PHP_FILE, { func: "submit", score: s.toString(), social_id: social_id, name: name, last_name: last_name })
                .done(function (data) {
            });
        };
        Game.prototype.onShow = function () {
            var _this = this;
            _super.prototype.onShow.call(this);
            console.log("wwww");
            main_1._.lm.load(this, 'game', null);
            var btnMenu = main_1._.sm.findStringId("menu");
            btnMenu.click = function () {
                main_1._.sm.openStage(main_1._.menu);
            };
            var btnSubmit = main_1._.sm.findStringId("btnsubmit");
            btnSubmit.textField.tint = 0x111111;
            btnSubmit.prevTextTint = 0x111111;
            var btnReset = main_1._.sm.findStringId("btnreset");
            btnReset.click = function () {
                main_1._.sm.openStage(main_1._.game);
            };
            O_1.O.rp(btnMenu.gfx);
            main_1._.sm.gui2.addChild(btnMenu.gfx);
            O_1.O.rp(btnReset.gfx);
            main_1._.sm.gui2.addChild(btnReset.gfx);
            btnSubmit.click = function () {
                if (_this.level == 3) {
                    main_1._.game.ShowResModal();
                }
                else {
                    _this.level++;
                    main_1._.sm.openStage(main_1._.game);
                }
            };
            var lev = main_1._.sm.findStringId("lev");
            lev.text = this.level.toString();
            this.secs = 0;
            this.updateTime();
            this.timeInterval = main_1._.sm.camera.setInterval(function () {
                _this.secs++;
                _this.updateTime();
            }, 1);
            this.limit = 1000;
            if (this.level == 1) {
                this.limit = 11;
            }
            if (this.level == 2) {
                this.limit = 18;
            }
            if (this.level == 1 || this.level == 2 || this.level == 3) {
                var helper = new Helper([main_1.SCR_WIDTH / 2, 180]);
                helper.init({});
            }
            this.whiteSpace = new PIXI.Graphics();
            this.whiteSpace.x = 0;
            this.whiteSpace.clear();
            this.whiteSpace.beginFill(0xffffff, 1);
            this.whiteSpace.drawRect(main_1.SCR_WIDTH, 0, 300, main_1.SCR_HEIGHT);
            this.whiteSpace.endFill();
            main_1._.sm.gui.addChild(this.whiteSpace);
            // _.game.ShowResModal();
        };
        Game.prototype.CloseResModal = function () {
            main_1._.sm.removeList(this.resModal);
        };
        Game.prototype.onHide = function (s) {
            this.whiteSpace = O_1.O.rp(this.whiteSpace);
            this.timeInterval = main_1._.killTween(this.timeInterval);
            _super.prototype.onHide.call(this, s);
        };
        Game.prototype.ShowResModal = function () {
            this.timeInterval = main_1._.killTween(this.timeInterval);
            this.resModal = main_1._.lm.load(main_1._.game, 'modal', null);
            var btnClose = main_1._.sm.findStringId("btncancel", this.resModal);
            var win = main_1._.sm.findStringId("scorewin", this.resModal);
            var ending = this.score % 10;
            var xxx = 'клеток';
            if (ending == 1)
                xxx = 'клетку';
            if (ending == 2 || ending == 3 || ending == 4)
                xxx = 'клетки';
            win.text = 'в ' + this.score.toString() + ' ' + xxx;
            var vk = main_1._.sm.findStringId("btnvk", this.resModal);
            var tw = main_1._.sm.findStringId("btntw", this.resModal);
            var ok = main_1._.sm.findStringId("btnok", this.resModal);
            var fb = main_1._.sm.findStringId("btnfb", this.resModal);
            vk.click = function () {
                Socials_1.vkpost("\u0423\u043F\u0430\u043A\u0443\u0439 \u043C\u0435\u043D\u044F, \u0435\u0441\u043B\u0438 \u0441\u043C\u043E\u0436\u0435\u0448\u044C!\n\u042D\u0442\u0430 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0438\u0433\u0440\u0430 \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u043A\u0440\u0443\u0447\u0435 2048");
            };
            fb.click = function () {
                Socials_1.fbpost();
            };
            var g = main_1._.cs("btnton1.png");
            g.scale.x = 1.5;
            g.scale.y = 1.5;
            var btnTON = new Button(main_1._.sm.findStringId("btntonpos").pos, g);
            btnTON.init({ text: "N+1", fontscale: 0.7, });
            btnTON.click = function () {
                window.open(window.LINK_TO_SOCIAL);
            };
            main_1._.sm.gui2.addChild(btnTON.gfx);
        };
        Game.prototype.SetScore = function (x) {
            this.score = x;
            if (x == 0)
                main_1._.sm.findStringId("score").text = '';
            else
                main_1._.sm.findStringId("score").text = this.AddZeroes(x);
        };
        Game.prototype.AddZeroes = function (x) {
            if (x < 10)
                return '00' + x.toString();
            if (x < 100)
                return '0' + x.toString();
            return x.toString();
        };
        Game.prototype.updateTime = function () {
            var mins = Math.floor(this.secs / 60);
            var secs = this.secs % 60;
            var time = main_1._.sm.findStringId("time");
            time.text = mins + ":" + (secs > 10 ? secs.toString() : "0" + secs.toString());
        };
        return Game;
    }(Stage_1.Stage));
    exports.Game = Game;
});
