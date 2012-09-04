
(function(){

    var onCommand = function(e){
        xtag.fireEvent(this, 'command', { command: this.getAttribute('command') });
    }

    xtag.register('x-fastbutton', {
        content: '<img /><label></label>',
        onCreate: function(){
            this.setAttribute('tabindex', 0);
            this.label = this.getAttribute('label');
            this.src = this.getAttribute('src');
        },
        events: {
            'mousedown': function(e) { },
            'mouseup': function(e) { },
            'mousemove': function(e) { },
            'click': function(e) {
                // if we're detecting touch events, we should ignore these clicks
            },
            'touchstart': function(e) {
                // log the start point. Don't call preventDefault here. The user may want to pan
            },
            'touchend': function(e) {
                // if this is a tap, fire onCommand
            },
            'touchmove': function(e) {
                // check if the touch has moved far from its start point
                // "far" should be dpi dependent
                // if it has cancel the tap
            },
            'keyup:keypass(13)': onCommand,
        },
        setters: {
            'src': function(src){
                this.firstElementChild.src = src; 
                this.setAttribute('src', src);
            },
            'label': function(html){
                this.lastElementChild.innerHTML = html;
                this.setAttribute('label', html);
            }
        }
    });
    
})();