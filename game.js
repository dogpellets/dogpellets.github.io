class Game {
    constructor(svgId, maxProgramSize, boardWidth, boardHeight) {
        this.program = new Array();
        this.bearStartX = 1;
        this.bearStartY = 1;
        this.bear = new Bear(1, 1, 100, 100);
        // this.fish = new Food(1, 1, 50, 50);
        this.fish = [
            new Food(1, 1, 50, 50),
            new Food(1, 1, 50, 50)
        ]
        this.trees = [
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree2.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree2.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
            new Tree(1, 1, 50, 50, "tree2.svg"),
            new Tree(1, 1, 50, 50, "tree1.svg"),
        ]
        this.board = new Board(document.getElementById(svgId), boardWidth, boardHeight);
        this.board.add(this.bear);
        this.board.add(this.fish[0]);
        this.board.add(this.fish[1]);
        this.trees.forEach((tree) => this.board.add(tree));
        this.maxProgramSize = maxProgramSize;
        this.score = 0;
        this.highScore = 0;

        this.clear();
        this.resetFood();
        this.resetAllTrees();

        this.instructions = {
            "left" : () => { 
                if (this.bear.x > 0) {
                    let newX = this.bear.x - 1;
                    if (!this.isPositionOccluded(newX, this.bear.y)) {
                        this.bear.x = newX;
                    }
                }
            },
            "right": () => {
                if (this.bear.x < this.board.countX-1) {
                    let newX = this.bear.x + 1;
                    if (!this.isPositionOccluded(newX, this.bear.y)) {
                        this.bear.x = newX;
                    }
                }
            },
            "up"   : () => {
                if (this.bear.y > 0) {
                    let newY = this.bear.y - 1;
                    if (!this.isPositionOccluded(this.bear.x, newY)) {
                        this.bear.y = newY;
                    }
                }
            },
            "down" : () => {
                if (this.bear.y < this.board.countY-1) {
                    let newY = this.bear.y + 1;
                    if (!this.isPositionOccluded(this.bear.x, newY)) {
                        this.bear.y = newY;
                    }
                }
            },
            "chop": () => {

            }
        }
    }

    addScore() {
        this.score++;
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        document.getElementById("score").innerText = this.score;
        document.getElementById("highScore").innerText = this.highScore;
    }

    resetScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.score = 0;
        document.getElementById("score").innerText = this.score;
        document.getElementById("highScore").innerText = this.highScore;
    }

    isPositionOccluded(x, y) {
        let occluded = false;
        this.trees.forEach((tree) => {
            if (tree.x == x && tree.y == y) {
                occluded = true;
                return;
            }
        });
        return occluded;
    }

    isPositionTaken(x, y) {
        let taken = false;
        this.board.entities.forEach((entity) => {
            if (entity.x == x && entity.y == y) {
                taken = true;
                return;
            }
        });
        return taken;
    }

    resetBear() {
        this.bear.x = this.bearStartX;
        this.bear.y = this.bearStartY;
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    resetFood() {
        this.fish.forEach((fish) => {
            let newX = 0, newY = 0;
            do {
                newX = this.getRandomInt(this.board.countX);
                newY = this.getRandomInt(this.board.countY);
            } while (this.isPositionTaken(newX, newY));
            fish.x = newX;
            fish.y = newY;
        });

    }

    resetAllTrees() {
        this.trees.forEach((tree) => {
            let newX = 0, newY = 0;
            do {
                newX = this.getRandomInt(this.board.countX);
                newY = this.getRandomInt(this.board.countY);
            } while (this.isPositionTaken(newX, newY));
            tree.x = newX;
            tree.y = newY;
        });
    }

    getInstructionElement(idx) {
        return document.getElementById(`instruction${idx}`);
    }

    clearActiveInstruction() {
        for (let idx = 0; idx < this.maxProgramSize; idx++) {
            let instruction = this.getInstructionElement(idx);
            instruction.classList.remove("instruction-program-active");
        }
    }

    setActiveInstruction(idx) {
        this.clearActiveInstruction();
        let instruction = this.getInstructionElement(idx);
        instruction.classList.add("instruction-program-active");
    }

    setInstructionLabel(idx, label) {
        let instruction = this.getInstructionElement(idx);
        instruction.innerText = label;
    }

    addInstruction(name, label) {
        if (this.program.length < this.maxProgramSize &&
            this.instructions.hasOwnProperty(name)) {
            this.program.push(this.instructions[name]);
            this.setInstructionLabel(this.program.length-1, label);
        }
    }

    resetProgram() {
        this.program = new Array();
        for (let idx = 0; idx < this.maxProgramSize; idx++) {
            this.setInstructionLabel(idx, "");
        }
    }

    clear() {
        this.resetBear();
        this.resetProgram();
        this.render();
    }

    run() {
        if (this.program.length <= 0) {
            return;
        }

        let idx = 0;
        let success = false;
        let runInstruction = () => {
            this.clearActiveInstruction();
            if (success) {
                this.bearStartX = this.bear.x;
                this.bearStartY = this.bear.y;
                this.resetProgram();
            }
            
            else if (idx >= this.program.length) {
                this.resetBear();
                this.resetScore();
            
            } else {
                this.program[idx]();
                this.setActiveInstruction(idx);

                if (this.bear.x == this.fish.x && this.bear.y == this.fish.y) {
                    success = true;
                    this.resetFood();
                    this.addScore();
                }

                idx++;
                setTimeout(runInstruction, 1000);
            }

            this.render();
        }

        runInstruction();
    }

    render() {
        this.board.draw();
    }
}