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
define(["require", "exports", "../Neu/BaseObjects/O", "main"], function (require, exports, O_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AngryBar = /** @class */ (function (_super) {
        __extends(AngryBar, _super);
        function AngryBar(pos, gfx) {
            if (pos === void 0) { pos = null; }
            if (gfx === void 0) { gfx = null; }
            var _this = _super.call(this, pos, null) || this;
            _this._value = 0;
            _this.smiles = [];
            _this.gfx = main_1._.cc(main_1._.sm.gui);
            _this.value = 1;
            _this.smiles.push(main_1._.cs("smile_4_1", _this.gfx));
            _this.smiles.push(main_1._.cs("smile_3_1", _this.gfx));
            _this.smiles.push(main_1._.cs("smile_2_1", _this.gfx));
            _this.smiles.push(main_1._.cs("smile_1_1", _this.gfx));
            var inx = 0;
            for (var _i = 0, _a = _this.smiles; _i < _a.length; _i++) {
                var x = _a[_i];
                x.scale.set(0.6);
                x.x = inx * 80;
                inx++;
            }
            return _this;
        }
        Object.defineProperty(AngryBar.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._value = value;
                this.update();
                if (this._value < 0) {
                    main_1._.game.ShowResModal();
                }
            },
            enumerable: true,
            configurable: true
        });
        AngryBar.prototype.init = function (p) {
            if (this.layer) {
                O_1.O.rp(this.gfx);
                this.layer.addChild(this.gfx);
            }
            if (p.value) {
                this.value = parseFloat(p.value);
            }
        };
        AngryBar.prototype.update = function () {
            var delta = 1 / (this.smiles.length + 1);
            for (var i = 0; i < this.smiles.length; i++) {
                var x = this.smiles[i];
                if (this.value > (i + 1) * delta && this.value <= (i + 2) * delta) {
                    x.alpha = 1;
                }
                else {
                    if ((this.value > (i) * delta && this.value <= (i + 1) * delta) ||
                        (this.value > (i + 2) * delta && this.value <= (i + 3) * delta)) {
                        x.alpha = 0.5;
                    }
                    else {
                        x.alpha = 0.3;
                    }
                }
            }
            if (this.smiles.length > 0 && this.value < delta) {
                this.smiles[0].alpha = 1;
            }
        };
        return AngryBar;
    }(O_1.O));
    exports.AngryBar = AngryBar;
});
