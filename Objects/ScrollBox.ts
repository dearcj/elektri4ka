import {O} from "../Neu/BaseObjects/O";
import {_} from "../main";

export class ScrollBox extends O {
    private scrolling: boolean = false;
    private bindedWheel: any;
    public  masked: PIXI.Container;
    private starty: number;
    private prev: number;
    get maskHeight(): number {
        return this._maskHeight;
    }

    set maskHeight(value: number) {
        this._maskHeight = value;
        this.updateMask();
    }
    get maskWidth(): number {
        return this._maskWidth;
    }

    set maskWidth(value: number) {
        this._maskWidth = value;
        this.updateMask();
    }

    private _maskWidth: number = 100;
    private _maskHeight: number = 100;
    container: PIXI.Container;
    private mask: PIXI.Graphics;
    public maxScroll: number = 1500;

process() {
    super.process();
    if (this.scrolling) {
        this.scrollDown(-5);
    }
}

    constructor (pos, gfx) {
        super(pos, gfx);
        this.gfx = _.cc();
        this.container = _.cc();
    }

    init(p: any) {
        super.init(p);

        if (this.layer) {
            this.layer.addChild(this.gfx);
        }
        this.x -= this.width / 2;
        this.y -= this.height / 2;
        this.mask = new PIXI.Graphics();

        this.masked = _.cc();
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

    }

    onDestroy() {
        super.onDestroy();
        document.removeEventListener("mousewheel", this.bindedWheel, false);
    }

    onWheel(e) {
        this.scrollDown(e.wheelDeltaY / 2);
    }

    touchstart(e) {
        this.starty = e.data.originalEvent.touches[0].clientY;
        this.prev = null;
        //this.scrolling = false;
    }

    touchend() {
        //this.scrolling = false;
    }

    touchmove(e) {
        let delta = (this.prev ? this.prev : this.starty) - e.data.originalEvent.changedTouches[0].clientY;

        this.scrollDown(-delta);

        this.prev = e.data.originalEvent.changedTouches[0].clientY;
    }



    scrollend() {
        this.scrolling = false;
    }
    scrollstart() {
        this.scrolling = true;
    }
    scrollDown(delta: number) {
        this.masked.y += delta;
        if (this.masked.y > 0) {
            this.masked.y = 0;
        }

        if (this.masked.y < -this.maxScroll) {
            this.masked.y = -this.maxScroll;
        }
    }

    private updateMask() {
        this.mask.clear();
        this.mask.beginFill(0xff0000, 1);
        this.mask.drawRect(0, 0, this._maskWidth, this._maskHeight);
        this.mask.endFill();
    }
}