
(function(){
	
	var currentDialog = null;
	var oldiOS = /OS [1-4]_\d like Mac OS X/i.test(navigator.userAgent),
		oldDroid = /Android 2.\d.+AppleWebKit/.test(navigator.userAgent),
		gingerbread = /Android 2\.3.+AppleWebKit/.test(navigator.userAgent);

	var modalTouch = function(event) {
		console.log("1 : " + event.type);
		if (!currentDialog) return;

		var t = event.target;
		while(t && t != currentDialog) {
			t = t.parentNode;
		}

		if (!t) {
			event.preventDefault();
			currentDialog.xtag.hide();
			console.log("2 : " + event.type);
		}
	}

	if(oldDroid){
		//<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;" />
		var meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width; initial-scale=1.0; maximum-scale=1.0; minimum-scale=1.0; user-scalable=0;';
		document.head.appendChild(meta);
	}

	window.addEventListener('keyup', function(event){
		if(event.keyCode == 27) xtag.query(document, 'x-modal').forEach(function(modal){
			if (!modal.getAttribute('data-modal-hidden')) xtag.fireEvent(modal, 'modalhide');
		});
	});

	if (oldiOS || oldDroid) {
		window.addEventListener('scroll', function(event){
			var modals = xtag.query(document, 'body > x-modal');
			modals.forEach(function(m){
				m.style.top = (window.pageYOffset + window.innerHeight * 0.5) + 'px';	
			});
		});
	}

	timer: null,

	xtag.register('x-modal', {
		mixins: ['request'],
		onCreate: function(){
			var template = '<div class="x-modal-content">${content}</div>' +
			               '<div class="x-modal-callout"></div>';
			template = template.replace('${content}', this.innerHTML || '');
			this.innerHTML = template;

			this.setAttribute('tabindex',0);
			if (!this.hasAttribute("data-modal-hidden"))
				this.setAttribute("data-modal-hidden", "true");
		},
		onInsert: function(){
			if (oldiOS || oldDroid){
				this.style.top = (window.pageYOffset + window.innerHeight * 0.5) + 'px';
			}
		},
		events: {
			'modalhide:preventable': function(){
				this.setAttribute('data-modal-hidden', true);
			}
		},
		setters: {
			'anchor' : function(val) {
				this._anchor = val;
				return this._anchor;
			}
		},
		getters: {
			'showing' : function() {
				return !this.hasAttribute("data-modal-hidden") || this.getAttribute("data-modal-hidden") == "false";
			},
			'anchor' : function() {
				if (this._anchor)
					return this._anchor;
				else if (this.hasAttribute("anchor"))
					return this._anchor = document.getElementById(this.getAttribute("anchor"));
				return null;
			},
			'callout' : function() {
				return xtag.query(this, ".x-modal-callout")[0];
			},
			'content' : function() {
				return xtag.query(this, ".x-modal-content")[0];
			}
		},
		methods: {
			show: function() {
				if (currentDialog)
					currentDialog.xtag.hide();
				this.setAttribute("data-modal-hidden", "false");
				currentDialog = this;
				if (this.anchor)
					this.xtag.anchorTo(this.anchor);
				xtag.addEvent(document, 'mousedown:touch', modalTouch);
			},
			hide: function() {
				currentDialog = null;
				this.setAttribute("data-modal-hidden", "true");
				xtag.removeEvent(document, 'mousedown:touch', modalTouch);
			},
			toggle: function() {
				if (this.showing)
					this.xtag.hide();
				else
					this.xtag.show();
			},
			anchorTo: function(aAnchor) {
				var anchorRect = aAnchor.getBoundingClientRect();
				var rect = this.getBoundingClientRect();
				
				var l = anchorRect.left;
				if (l + rect.width > window.innerWidth) {
					l += window.innerWidth - l - rect.width;
				}
				this.style.left = l;
				this.style.top = anchorRect.bottom;

				var callout = this.callout;
				var calloutRect = callout.getBoundingClientRect();
				callout.style.left = anchorRect.left - l + anchorRect.width/2 - calloutRect.width/2;
			}
		}
	});


})();