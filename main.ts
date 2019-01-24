import './lib/pixi-heaven.js';
import {Application, PIXI, TweenLite, TweenMax} from "./Neu/Application";
import {Sound} from "./Neu/Sound";
import {Menu} from "./Stages/Menu";
import {Game} from "./Stages/Game";
import {LoadQueue, m, Vec2} from "./Neu/Math";
import {Engine, Runner} from "./lib/matter";
import {ResourceManager} from "./Neu/ResourceManager";
import {
    CAMERA_DEBUG,
    MAX_SCR_HEIGHT,
    MAX_SCR_WIDTH,
} from "./ClientSettings";//asd
import {TextBox} from "./Neu/BaseObjects/TextBox";
import {BaseLighting} from "./Neu/BaseObjects/BaseLighting";
import {LevelNames} from "./ObjectsList";
import {Rules} from "./Stages/Rules";
import {Scores} from "./Stages/Scores";
import {BlackTransition} from "./Neu/Transitions/BlackTransition";
import {Controls} from "./Neu/Controls";
import {SM} from "./Neu/SM";
import {Loader} from "./Neu/Loader";
import {DEFAULT_ECDH_CURVE} from "tls";
export let $: any = (<any>window).$;
export type PIXIContainer = any;

export let SCR_WIDTH = MAX_SCR_WIDTH;
export let SCR_HEIGHT = MAX_SCR_HEIGHT;

const GLOBAL_MUSIC_ASSETS = [];

const GLOBAL_SOUND_ASSETS = [
];//

TextBox.DEFAULT_FONT = "main-export";

const GLOBAL_ASSETS = [
    ///////////////////////////////////////////
    // Atlases
    ///////////////////////////////////////////

    'art/atlas.json',

    ///////////////////////////////////////////
    // Fonts
    ///////////////////////////////////////////
    'fonts/main-export.xml',
];

export let PIXIUI = (<any>PIXI).UI;

export class Main extends Application {
    [x: string]: any;


    public menu: Menu = new Menu();
    public game: Game = new Game();
    public rules: Rules = new Rules();
    public scores: Scores = new Scores();


    private loadTime: number;
    private preloadBar: PIXI.Graphics;
    public __DIR: string;
    public cursor: PIXI.Sprite;
    assets: Array<string>;
    assetsLoaded: number = 0;
    private loadingCounter: number = 0;

    constructor(msw: number, msh: number) {
        super(msw, msh);
        this.__DIR = location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
    }

    static GET(url: string, cb: Function) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                cb(xmlHttp.responseText);
            }
        };
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.send(null);
    }


    start() {
        this.addStats = false;

        this.SCR_WIDTH = SCR_WIDTH;
        this.SCR_HEIGHT = SCR_HEIGHT;
        console.log("Device pixel ratio: ", window.devicePixelRatio);
        let resize = () => {

            let myratio = this.SCR_WIDTH / this.SCR_HEIGHT;
            let screenratio = window.innerWidth / window.innerHeight;

            if (myratio > screenratio) {
                this.appScale = ((window.innerWidth) / this.SCR_WIDTH) ;
                let nn = window.innerWidth * myratio;
            } else {
                this.appScale = ((window.innerHeight) / this.SCR_HEIGHT) ;
                let nn = window.innerHeight * myratio;

            }
            this.app.renderer.resize(this.SCR_WIDTH * this.appScale, this.SCR_HEIGHT * this.appScale);


            //            let delta = (window.innerWidth - neww) / 2;
 //           if (delta < 0) delta = 0;
            this.screenCenterOffset = [0, 0];//[delta * this.appScale,0];

            this.app.stage.scale.set(this.appScale, this.appScale);

        };
        window.addEventListener('resize', resize);


        setTimeout(()=>{
            resize();
        }, 200);
        setTimeout(()=>{
            resize();
        }, 0);

        this.SCR_WIDTH_HALF = this.SCR_WIDTH * .5;
        this.SCR_HEIGHT_HALF = this.SCR_HEIGHT * .5;

        this.engine = Engine.create();
        //TweenMax.lagSmoothing(0);
        TweenLite.ticker.useRAF(true);

        document.addEventListener('contextmenu', (event) => {
            if (this.onContext) this.onContext();
            event.preventDefault()
        });

        this.controls = new Controls();
        this.PIXI = PIXI;

        this.resolution = window.devicePixelRatio;
        this.app = new PIXI.Application(this.SCR_WIDTH, this.SCR_HEIGHT, {
            autoStart: false,
            clearBeforeRender: true,
            resolution: 1, antialias: false,
            preserveDrawingBuffer: false, forceFXAA: false, backgroundColor: 0xffffff,
        });

        document.body.appendChild(this.app.view);
        this.app.stage = new PIXI.display.Stage();
        this.sm = new SM();
        this.sm.init();
        this.lm = new Loader();
        this.sm.createCamera();
        this.lastLoop = (new Date()).getTime();
        this.lastNetworkPing = this.lastLoop;

        let bindedProcess = this.process.bind(this);
        TweenMax.ticker.addEventListener("tick", bindedProcess);

        this.app.ticker.add(this.animate, this, PIXI.UPDATE_PRIORITY.HIGH);
        this.app.ticker.start();


        resize();
    };

    loadComplete(): void {
        this.isInitialLoading = false;
        this.loadTime = (new Date()).getTime() - (<any>window).startTime.getTime();

        this.clearPreloader();
        PIXI.BitmapText.fonts[TextBox.DEFAULT_FONT].lineHeight *= 0.7;

        const interaction = this.app.renderer.plugins.interaction;
        document.addEventListener('mousedown', (e) => {
            if (this.globalMouseDown) this.globalMouseDown(e)
        });

        _.sm.openStage(_.menu);
    }

    initPreloader() {
        this.preloadBar = new PIXI.Graphics();
        this.app.stage.addChild(this.preloadBar);

        const borderWidth = 3;
        this.preloadBar.beginFill(0x100110);
        this.preloadBar.moveTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1 - borderWidth, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.495 - borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.9 + borderWidth, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.495 - borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.9 + borderWidth, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.505 + borderWidth);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1 - borderWidth, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.505 + borderWidth);
        this.preloadBar.endFill();
    }

    drawPreloaderProgress(progressPercent: number): void {
        this.preloadBar.beginFill(0x350929);
        const progress = progressPercent / 100;
        this.preloadBar.moveTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.495);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1 + MAX_SCR_WIDTH * 0.8 * progress, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.495);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1 + MAX_SCR_WIDTH * 0.8 * progress, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.505);
        this.preloadBar.lineTo(_.screenCenterOffset[0] + MAX_SCR_WIDTH * 0.1, _.screenCenterOffset[1] + MAX_SCR_HEIGHT * 0.505);
        this.preloadBar.endFill();
    }

    clearPreloader() {
        this.app.stage.removeChild(this.preloadBar);
    }

    load(): void {
        this.loadingCounter = 0;
        this.initPreloader();
        this.engine = Engine.create();
        let runner = Runner.create({});

        BaseLighting.DEFAULT_GFX = "Camera-Shadow.png";
        Runner.run(runner, this.engine);

        let loadQueue = new LoadQueue(() => {
            this.drawPreloaderProgress(100);
            this.loadComplete()
        });

        this.rm = new ResourceManager("animations/");

        this.rm.loadAssets(GLOBAL_ASSETS.concat(LevelNames), (loader: any, evt: any) => {
            this.drawPreloaderProgress(loader.progress);
            this.assetsLoaded++;
        }, loadQueue.onLoad().bind(loadQueue));

        this.sound = new Sound();
        this.sound.load(GLOBAL_MUSIC_ASSETS, GLOBAL_SOUND_ASSETS, loadQueue.onLoad());

        document.addEventListener("keydown", (e) => {
            let keyCode = e.keyCode;
            switch (keyCode) {
                case 68: //d
                    _.sm.camera.x += 22.5;
                    break;
                case 83: //s
                    _.sm.camera.y += 22.5;
                    break;
                case 65: //a
                    _.sm.camera.x -= 22.5;
                    break;
                case 87: //w
                    _.sm.camera.y -= 22.5;
                    break;
                case 88: //x
                    _.sm.camera.zoom -= 0.02;
                    break;
                case 90: //z
                    _.sm.camera.zoom += 0.02;
                    break;
            }
        });

    }

}

export var _: Main = new Main(MAX_SCR_WIDTH, MAX_SCR_HEIGHT);

_.start();
_.load();
