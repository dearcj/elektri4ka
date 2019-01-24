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
define(["require", "exports", "../Neu/BaseObjects/O", "../main"], function (require, exports, O_1, main_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScrollBox = /** @class */ (function (_super) {
        __extends(ScrollBox, _super);
        function ScrollBox(pos, gfx) {
            var _this = _super.call(this, pos, gfx) || this;
            _this.scrolling = false;
            _this._maskWidth = 100;
            _this._maskHeight = 100;
            _this.maxScroll = 1250;
            _this.gfx = main_1._.cc();
            _this.container = main_1._.cc();
            return _this;
        }
        Object.defineProperty(ScrollBox.prototype, "maskHeight", {
            get: function () {
                return this._maskHeight;
            },
            set: function (value) {
                this._maskHeight = value;
                this.updateMask();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScrollBox.prototype, "maskWidth", {
            get: function () {
                return this._maskWidth;
            },
            set: function (value) {
                this._maskWidth = value;
                this.updateMask();
            },
            enumerable: true,
            configurable: true
        });
        ScrollBox.prototype.process = function () {
            _super.prototype.process.call(this);
            if (this.scrolling) {
                this.scrollDown(-5);
            }
        };
        ScrollBox.prototype.init = function (p) {
            _super.prototype.init.call(this, p);
            if (this.layer) {
                this.layer.addChild(this.gfx);
            }
            this.x -= this.width / 2;
            this.y -= this.height / 2;
            this.mask = new PIXI.Graphics();
            this.masked = main_1._.cc();
            this.container.mask = this.mask;
            this.container.addChild(this.mask);
            this.container.addChild(this.masked);
            this.gfx.addChild(this.container);
            this.maskWidth = this.width;
            this.maskHeight = this.height;
            this.gfx.buttonMode = true;
            this.gfx.interactive = true;
            this.gfx.on('mousedown', this.scrollstart.bind(this)).
                on('touchstart', this.touchstart.bind(this)).
                on('mouseup', this.scrollend.bind(this)).
                on('mouseupoutside', this.scrollend.bind(this)).
                on('touchendoutside', this.scrollend.bind(this)).
                on('touchmove', this.touchmove.bind(this)).
                on('touchend', this.touchend.bind(this));
            this.bindedWheel = this.onWheel.bind(this);
            document.addEventListener("mousewheel", this.bindedWheel, false);
        };
        ScrollBox.prototype.onDestroy = function () {
            _super.prototype.onDestroy.call(this);
            document.removeEventListener("mousewheel", this.bindedWheel, false);
        };
        ScrollBox.prototype.onWheel = function (e) {
            this.scrollDown(e.wheelDeltaY / 2);
        };
        ScrollBox.prototype.touchstart = function (e) {
            this.starty = e.data.originalEvent.touches[0].clientY;
            this.prev = null;
            //this.scrolling = false;
        };
        ScrollBox.prototype.touchend = function () {
            //this.scrolling = false;
        };
        ScrollBox.prototype.touchmove = function (e) {
            var delta = (this.prev ? this.prev : this.starty) - e.data.originalEvent.changedTouches[0].clientY;
            this.scrollDown(-delta);
            this.prev = e.data.originalEvent.changedTouches[0].clientY;
        };
        ScrollBox.prototype.scrollend = function () {
            this.scrolling = false;
        };
        ScrollBox.prototype.scrollstart = function () {
            this.scrolling = true;
        };
        ScrollBox.prototype.scrollDown = function (delta) {
            this.masked.y += delta;
            if (this.masked.y > 0) {
                this.masked.y = 0;
            }
            if (this.masked.y < -this.maxScroll) {
                this.masked.y = -this.maxScroll;
            }
        };
        ScrollBox.prototype.updateMask = function () {
            this.mask.clear();
            this.mask.beginFill(0xff0000, 1);
            this.mask.drawRect(0, 0, this._maskWidth, this._maskHeight);
            this.mask.endFill();
        };
        return ScrollBox;
    }(O_1.O));
    exports.ScrollBox = ScrollBox;
});
