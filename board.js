class Board {
    constructor(svg, width, height) {
        this.svg = svg;
        this.countX = width;
        this.countY = height;
        this.entities = new Array();
    }

    add(entity) {
        this.entities.push(entity);
    }

    getCellWidth() {
        return (this.svg.clientWidth-2) / this.countX;
    }

    getCellHeight() {
        return (this.svg.clientHeight-2) / this.countY;
    }

    draw() {
        this.svg.innerHTML = "";

        let width = this.svg.clientWidth;
        let height = this.svg.clientHeight;
        let cellWidth = this.getCellWidth();
        let cellHeight = this.getCellHeight();

        for (let x = 1; x < this.countX; x++) {
            let line = createSVGElem("line");
            line.classList.add("boardGridLine");
            this.svg.appendChild(line);
            setSVGAttr(line, "x1", cellWidth*x);
            setSVGAttr(line, "y1", 0);
            setSVGAttr(line, "x2", cellWidth*x);
            setSVGAttr(line, "y2", height);
        }

        for (let y = 1; y < this.countY; y++) {
            let line = createSVGElem("line");
            line.classList.add("boardGridLine");
            this.svg.appendChild(line);
            setSVGAttr(line, "x1", 0);
            setSVGAttr(line, "y1", cellHeight*y);
            setSVGAttr(line, "x2", width);
            setSVGAttr(line, "y2", cellHeight*y);
        }

        this.entities.forEach((entity) => {
            this.svg.appendChild(entity.getElement());

            entity.setElementPos(
                (entity.x * cellWidth) + (cellWidth * 0.5),
                (entity.y * cellHeight) + (cellHeight * 0.5)
            );
        });
    }
}