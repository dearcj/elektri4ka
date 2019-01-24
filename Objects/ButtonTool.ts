import {Button} from "../Neu/BaseObjects/Button";
import {SolutionType} from "../ProblemGenerator";

export class ButtonTool extends Button {
    public solution: SolutionType;
    tint: number = 0xffffff;

    process() {
        this.gfx.tint = this.tint;
    }
}