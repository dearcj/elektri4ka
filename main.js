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
define(["require", "exports", "./Neu/Application", "./Neu/Sound", "./Stages/Menu", "./Stages/Game", "./Neu/Math", "./lib/matter", "./Neu/ResourceManager", "./ClientSettings", "./Neu/BaseObjects/TextBox", "./Neu/BaseObjects/BaseLighting", "./ObjectsList", "./Stages/Rules", "./Stages/Scores", "./Neu/Controls", "./Neu/SM", "./Neu/Loader", "./node_modules/pixi-heaven/dist/pixi-heaven.js"], function (require, exports, Application_1, Sound_1, Menu_1, Game_1, Math_1, matter_1, ResourceManager_1, ClientSettings_1, TextBox_1, BaseLighting_1, ObjectsList_1, Rules_1, Scores_1, Controls_1, SM_1, Loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ = window.$;
    exports.SCR_WIDTH = ClientSettings_1.MAX_SCR_WIDTH;
    exports.SCR_HEIGHT = ClientSettings_1.MAX_SCR_HEIGHT;
    var GLOBAL_MUSIC_ASSETS = [];
    var GLOBAL_SOUND_ASSETS = []; //
    TextBox_1.TextBox.DEFAULT_FONT = "main-export";
    var GLOBAL_ASSETS = [
        ///////////////////////////////////////////
        // Atlases
        ///////////////////////////////////////////
        'art/atlas.json',
        ///////////////////////////////////////////
        // Fonts
        ///////////////////////////////////////////
        'fonts/main-export.xml',
    ];
    exports.PIXIUI = Application_1.PIXI.UI;
    var Main = /** @class */ (function (_super) {
        __extends(Main, _super);
        function Main(msw, msh) {
            var _this = _super.call(this, msw, msh) || this;
            _this.menu = new Menu_1.Menu();
            _this.game = new Game_1.Game();
            _this.rules = new Rules_1.Rules();
            _this.scores = new Scores_1.Scores();
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
            var _this = this;
            this.addStats = false;
            this.SCR_WIDTH = exports.SCR_WIDTH;
            this.SCR_HEIGHT = exports.SCR_HEIGHT;
            console.log("Device pixel ratio: ", window.devicePixelRatio);
            var resize = function () {
                _this.appScale = ((window.innerHeight) / _this.SCR_HEIGHT) / window.devicePixelRatio;
                var neww = window.innerHeight * (_this.SCR_WIDTH / _this.SCR_HEIGHT);
                _this.app.renderer.resize(Math.min(window.innerWidth, neww) / window.devicePixelRatio, window.innerHeight / window.devicePixelRatio);
                _this.app.stage.scale.set(_this.appScale, _this.appScale);
            };
            window.addEventListener('resize', resize);
            setTimeout(function () {
                resize();
            }, 200);
            setTimeout(function () {
                resize();
            }, 0);
            this.screenCenterOffset = [0, 0];
            this.SCR_WIDTH_HALF = this.SCR_WIDTH * .5;
            this.SCR_HEIGHT_HALF = this.SCR_HEIGHT * .5;
            this.engine = matter_1.Engine.create();
            //TweenMax.lagSmoothing(0);
            Application_1.TweenLite.ticker.useRAF(true);
            document.addEventListener('contextmenu', function (event) {
                if (_this.onContext)
                    _this.onContext();
                event.preventDefault();
            });
            this.controls = new Controls_1.Controls();
            this.PIXI = Application_1.PIXI;
            this.resolution = window.devicePixelRatio;
            this.app = new Application_1.PIXI.Application(this.SCR_WIDTH, this.SCR_HEIGHT, {
                autoStart: false,
                clearBeforeRender: true,
                resolution: this.resolution, antialias: false,
                preserveDrawingBuffer: false, forceFXAA: true, backgroundColor: 0xffffff,
            });
            document.body.appendChild(this.app.view);
            this.app.stage = new Application_1.PIXI.display.Stage();
            this.sm = new SM_1.SM();
            this.sm.init();
            this.lm = new Loader_1.Loader();
            this.sm.createCamera();
            this.lastLoop = (new Date()).getTime();
            this.lastNetworkPing = this.lastLoop;
            var bindedProcess = this.process.bind(this);
            Application_1.TweenMax.ticker.addEventListener("tick", bindedProcess);
            this.app.ticker.add(this.animate, this, Application_1.PIXI.UPDATE_PRIORITY.HIGH);
            this.app.ticker.start();
            resize();
            //(<BlackTransition>_.sm.transition).color = 0xffffff;
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
            exports._.sm.openStage(exports._.menu);
        };
        Main.prototype.initPreloader = function () {
            this.preloadBar = new Application_1.PIXI.Graphics();
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
            BaseLighting_1.BaseLighting.DEFAULT_GFX = "Camera-Shadow.png";
            matter_1.Runner.run(runner, this.engine);
            var loadQueue = new Math_1.LoadQueue(function () {
                _this.drawPreloaderProgress(100);
                _this.loadComplete();
            });
            this.rm = new ResourceManager_1.ResourceManager("animations/");
            this.rm.loadAssets(GLOBAL_ASSETS.concat(ObjectsList_1.LevelNames), function (loader, evt) {
                _this.drawPreloaderProgress(loader.progress);
                _this.assetsLoaded++;
            }, loadQueue.onLoad().bind(loadQueue));
            this.sound = new Sound_1.Sound();
            this.sound.load(GLOBAL_MUSIC_ASSETS, GLOBAL_SOUND_ASSETS, loadQueue.onLoad());
            document.addEventListener("keydown", function (e) {
                var keyCode = e.keyCode;
                switch (keyCode) {
                    case 68: //d
                        exports._.sm.camera.x += 22.5;
                        break;
                    case 83: //s
                        exports._.sm.camera.y += 22.5;
                        break;
                    case 65: //a
                        exports._.sm.camera.x -= 22.5;
                        break;
                    case 87: //w
                        exports._.sm.camera.y -= 22.5;
                        break;
                    case 88: //x
                        exports._.sm.camera.zoom -= 0.02;
                        break;
                    case 90: //z
                        exports._.sm.camera.zoom += 0.02;
                        break;
                }
            });
        };
        return Main;
    }(Application_1.Application));
    exports.Main = Main;
    exports._ = new Main(ClientSettings_1.MAX_SCR_WIDTH, ClientSettings_1.MAX_SCR_HEIGHT);
    exports._.start();
    exports._.load();
});
