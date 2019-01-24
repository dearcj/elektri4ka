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
define(["require", "exports", "../Neu/BaseObjects/Button"], function (require, exports, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ButtonTool = /** @class */ (function (_super) {
        __extends(ButtonTool, _super);
        function ButtonTool() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tint = 0xffffff;
            return _this;
        }
        ButtonTool.prototype.process = function () {
            this.gfx.tint = this.tint;
        };
        return ButtonTool;
    }(Button_1.Button));
    exports.ButtonTool = ButtonTool;
});
