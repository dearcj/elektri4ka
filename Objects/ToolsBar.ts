import {O} from "../Neu/BaseObjects/O";
import {_, SCR_HEIGHT} from "../main";
import {Button} from "../Neu/BaseObjects/Button";
import {SOLUTIONS, SolutionType} from "../ProblemGenerator";
import {ButtonTool} from "./ButtonTool";
import {TextBox} from "../Neu/BaseObjects/TextBox";
import {m} from "../Neu/Math";

export class ToolsBar extends O {
    public tools: ButtonTool[] = [];

    constructor(pos, gfx) {
        super(pos, gfx);

        this.gfx = _.cc(_.sm.gui);
        this.addTool(SOLUTIONS[0]);
        this.addTool(SOLUTIONS[1]);
        this.addTool(SOLUTIONS[2]);
        this.addTool(SOLUTIONS[3]);
        this.addTool(SOLUTIONS[4]);
    }

    dragMove(btn: ButtonTool, e: any) {
        if (btn.gfx.dragging)
        {
            let newPosition = e.data.getLocalPosition(btn.gfx.parent);
            btn.gfx.position.x = newPosition.x;
            btn.gfx.position.y = newPosition.y;
        }
    }

    dragEnd(btn: ButtonTool, e: any) {
        let pos = e.data.getLocalPosition(btn.gfx.parent);
        let res = _.game.pg.tryDropSolution(btn, [pos.x, pos.y]);

        if (!res) {
            btn.killNow();
        }
        btn.gfx.dragging  = false;

    }


    dragStart(btn: ButtonTool, e: any) {
        btn.gfx.dragging  = true;
        let inx = this.tools.indexOf(btn);
        let b =  this.createToolBtn(btn.solution, inx);

        this.tools[inx] = b;

        btn.gfx.parent.setChildIndex(btn.gfx, btn.gfx.parent.children.length - 1);

        setTimeout(()=>{
            btn.gfx.tint = 0xffffff;
        }, 0);
        btn.gfx.tint = 0xffffff;
    }

    public createToolBtn(sol: SolutionType, inx: number):ButtonTool {
        let button = new ButtonTool([60 + inx * 130, SCR_HEIGHT - 170], _.cs(sol.ico, _.sm.gui));
        button.gfx.scale.set(0.7);
        button.init({});
        button.solution = sol;

        button.gfx.x = button.x;
        button.gfx.y = button.y;
        button.gfx.
        on('mousedown', this.dragStart.bind(this, button)).
        on('mousemove', this.dragMove.bind(this, button)).
        on('mouseup', this.dragEnd.bind(this, button)).
        on('touchstart', this.dragStart.bind(this, button)).
        on('touchmove', this.dragMove.bind(this, button)).
        on('touchend', this.dragEnd.bind(this, button));

        let x = new TextBox(m.v2cp(button.pos));
        x.y += 100;
        x.init({fontscale: 0.4, align: "center"});
        x.text = sol.text;
        return button;
    }

    private addTool(sol: SolutionType) {
        let b=  this.createToolBtn(sol, this.tools.length);
        this.tools.push(b);
    }
}