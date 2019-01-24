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
define(["require", "exports", "../Neu/BaseObjects/O", "../main", "../ProblemGenerator", "./ButtonTool", "../Neu/BaseObjects/TextBox", "../Neu/Math"], function (require, exports, O_1, main_1, ProblemGenerator_1, ButtonTool_1, TextBox_1, Math_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToolsBar = /** @class */ (function (_super) {
        __extends(ToolsBar, _super);
        function ToolsBar(pos, gfx) {
            var _this = _super.call(this, pos, gfx) || this;
            _this.tools = [];
            _this.gfx = main_1._.cc(main_1._.sm.gui);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[0]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[1]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[2]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[3]);
            _this.addTool(ProblemGenerator_1.SOLUTIONS[4]);
            return _this;
        }
        ToolsBar.prototype.dragMove = function (btn, e) {
            btn.gfx.tint = 0xffffff;
            if (btn.gfx.dragging) {
                var newPosition = e.data.getLocalPosition(btn.gfx.parent);
                btn.gfx.position.x = newPosition.x;
                btn.gfx.position.y = newPosition.y;
            }
        };
        ToolsBar.prototype.dragEnd = function (btn, e) {
            var pos = e.data.getLocalPosition(btn.gfx.parent);
            var res = main_1._.game.pg.tryDropSolution(btn, [pos.x, pos.y]);
            for (var _i = 0, _a = this.tools; _i < _a.length; _i++) {
                var t = _a[_i];
                t.tint = 0xffffff;
            }
            if (!res) {
                btn.killNow();
            }
            btn.gfx.dragging = false;
        };
        ToolsBar.prototype.dragStart = function (btn, e) {
            btn.gfx.dragging = true;
            var inx = this.tools.indexOf(btn);
            var b = this.createToolBtn(btn.solution, inx);
            b.fadeOnMouseDown = false;
            this.tools[inx] = b;
            btn.gfx.parent.setChildIndex(btn.gfx, btn.gfx.parent.children.length - 1);
            b.tint = 0x888888;
        };
        ToolsBar.prototype.createToolBtn = function (sol, inx) {
            var button = new ButtonTool_1.ButtonTool([60 + inx * 130, main_1.SCR_HEIGHT - 151], main_1._.cs(sol.ico, main_1._.sm.gui));
            button.gfx.scale.set(0.7);
            button.init({});
            button.solution = sol;
            button.fadeOnMouseDown = false;
            button.gfx.x = button.x;
            button.gfx.y = button.y;
            button.gfx.
                on('mousedown', this.dragStart.bind(this, button)).
                on('mousemove', this.dragMove.bind(this, button)).
                on('mouseupoutside', this.dragEnd.bind(this, button)).
                on('mouseup', this.dragEnd.bind(this, button)).
                on('touchstart', this.dragStart.bind(this, button)).
                on('touchmove', this.dragMove.bind(this, button)).
                on('touchendoutside', this.dragEnd.bind(this, button)).
                on('touchend', this.dragEnd.bind(this, button));
            var x = new TextBox_1.TextBox(Math_1.m.v2cp(button.pos));
            x.y += 87;
            x.init({ fontscale: 0.4, align: "center" });
            x.text = sol.text;
            return button;
        };
        ToolsBar.prototype.addTool = function (sol) {
            var b = this.createToolBtn(sol, this.tools.length);
            this.tools.push(b);
        };
        return ToolsBar;
    }(O_1.O));
    exports.ToolsBar = ToolsBar;
});
