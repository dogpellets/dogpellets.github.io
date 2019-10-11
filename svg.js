const createSVGElem = (name) => {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
}

const setSVGAttr = (elem, attrName, attrValue) => {
    elem.setAttributeNS(null, attrName, attrValue);
}