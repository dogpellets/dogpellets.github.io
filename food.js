class Food {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.group = createSVGElem("g");
        this.image = createSVGElem("image");
        this.group.appendChild(this.image);
        setSVGAttr(this.image, "href", "fish.svg");
        setSVGAttr(this.image, "width", this.width);
        setSVGAttr(this.image, "height", this.height);
        setSVGAttr(this.image, "x", -this.width * 0.5);
        setSVGAttr(this.image, "y", -this.width * 0.5);
        this.image.classList.add("rotty-anim");
    }

    getElement() {
        return this.group;
    }

    setElementPos(boardX, boardY) {
        let newX = boardX;
        let newY = boardY;
        this.group.setAttribute("transform", `translate(${newX}, ${newY})`);
    }
}