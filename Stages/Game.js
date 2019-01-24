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
define(["require", "exports", "../Neu/Stage", "../main", "../Neu/BaseObjects/O", "../Socials", "./Menu", "../ProblemGenerator", "../Objects/ToolsBar", "../Neu/Application", "../Objects/AngryBar"], function (require, exports, Stage_1, main_1, O_1, Socials_1, Menu_1, ProblemGenerator_1, ToolsBar_1, Application_1, AngryBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LEVEL_TIME = 160.;
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
            _this.paused = false;
            _this._score = 0;
            _this.secs = 0;
            _this.level = 3;
            _this.limit = 0;
            return _this;
        }
        Game.prototype.pause = function (mode) {
            this.pauseTint = O_1.O.rp(this.pauseTint);
            if (mode) {
                this.pauseTint = new PIXI.Sprite(PIXI.Texture.WHITE);
                this.pauseTint.width = main_1.SCR_WIDTH;
                this.pauseTint.height = main_1.SCR_HEIGHT;
                this.pauseTint.alpha = 0.5;
                main_1._.sm.findOne("btnpause").gfx.alpha = 0;
                main_1._.sm.findOne("btnstart").gfx.alpha = 1;
                main_1._.sm.gui.addChild(this.pauseTint);
                this.pauseTint.tint = 0x333344;
                Application_1.TweenMax.pauseAll(true, true, true);
            }
            else {
                main_1._.sm.findOne("btnpause").gfx.alpha = 1;
                main_1._.sm.findOne("btnstart").gfx.alpha = 0;
                Application_1.TweenMax.resumeAll(true, true, true);
            }
            this.paused = mode;
            this.pg.pause(mode);
        };
        Object.defineProperty(Game.prototype, "progress", {
            get: function () {
                return this._progress;
            },
            set: function (value) {
                this._progress = value;
                var pb = main_1._.sm.findOne("progressbar");
                pb.gfx.width = this.initProgressW * value;
                if (value < 0.00001)
                    pb.gfx.scale.x = 0.00001;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "score", {
            get: function () {
                return this._score;
            },
            set: function (value) {
                this._score = value;
                var tb = main_1._.sm.findOne("score");
                var scoreStr = value.toString();
                var len = scoreStr.length;
                var str = ('0000' + scoreStr).slice(-4);
                tb.text = str;
            },
            enumerable: true,
            configurable: true
        });
        Game.prototype.submitScore = function (s, social_id, name, last_name) {
            if (s == 0)
                return;
            main_1.$.post(Menu_1.API_PHP_FILE, { func: "submit", score: s.toString(), social_id: social_id, name: name, last_name: last_name })
                .done(function (data) {
            });
        };
        Game.prototype.onShow = function () {
            var _this = this;
            this.resModal = null;
            _super.prototype.onShow.call(this);
            this.toolsBar = new ToolsBar_1.ToolsBar([0, 0], null);
            this._progress = 0;
            if (window.RESULT_MODAL_IN_MENU) {
                main_1._.game.score = 999;
                main_1._.game.ShowResModal();
            }
            this.progressAnim = Application_1.TweenMax.to(this, exports.LEVEL_TIME, { progress: 1, ease: Application_1.Linear.easeNone,
                onComplete: function () {
                    _this.ShowResModal();
                } });
            this.pg = new ProblemGenerator_1.ProblemGenerator();
            main_1._.lm.load(this, 'gameui', null);
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) {
                    _this.pause(true);
                }
                else {
                    _this.pause(false);
                }
            });
            main_1._.sm.findOne("btnstart").gfx.alpha = 0;
            main_1._.sm.findOne("btnpause").click = function () {
                _this.pause(!_this.paused);
            };
            main_1._.sm.findOne("btnmenu").click = function () {
                main_1._.sm.openStage(main_1._.menu);
            };
            main_1._.sm.findOne("btnstart").click = function () {
                _this.pause(!_this.paused);
            };
            this.pg.run();
            this.score = 0;
            var pb = main_1._.sm.findOne("progressbar");
            this.initProgressW = pb.gfx.width;
            pb.gfx.anchor.x = 0;
            pb.x -= pb.width / 2;
            this.pause(false);
            main_1._.sm.findByType(AngryBar_1.AngryBar)[0].value = 1;
        };
        Game.prototype.CloseResModal = function () {
            main_1._.sm.removeList(this.resModal);
        };
        Game.prototype.onHide = function (s) {
            this.whiteSpace = O_1.O.rp(this.whiteSpace);
            this.timeInterval = main_1._.killTweens(this.timeInterval);
            this.progressAnim = main_1._.killTweens(this.progressAnim);
            _super.prototype.onHide.call(this, s);
            this.toolsBar.killNow();
        };
        Game.prototype.ShowResModal = function () {
            var _this = this;
            if (this.resModal) {
                return;
            }
            this.pg.pause(true);
            Application_1.TweenMax.pauseAll(true, true, true);
            this.resModal = main_1._.lm.load(main_1._.game, 'winmodal', null, null, main_1._.screenCenterOffset);
            var win = main_1._.sm.findOne("scorewin", this.resModal);
            win.text = "Вы набрали " + this.score + " очков";
            var vk = main_1._.sm.findOne("btnvk", this.resModal);
            var fb = main_1._.sm.findOne("btnfb", this.resModal);
            var retry = main_1._.sm.findOne("btnretry", this.resModal);
            retry.click = function () {
                main_1._.sm.openStage(_this);
            };
            vk.click = function () {
                Socials_1.vkpost("");
            };
            fb.click = function () {
                Socials_1.fbpost();
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
        };
        Game.prototype.SetScore = function (x) {
            this._score = x;
            if (x == 0)
                main_1._.sm.findOne("_score").text = '';
            else
                main_1._.sm.findOne("_score").text = this.AddZeroes(x);
        };
        Game.prototype.AddZeroes = function (x) {
            if (x < 10)
                return '0000' + x.toString();
            else if (x < 100)
                return '000' + x.toString();
            else if (x < 1000)
                return '00' + x.toString();
            return x.toString();
        };
        Game.prototype.updateTime = function () {
            var mins = Math.floor(this.secs / 60);
            var secs = this.secs % 60;
            var time = main_1._.sm.findOne("time");
            time.text = mins + ":" + (secs > 10 ? secs.toString() : "0" + secs.toString());
        };
        return Game;
    }(Stage_1.Stage));
    exports.Game = Game;
});
