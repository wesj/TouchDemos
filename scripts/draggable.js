(function(window, document, undefined){
    var dragging = null;
    var move = function(e) {
        if (dragging.xtag.startDrag) {
            dragging.style.left = e.clientX - dragging.xtag.startDrag.x;
            dragging.style.top =  e.clientY - dragging.xtag.startDrag.y;
        }
    }
    var up = function(e) {
        // stop dragging
        dragging.xtag.startDrag = null;
        document.removeEventListener("mousemove", move, false);
        document.removeEventListener("mouseup", up, false);
        dragging = null;
    }
    xtag.register('x-draggable', {
        events:{
            // TODO: Add support for touch!
            'mousedown': function(e) {
                e.preventDefault();
                e.stopPropagation();

                // start dragging
                this.xtag.startDrag = { x: e.clientX - this.offsetLeft,
                                        y: e.clientY - this.offsetTop };
                dragging = this;
                document.addEventListener("mousemove", move, false);
                document.addEventListener("mouseup", up, false);
                console.log("Start: " + this.xtag.startDrag);
            }
        },
    });

})(this, this.document);