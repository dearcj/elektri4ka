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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../Neu/BaseObjects/TextBox", "../Neu/Application"], function (require, exports, O_1, main_1, TextBox_1, Application_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CellHeight = 78;
    var Problem = /** @class */ (function (_super) {
        __extends(Problem, _super);
        function Problem(pos, gfx, problemType) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            var _this = _super.call(this, pos, null) || this;
            _this.solutions = [];
            _this.solved = false;
            _this.toolsSolved = [];
            _this.line = 0;
            _this._bigProblem = false;
            _this.problemType = problemType;
            _this.gfx = main_1._.cc(_this.gfxBrick = new PIXI.heaven.Sprite(PIXI.Texture.WHITE));
            var lines = problemType.text.split("\n");
            _this.textField = TextBox_1.TextBox.createTextField({}, { fontscale: 0.5, align: "left", text: lines[0] });
            _this.textField.x = 14 + _this.textField.width / 2;
            _this.textField.y = 12 + -14;
            _this.textField.tint = 0x111111;
            if (lines.length > 1) {
                _this.textField2 = TextBox_1.TextBox.createTextField({}, { fontscale: 0.5, align: "left", text: lines[1] });
                _this.textField2.x = 14 + _this.textField2.width / 2;
                _this.textField2.y = 12 + 10;
                _this.textField2.tint = 0x111111;
            }
            _this.gfx.addChild(_this.gfxBrick);
            if (problemType.complicated) {
                _this.gfxBrick.tint = 0xff601a;
            }
            if (problemType.type == 0) {
                _this.bigProblem = true;
            }
            _this.gfx.addChild(_this.textField);
            if (_this.textField2)
                _this.gfx.addChild(_this.textField2);
            _this.gfxBrick.height = CellHeight;
            _this.gfxBrick.width = 20;
            return _this;
        }
        Problem.prototype.solveAnimation = function () {
            Application_1.TweenMax.to(this.gfx, 1.4, { alpha: 0. });
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                Application_1.TweenMax.to(x.gfx, 1.4, { alpha: 0. });
            }
        };
        Problem.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            this.toolsSolved = null;
        };
        Problem.prototype.dropSolution = function (s) {
            if (this.solutions.indexOf(s.solution.type) >= 0) {
                return false;
            }
            if (this.problemType.solutions.indexOf(s.solution.type) >= 0) {
                this.solutions.push(s.solution.type);
                this.toolsSolved.push(s);
                s.gfx.alpha = 1;
                s.gfx.interactive = false;
                s.gfx.y = this.y + 6 + s.gfx.height / 4;
                s.gfx.width = 80;
                s.gfx.height = 80;
                this.alignTools();
                return true;
            }
            else {
                this.wrongSolutionAnim();
                return false;
            }
        };
        Object.defineProperty(Problem.prototype, "bigProblem", {
            get: function () {
                return this._bigProblem;
            },
            set: function (value) {
                this._bigProblem = value;
                if (value) {
                    this.bigProblemSprite = main_1._.cs("icon_problembar_chp", this.gfx);
                    this.bigProblemSprite.scale.set(0.5);
                    this.bigProblemSprite.y = 35;
                    this.bigProblemSprite.x = 50;
                    this.gfxBrick.tint = 0xff4633;
                    this.gfxBrick.color.lightRgba = 0xff4633;
                }
                else {
                    this.bigProblemSprite = O_1.O.rp(this.bigProblemSprite);
                }
            },
            enumerable: true,
            configurable: true
        });
        Problem.prototype.alignTools = function () {
            var w = main_1.SCR_WIDTH - this.gfx.x;
            var inx = this.toolsSolved.length - 1;
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                x.gfx.x = this.gfx.x + w - 80 * inx - x.gfx.width / 2;
                inx--;
            }
        };
        Problem.prototype.failanim = function () {
            Application_1.TweenMax.to(this.gfxBrick.color, 0.05, { lightG: 0, lightB: 0, yoyo: true, repeat: 4 });
            Application_1.TweenMax.to(this.gfx, 0.9, { alpha: 0. });
            for (var _i = 0, _a = this.toolsSolved; _i < _a.length; _i++) {
                var x = _a[_i];
                Application_1.TweenMax.to(x.gfx, 0.9, { alpha: 0. });
            }
        };
        Problem.prototype.wrongSolutionAnim = function () {
            Application_1.TweenMax.to(this, 0.05, { y: this.y - 2, yoyo: true, repeat: 5 });
            Application_1.TweenMax.to(this.gfx, 0.05, { alpha: 0.8, yoyo: true, repeat: 5 });
            //TweenMax.to(this.gfx.scale, 0.05, {x: 0.97, y: 0.97, yoyo: true, repeat: 5});
        };
        return Problem;
    }(O_1.O));
    exports.Problem = Problem;
});
