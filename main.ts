import './node_modules/pixi-heaven/dist/pixi-heaven.js';
import {Application} from "./Neu/Application";
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
} from "./ClientSettings";
import {TextBox} from "./Neu/BaseObjects/TextBox";
import {BaseLighting} from "./Neu/BaseObjects/BaseLighting";
import {LevelNames} from "./ObjectsList";
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

        console.log("Device pixel ratio: ", window.devicePixelRatio);
        let baseW = MAX_SCR_WIDTH;//MAX_SCR_WIDTH;
        let baseH = MAX_SCR_HEIGHT;//MAX_SCR_HEIGHT;

        this.setScreenRes(baseW, baseH);
        super.start();
    };

    loadComplete(): void {
        this.isInitialLoading = false;
        this.loadTime = (new Date()).getTime() - (<any>window).startTime.getTime();

        this.clearPreloader();

        const interaction = this.app.renderer.plugins.interaction;
        document.addEventListener('mousedown', (e) => {
            if (this.globalMouseDown) this.globalMouseDown(e)
        });

            _.sm.openStage(_.game);
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
