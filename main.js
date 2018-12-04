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
define(["require", "exports", "./Neu/Application", "./Neu/Sound", "./Stages/Menu", "./Stages/Game", "./Neu/Math", "./lib/matter", "./Neu/ResourceManager", "./ClientSettings", "./Neu/BaseObjects/TextBox", "./Neu/BaseObjects/BaseLighting", "./node_modules/pixi-heaven/dist/pixi-heaven.js"], function (require, exports, Application_1, Sound_1, Menu_1, Game_1, Math_1, matter_1, ResourceManager_1, ClientSettings_1, TextBox_1, BaseLighting_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ = window.$;
    exports.SCR_WIDTH = ClientSettings_1.MAX_SCR_WIDTH;
    exports.SCR_HEIGHT = ClientSettings_1.MAX_SCR_HEIGHT;
    var GLOBAL_MUSIC_ASSETS = [];
    var GLOBAL_SOUND_ASSETS = []; //
    var GLOBAL_ASSETS = [
        ///////////////////////////////////////////
        // Atlases
        ///////////////////////////////////////////
        'atlas/atlas.json',
        ///////////////////////////////////////////
        // Fonts
        ///////////////////////////////////////////
        'fonts/main-export.xml',
        'fonts/font2-export.xml',
    ];
    exports.PIXIUI = PIXI.UI;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main(msw, msh) {
            var _this = _super.call(this, msw, msh) || this;
            _this.menu = new Menu_1.Menu();
            _this.game = new Game_1.Game();
            _this.assetsLoaded = 0;
            _this.loadingCounter = 0;
            _this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
            return _this;
        }
        Main.GET = function (url, cb) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    cb(xmlHttp.responseText);
                }
            };
            xmlHttp.open("GET", url, true); // true for asynchronous
            xmlHttp.send(null);
        };
        Main.prototype.start = function () {
            this.addStats = false;
            console.log("Device pixel ratio: ", window.devicePixelRatio);
            var baseW = ClientSettings_1.MAX_SCR_WIDTH; //MAX_SCR_WIDTH;
            var baseH = ClientSettings_1.MAX_SCR_HEIGHT; //MAX_SCR_HEIGHT;
            this.setScreenRes(baseW, baseH);
            _super.prototype.start.call(this);
        };
        ;
        Main.prototype.loadComplete = function () {
            var _this = this;
            this.isInitialLoading = false;
            this.loadTime = (new Date()).getTime() - window.startTime.getTime();
            this.clearPreloader();
            var interaction = this.app.renderer.plugins.interaction;
            document.addEventListener('mousedown', function (e) {
                if (_this.globalMouseDown)
                    _this.globalMouseDown(e);
            });
            exports._.sm.openStage(exports._.game);
        };
        Main.prototype.initPreloader = function () {
            this.preloadBar = new PIXI.Graphics();
            this.app.stage.addChild(this.preloadBar);
            var borderWidth = 3;
            this.preloadBar.beginFill(0x100110);
            this.preloadBar.moveTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1 - borderWidth, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.495 - borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.9 + borderWidth, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.495 - borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.9 + borderWidth, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.505 + borderWidth);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1 - borderWidth, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.505 + borderWidth);
            this.preloadBar.endFill();
        };
        Main.prototype.drawPreloaderProgress = function (progressPercent) {
            this.preloadBar.beginFill(0x350929);
            var progress = progressPercent / 100;
            this.preloadBar.moveTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.495);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1 + ClientSettings_1.MAX_SCR_WIDTH * 0.8 * progress, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.495);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1 + ClientSettings_1.MAX_SCR_WIDTH * 0.8 * progress, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.505);
            this.preloadBar.lineTo(exports._.screenCenterOffset[0] + ClientSettings_1.MAX_SCR_WIDTH * 0.1, exports._.screenCenterOffset[1] + ClientSettings_1.MAX_SCR_HEIGHT * 0.505);
            this.preloadBar.endFill();
        };
        Main.prototype.clearPreloader = function () {
            this.app.stage.removeChild(this.preloadBar);
        };
        Main.prototype.load = function () {
            var _this = this;
            this.loadingCounter = 0;
            this.initPreloader();
            this.engine = matter_1.Engine.create();
            var runner = matter_1.Runner.create({});
            TextBox_1.TextBox.DEFAULT_FONT = "smallfontp";
            BaseLighting_1.BaseLighting.DEFAULT_GFX = "Camera-Shadow.png";
            matter_1.Runner.run(runner, this.engine);
            var loadQueue = new Math_1.LoadQueue(function () {
                _this.drawPreloaderProgress(100);
                _this.loadComplete();
            });
            this.rm = new ResourceManager_1.ResourceManager("animations/");
            this.rm.loadAssets(GLOBAL_ASSETS, function (loader, evt) {
                _this.drawPreloaderProgress(loader.progress);
                _this.assetsLoaded++;
            }, loadQueue.onLoad().bind(loadQueue));
            this.sound = new Sound_1.Sound();
            this.sound.load(GLOBAL_MUSIC_ASSETS, GLOBAL_SOUND_ASSETS, loadQueue.onLoad());
        };
        return Main;
    }(Application_1.Application));
    exports.Main = Main;
    exports._ = new Main(ClientSettings_1.MAX_SCR_WIDTH, ClientSettings_1.MAX_SCR_HEIGHT);
    exports._.start();
    exports._.load();
});
