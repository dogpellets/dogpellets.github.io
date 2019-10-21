class Game {
    constructor(svgId, maxProgramSize, boardWidth, boardHeight) {
        this.svgId = svgId;
        this.boardWidth = boardWidth;
        this.boardHeight = boardHeight;
        this.program = new Array();
        this.bearStartX = 1;
        this.bearStartY = 1;
        this.bear = new Bear(1, 1, 100, 100);
        this.startFish = [
            new Food(1, 1, 50, 50),
            new Food(1, 1, 50, 50),
            new Food(1, 1, 50, 50),
        ]
        this.startTrees = [
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
        this.maxProgramSize = maxProgramSize;

        this.clearProgram();
        this.resetState();

        this.randomizeAllFish();
        this.randomizeTrees();

        this.startTrees = this.trees.map((tree) => tree.copy());
        this.startFish = this.fish.map((fish) => fish.copy());

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

    randomizeAllFish() {
        this.fish.forEach((fish) => {
            this.randomizeFish(fish);
        });
    }

    randomizeFish(fish) {
        let newX = 0, newY = 0;
        do {
            newX = this.getRandomInt(this.board.countX);
            newY = this.getRandomInt(this.board.countY);
        } while (this.isPositionTaken(newX, newY));
        fish.x = newX;
        fish.y = newY;
    }

    randomizeTrees() {
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

    resetState() {
        let svg = document.getElementById(this.svgId);
        this.trees = this.startTrees.map((tree) => tree.copy());
        this.fish = this.startFish.map((fish) => fish.copy());
        this.board = new Board(svg, this.boardWidth, this.boardHeight);
        this.board.add(this.bear);
        this.board.add(this.fish[0]);
        this.board.add(this.fish[1]);
        this.board.add(this.fish[2]);
        this.trees.forEach((tree) => this.board.add(tree));
        this.resetBear();
        this.render();
    }

    clearProgram() {
        this.resetProgram();
    }

    run() {
        if (this.program.length <= 0) {
            return;
        }

        let idx = 0;
        let runInstruction = () => {
            this.clearActiveInstruction();
           
            this.program[idx]();
            this.setActiveInstruction(idx);

            let touchedFish = null;
            this.fish.forEach((fish) => {
                if (this.bear.x == fish.x && this.bear.y == fish.y) {
                    touchedFish = fish;
                }   
            });

            if (touchedFish) {
                this.randomizeFish(touchedFish);
            }

            idx++;
            setTimeout(runInstruction, 1000);
            this.render();
        }

        runInstruction();
    }

    render() {
        this.board.draw();
    }
}