class Tree {
    constructor(x, y, width, height, imageName) {
        this.x = x;
        this.y = y;
        this.imageName = imageName;
        this.width = width;
        this.height = height;
        this.group = createSVGElem("g");
        this.image = createSVGElem("image");
        this.group.appendChild(this.image);
        setSVGAttr(this.image, "href", imageName);
        setSVGAttr(this.image, "width", this.width);
        setSVGAttr(this.image, "height", this.height);
        setSVGAttr(this.image, "x", -this.width * 0.5);
        setSVGAttr(this.image, "y", -this.width * 0.5);
    }

    copy() {
        return new Tree(this.x, this.y, this.width, this.height, this.imageName);
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