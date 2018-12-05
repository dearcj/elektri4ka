import {O} from "./Neu/BaseObjects/O";
import {_, SCR_HEIGHT} from "./main";
import {Problem} from "./Objects/Problem";
import {m} from "./Neu/Math";
import {TweenMax} from "./Neu/Application";

export type SolutionType = {
    type: number,
    text: string,
    ico: string,
}

export type ProblemType = {
    type: number,
    text: string,
    solution: number[],
}

export const SOLUTIONS:Array<SolutionType> = [{
 type: 1,
 text: `Вызвать
ремонтни-
ков`,
    ico: "icon_1",
},
    {
        type: 2,
        text: `Вызов
полиции`,
        ico: "icon_2",
    },
    {
        type: 3,
        text: `Вызов
медиков`,
        ico: "icon_3",
    },
    {
        type: 4,
        text: `Информи-
ровать
пассажиров`,
        ico: "icon_4",
    },
    {
        type: 4,
        text: `Альтернатив-
ное 
движение`,
        ico: "icon_5",
    }];

const PROBLEMS: ProblemType[] = [
    {
        type: 1,
        text: `Плохо
пассажиру`,
        solutions: [0],
    },
];

export class ProblemGenerator extends O {
    private running: boolean;
    private problems: Problem[] = [];
    private difficulty: number;
    private lines: Problem[] = [null, null, null, null, null];
    private anim: gsap.Animation;
    private diffTween: gsap.Animation;

    clear() {
        _.sm.removeList(this.problems);
        _.killTweens(this.anim);
        this.problems = [];
    }

    stop() {
        this.clear();
        _.killTweens(this.anim, this.diffTween);
        this.difficulty = 1;
        this.running = false;
    }

    process() {
        super.process();
        let speed = this.difficulty / 2;

        if (this.running) {
            for (let p of this.problems) {
                if (!p.solved)
                p.gfxBrick.width += speed;
                p.x -= speed;
            }
        }
    }

    timeout() {
        this.anim = this.setTimeout(()=>{
            let inx = 0;
            let free = [];
            for (let x of this.lines) {
                if (!x) {
                    free.push(inx);
                }
                inx++;
            }

            if (free.length != 0) {
                let freeLine: number = <number>m.getRand(free);
                this.spawnProblemOnLine(freeLine);
            }

            this.timeout();
        }, 1.5 + Math.random()*(5 - this.difficulty));
    }

    run() {
        this.running = true;
        this.difficulty = 0.6;
        this.diffTween = TweenMax.to(this, 100, {difficulty: 2.5});

        this.timeout();
    }

    private spawnProblemOnLine(lineNum: number) {
        let problem = new Problem([_.SCR_WIDTH, SCR_HEIGHT - lineNum * 100 - 300], null, m.getRand(PROBLEMS));
        _.sm.main.addChild(problem.gfx);
        this.problems.push(problem);

        problem.wait(5).call(()=>{
            this.solveProblem(problem)
        }).apply();

        this.lines[lineNum] = problem;
    }

    private solveProblem(problem: Problem) {
        problem.solved = true;

        let inx = 0;
        for (let l of this.lines) {

            if (l == problem) {
               this.lines[inx] = null;
            }

            inx++;
        }
    }
}