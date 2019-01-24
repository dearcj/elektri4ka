import {O} from "./Neu/BaseObjects/O";
import {_, SCR_HEIGHT, SCR_WIDTH} from "./main";
import {Problem} from "./Objects/Problem";
import {m, Vec2} from "./Neu/Math";
import {Linear, TweenMax} from "./Neu/Application";
import {LEVEL_TIME} from "./Stages/Game";
import {ButtonTool} from "./Objects/ButtonTool";
import {AngryBar} from "./Objects/AngryBar";

let COMPILCATED_COLOR = [0xff/ 255, 0x60 / 255, 0x1a / 255];

export type SolutionType = {
    type: number,
    text: string,
    ico: string,
}

export type ProblemType = {
    complicated: boolean,
    penalty: number,
    type: number,
    startAt: number,
    text: string,
    score: number,
    solutions: Array<number>,
}

export const SOLUTIONS: Array<SolutionType> = [{
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
        type: 5,
        text: `Альтерна-
тивное 
движение`,
        ico: "icon_5",
    }];

const PROBLEMS: ProblemType[] = [
    {
        penalty: 0.1,
        type: 0,
        text: ``,//ЧП
        startAt: 60,
        solutions: [1, 2, 3, 4, 5],
        complicated: false,
        score: 500,
    },
    {
        penalty: 0.1,
        type: 1,
        text: `Потеря
питания`,
        startAt: 10,
        solutions: [1],
        complicated: false,
        score: 100,
    },
    {
        penalty: 0.1,
        type: 2,
        text: `Потеря
питания`,
        startAt: 0,
        solutions: [1, 4],
        complicated: true,
        score: 200,
    },
    {
        penalty: 0.1,
        type: 3,
        startAt: 30,
        text: `Стоп-кран`,
        solutions: [4],
        complicated: false,
        score: 30,
    },
    {
        penalty: 0.1,
        type: 4,
        text: `Плохо
пассажиру`,
        startAt: 0,
        solutions: [3],
        complicated: false,
        score: 100,
    },
    {
        penalty: 0.1,
        type: 5,
        text: `Плохо
пассажиру`,
        startAt: 5,
        solutions: [3, 4],
        complicated: true,
        score: 50,
    },
    {
        penalty: 0.1,
        type: 6,
        text: `Сбили
лося`,
        startAt: 10,
        solutions: [1, 4],
        complicated: false,
        score: 50,
    },
    {
        penalty: 0.2,
        type: 7,
        text: `Сбили
лося`,
        startAt: 30,
        solutions: [1, 4, 5],
        complicated: true,
        score: 200,
    },
    {
        penalty: 0.1,
        type: 8,
        text: `Украли
сумку`,
        startAt: 0,
        solutions: [2],
        complicated: false,
        score: 100,
    },
    {
        penalty: 0.1,
        type: 9,
        text: `Украли
сумку`,
        startAt: 30,
        solutions: [2, 4],
        complicated: true,
        score: 200,
    },
    {
        penalty: 0.1,
        type: 10,
        text: `Вандализм`,
        startAt: 15,
        solutions: [1],
        complicated: false,
        score: 50,
    },
    {
        penalty: 0.15,
        type: 11,
        text: `Вандализм`,
        startAt: 60,
        solutions: [1, 4, 2],
        complicated: true,
        score: 200,
    },
    {
        penalty: 0.1,
        type: 12,
        text: `Дерево
на путях`,
        startAt: 0,
        solutions: [1],
        complicated: false,
        score: 50,
    },
    {
        penalty: 0.15,
        type: 13,
        text: `Дерево
на путях`,
        startAt: 30,
        solutions: [1, 4],
        complicated: true,
        score: 200,
    },
    {
        penalty: 0.1,
        type: 14,
        text: `Вандализм`,
        startAt: 0,
        solutions: [1],
        complicated: false,
        score: 100,
    },
];

export class ProblemGenerator extends O {
    private running: boolean;
    private problems: Problem[] = [];
    private difficulty: number;
    private lines: Problem[] = [null, null, null, null, null];
    private anim: gsap.Animation;
    private diffTween: gsap.Animation;
    private paused: boolean = false;

    wrongAnimation(g: any) {

    }

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
        if (this.paused) return;
        super.process();
        let speed = this.difficulty * 0.7;

        if (this.running) {
            for (let p of this.problems) {
                let th = SCR_WIDTH - 140;
                let spdres = speed;
                if (p.x > th && p.x < SCR_WIDTH) {
                    spdres = 5   * (p.x - th) / 140 + speed;
                }

                if (!p.solved && p.x < SCR_WIDTH)
                    p.gfxBrick.width += spdres;
                p.x -= spdres;

                let red = (SCR_WIDTH / 1.5 - p.x) / SCR_WIDTH;
                if (red<0) red = 0;

                if (p.solved)
                for (let s of p.toolsSolved) {
                    s.gfx.x -= spdres;
                } else {
                    if (!p.bigProblem) {
                        if (p.problemType.complicated) {
                            p.gfxBrick.color.lightR = (COMPILCATED_COLOR[0]);
                            p.gfxBrick.color.lightB = (COMPILCATED_COLOR[2] - red / 1.5);
                            p.gfxBrick.color.lightG = (COMPILCATED_COLOR[1] - red / 1.5);

                            if (p.gfxBrick.color.lightB < 0)
                                p.gfxBrick.color.lightB = 0;

                            if (p.gfxBrick.color.lightG < 0)
                                p.gfxBrick.color.lightG = 0
                        } else {
                            p.gfxBrick.color.lightB = (1 - red / 1.5);
                            p.gfxBrick.color.lightG = (1 - red / 1.5);
                        }
                    }
                }

                if (!p.solved && p.x < 0) {
                    _.sm.findByType(AngryBar)[0].value -= 1.2*p.problemType.penalty;

                    this.solveProblem(p, true)
                }
            }
        }
    }

    timeout(start: boolean = false) {
        this.anim = this.setTimeout(() => {
            let inx = 0;
            let free = [];
            let line = 0;
            for (let x of this.lines) {
                let isBusy = false;
                for (let c of this.problems) {
                    if (c.line == line) {
                        if (c.gfx.x + c.gfxBrick.width > SCR_WIDTH - 100) {
                            isBusy = true;
                            break;
                        }
                    }
                }

                if (!x && !isBusy) {
                    free.push(inx);
                }
                inx++;
            }

            if (free.length != 0) {
                let freeLine: number = <number>m.getRand(free);
                this.spawnProblemOnLine(freeLine);
            }

            this.timeout();
        }, start? 0 :
            1.7 + (0.8 + 0.2 *Math.random()) * (3.6 - Math.pow(this.difficulty, 1.28) ));
    }

    run() {
        this.running = true;
        this.difficulty = 1.45;
        this.diffTween = TweenMax.to(this, LEVEL_TIME, {difficulty: 2.7, ease: Linear.easeNone});


        this.timeout(true);
        /*this.spawnProblemOnLine(1);
        this.spawnProblemOnLine(2);
        this.spawnProblemOnLine(3);
        this.spawnProblemOnLine(4);*/
    }

    private spawnProblemOnLine(lineNum: number) {
        let availProblems= PROBLEMS.filter((p: ProblemType):boolean => {
            let res = ((
                (p.startAt / 100.) <= this.progress()) ||
                ((p.startAt / 200.) <= this.progress() && Math.random() < 0.5)) ;

            if (this.progress() > 0.5 && (p.startAt / 100.) < 0.4) return Math.random() < 0.25;

            return res;
        });
        let prob = m.getRand(availProblems);
        
        let problem = new Problem([_.SCR_WIDTH + 60, SCR_HEIGHT - lineNum * 100 - 335], null, prob);
        _.sm.main.addChild(problem.gfx);
        this.problems.push(problem);
        problem.line = lineNum;
        this.lines[lineNum] = problem;
    }

    private solveProblem(problem: Problem, failed: boolean = false) {
        problem.solved = true;
        if (!failed)
        problem.solveAnimation(); else problem.failanim();
        problem.gfxBrick.width = SCR_WIDTH - problem.gfx.x + 3;

        let inx = 0;
        for (let l of this.lines) {

            if (l == problem) {
                this.lines[inx] = null;
            }

            inx++;
        }
    }

    tryDropSolution(btn: ButtonTool, pos: Vec2): boolean {
        let res: number = -1;
        let inx = 0;
        for (let x of this.lines) {
            if (x) {
                let rect = x.gfx.getBounds(true);
                rect.pad(20, 20);
                if (rect.contains(pos[0]*_.appScale, pos[1]*_.appScale)) {
                    res = inx;
                    break;
                }
            }
            inx++;
        }

        if (res >= 0) {
            let cur = this.lines[res];
            let r = cur.dropSolution(btn);
            let completelySolved = true;
            for (let s of cur.problemType.solutions) {
                if (~cur.solutions.indexOf(s)) {

                } else {
                    completelySolved = false;
                }
            }

            if (completelySolved) {
                this.solveProblem(cur);
                _.game.score += cur.problemType.score;
            }


            return r;
        }

        return false;
    }

    private progress() {
        return _.game.progressAnim.progress();
    }

    pause(b: boolean) {
        this.paused = b;
    }
}