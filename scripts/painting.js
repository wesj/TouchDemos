(function(window, document, undefined){
        var selected = null;
        var prevPoint = null;
        var ctx = null;
        var bcr = null;

    var mouseMove = function(e){
            var x = /touch/.test(e.type) ? e.touches[0].clientX : e.clientX;
            var y = /touch/.test(e.type) ? e.touches[0].clientY : e.clientY;
            if (selected && prevPoint) {
                selected.ctx.beginPath();
                selected.ctx.moveTo(prevPoint.x, prevPoint.y);
                selected.ctx.lineTo(x - selected.offsetLeft, y - selected.offsetTop);
                selected.ctx.stroke();
            }
            prevPoint = {
                x: x - selected.offsetLeft,
                y: y - selected.offsetTop
            }
    }

    xtag.register('x-painting', {
        onCreate: function(){
            this.innerHTML = '<canvas class="x-painting-canvas"></canvas>';
            this.xtag.mouseMoveFn = null;
            bcr = this.getBoundingClientRect();
            this.canvas.width = bcr.width;
            this.canvas.height = bcr.height;
            this.ctx.lineCap = "round";
        },
        onInsert: function(){ },
        events:{
            'mousedown:delegate(.x-painting-canvas):touch': function(e, elem) {
                e.preventDefault();
                selected = elem;
                selected.xtag.mouseMoveFn = xtag.addEvent(this.canvas, 'mousemove:delegate(.x-painting-canvas):touch', mouseMove);
                prevPoint = {
                    x: e.clientX - selected.offsetLeft,
                    y: e.clientY - selected.offsetTop
                }
            },
            'mouseup:delegate(.x-painting-canvas):touch': function(e){
                if (selected){
                    prevPoint = null;
                    xtag.removeEvent(this.canvas, 'mousemove:delegate(.x-painting-canvas):touch', selected.xtag.mouseMoveFn);
                }
            }
        },
        setters: {
            'color': function(value) {
                this.ctx.strokeStyle = value;
            },
            'radius': function(value) {
                this.ctx.lineWidth = value;
            },
        },
        getters: {
            'canvas' : function() {
                return xtag.query(this, "canvas")[0];
            },
            'ctx' : function() {
                if (!ctx)
                    ctx = this.canvas.getContext("2d");
                return ctx;
            }
        },
        methods: {
            // this adds an image wrapped in an x-dragable node. if x-dragable is registered it will do whatever it does
            // otherwise, it will just be a wrapper
            // TODO: Let callers dynamically determine the wrapper type?
            addDragableImage: function(aImg) {
                if (aImg.nodeName != "IMG")
                    return;
                var draggable = document.createElement("x-draggable");
                draggable.appendChild(aImg);
                this.appendChild(draggable);
            },
            addImage: function(aImg) {
                if (aImg.nodeName != "IMG")
                    return;
                this.insertBefore(aImg, this.canvas);
            }
        }
    });

})(this, this.document);