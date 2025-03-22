function placeQueenAtIndex(index) {
    let tile = document.querySelector(`[data-cell-idx="${index}"]`);

    if (tile) {
        console.log(`Clicking tile with index ${index}`);

        function clickElement(element) {
            let down = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
            let up = new MouseEvent("mouseup", { bubbles: true, cancelable: true });
            let click = new MouseEvent("click", { bubbles: true, cancelable: true });

            element.dispatchEvent(down);
            element.dispatchEvent(up);
            element.dispatchEvent(click);
        }

        clickElement(tile);
        setTimeout(() => clickElement(tile), 100);
    } else {
        console.log("Tile not found!");
    }
}
