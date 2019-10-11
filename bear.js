class Bear {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = createSVGElem("image");
        setSVGAttr(this.image, "href", "bear.svg");
        setSVGAttr(this.image, "width", this.width);
        setSVGAttr(this.image, "height", this.height);
    }

    getElement() {
        return this.image;
    }

    setElementPos(x, y) {
        let newX = x - (this.width * 0.5);
        let newY = y - (this.height * 0.5);
        this.image.setAttribute("transform", `translate(${newX}, ${newY})`);
    }
}