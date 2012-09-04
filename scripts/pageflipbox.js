
(function(){
    var setupFlip = function(aSlidebox, aDir, aGoal) {
        console.log(aDir);
        aSlidebox.container.style.display = "block";

        aSlidebox.container.setAttribute("flipDir", aDir);

        if (aDir == "left" || aDir == "up") {
            aSlidebox.front.style.backgroundImage = xtag.prefix.css + "element(#" + aSlidebox.current.id + ")";
            aSlidebox.back.style.backgroundImage = xtag.prefix.css + "element(#" + aGoal.id + ")";
            aSlidebox.nextPage.style.backgroundImage = xtag.prefix.css + "element(#" + aGoal.id + ")";
        } else if (aDir == "right" || aDir == "down") {
            aSlidebox.front.style.backgroundImage = xtag.prefix.css + "element(#" + aGoal.id + ")";
            aSlidebox.back.style.backgroundImage = xtag.prefix.css + "element(#" + aSlidebox.current.id + ")";
            aSlidebox.nextPage.style.backgroundImage = xtag.prefix.css + "element(#" + aGoal.id + ")";
        }
    }

    var flip = function(aSlidebox) {
        var card = aSlidebox.card;
        card.style[xtag.prefix.js + "TransitionDuration"] = "1000ms";
        card.addEventListener("transitionend", flipDone.bind(aSlidebox), false);

        setTimeout((function() {
            card.classList.add("flipped");
        }).bind(this), 100);
    }

    var flipDone = function () {
        this.container.style.display = "none";

        this.card.style[xtag.prefix.js + "TransitionDuration"]= "0s";
        this.card.style[xtag.prefix.js + "Transform"] = "";
        this.card.removeEventListener("transitionend", flipDone, false);
      
        this.current.classList.remove("shown");
        this.current = this.xtag._next;
        this.current.classList.add("shown");
      
        this.card.classList.remove("flipped");
    }

    var opposite = function(aDir) {
        switch (aDir) {
            case "left": return "right";
            case "right": return "left";
            case "top": return "bottom";
            case "bottom": return "top";
        }
        return "left";
    }

    xtag.register('x-pageflipbox', {
        onCreate: function() {
            this.innerHTML += '<x-page class="container" style="display: none;">' +
            '<x-pageflipbox-card class="next"></x-pageflipbox-card>' +
            '<x-pageflipbox-card class="flipper">' +
              '<x-pageflipbox-card-side class="front"></x-pageflipbox-card-side>' +
              '<x-pageflipbox-card-side class="back"></x-pageflipbox-card-side>' +
            '</x-pageflipbox-card>' +
          '</x-page>';
          this.current = xtag.query(this, "x-page.shown")[0];
          this.xtag.index = 0;
        },
        getters: {
            current: function() {
                return this.xtag._current;
            },
            slides: function() {
                return xtag.query(this, 'x-page');
            },
            card: function() { return xtag.query(this, 'x-pageflipbox-card.flipper')[0]; },
            front: function() { return xtag.query(this, 'x-pageflipbox-card-side.front')[0]; },
            back: function() { return xtag.query(this, 'x-pageflipbox-card-side.back')[0]; },
            nextPage: function() { return xtag.query(this, 'x-pageflipbox-card.next')[0]; },
            container: function() { return xtag.query(this, 'x-page.container')[0]; },
        },
        events:{
            'transitionend': function(e){
                if (e.target == this) xtag.fireEvent(this, 'slideend');
            },
            'mousedown': function(e) { },
            'touchstart': function(e) { },
            'mousemove': function(e) { },
            'touchmove': function(e) { },
            'mouseup': function(e) { },
            'touchend': function(e) { },
        },
        setters: {
            'current': function(val) {
                if (this.xtag._current)
                    this.xtag._current.classList.remove("shown");
                if (val)
                    val.classList.add("shown");
                this.xtag._current = val;
            },
            'data-orientation': function(value){
                this.setAttribute('data-orientation', value.toLowerCase());
                init.call(this, true);
            },
        },
        methods: {
            goto: function(index){
                this.xtag.index = Math.max(Math.min(this.slides.length-1, index), 0);
                this.xtag._next = this.slides[this.xtag.index];
                setupFlip(this, this.current.flipDir, this.xtag._next);
                flip(this);
            },
            next: function() {
                this.xtag.index = Math.max(Math.min((this.slides.length-1), this.xtag.index+1), 0);
                this.xtag._next = this.slides[this.xtag.index];
                setupFlip(this, this.current.flipDir, this.xtag._next);
                flip(this);
            },
            prev: function() {
                this.xtag.index = Math.max(Math.min((this.slides.length-1), this.xtag.index-1), 0);
                this.xtag._next = this.slides[this.xtag.index];
                setupFlip(this, opposite(this.current.flipDir), this.xtag._next);
                flip(this);
            }
        }
    });
    
    xtag.register('x-page', {
        getters: {
            'flipDir': function() {
                if (this.hasAttribute("data-direction"))
                    return this.getAttribute("data-direction");
                return "left";
            },
            
        },
    });
    
})();
