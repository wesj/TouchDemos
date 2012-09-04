(function(window, document, undefined){

	xtag.addEvent(document, 'mouseup:touch', function(e){
		xtag.removeClass(document.body,'x-tag-slider-drag');
		if (selected){
			xtag.removeClass(selected.xtag.knob, 'x-tag-slider-knob-moving');
			xtag.removeEvent(document, 'mousemove:touch', selected.xtag.mouseMoveFn);
		}
		selected = null;
	});
	
	var selected = null;
	var mouseMove = function(e){
		if (selected) {
			e.stopPropagation();
			var x = /touch/.test(e.type) ? e.touches[0].clientX : e.clientX;

			var range = selected.range.parentNode.getBoundingClientRect();
			var position = Math.round(
					(x - range.left) / 
						(range.width) * 1000)/10;
			position = position > 100 ? 100 : position < 0 ? 0 : position;
			selected.value = position;
		}
	}

	var initStepTable = function(min, max, step){
		for (var i = Number(this.dataset.min); i <= Number(this.dataset.max); i = i + Number(this.dataset.step)){
			this.xtag.stepTable.push(Number(i));
		}
	}

	xtag.register('x-slider', {
		onCreate: function(){
			var template = '<label>${label}</label><div class="x-slider-container">'+
				'<div class="x-slider-min">${minLabel}</div>' +
				'<div class="x-slider-range"><div tabindex="0" class="x-slider-knob"></div></div>' +
				'<div class="x-slider-max">${maxLabel}</div></div>' +
				'<input name="${name}" type="hidden" value="${startValue}" />';
			template = template.replace('${label}', this.dataset.label || 'Slider')
				.replace('${minLabel}', this.dataset.minLabel || '')
				.replace('${maxLabel}', this.dataset.maxLabel || '')
				.replace('${name}', this.dataset.name || this.id || "")
				.replace('${startValue}', this.dataset.startValue || "");
			this.innerHTML = template;
			this.xtag.knob = xtag.query(this, '.x-slider-knob')[0];
			this.xtag.input = xtag.query(this, 'input')[0];
			this.xtag.stepTable = [];
			this.dataset.step = this.dataset.step || 1;
			this.dataset.min = this.dataset.min || 0;
			this.dataset.max = this.dataset.max || 10;
			initStepTable.call(this, 
				Number(this.dataset.min), 
				Number(this.dataset.max), 
				Number(this.dataset.step));
			if (this.dataset.startValue != undefined){
				this.xtag.knob.style.left = ((Number(this.dataset.startValue)/(Number(this.dataset.max)))*100) + '%';
			}
			this.xtag.mouseMoveFn = null;
		},
		onInsert: function(){
		},
		events:{
			'mousedown:delegate(.x-slider-knob):touch': function(e, elem) {
				e.preventDefault();
				e.stopPropagation();
				selected = elem;
				selected.xtag.mouseMoveFn = xtag.addEvent(document, 'mousemove:touch', mouseMove);
				xtag.addClass(document.body,'x-tag-slider-drag');
				xtag.addClass(selected.xtag.knob, 'x-tag-slider-knob-moving');
			}, 
			'click:delegate(.x-slider-range)': function(e, elem){
				if (e.target.className == 'x-slider-range'){
					selected = elem;
					mouseMove(e);
					selected = null;
				}
			},
			'keydown:delegate(.x-slider-knob):keypass(37, 39)': function(e, elem){
				var currentValue = Number(elem.xtag.input.value);
				for (var step = 0; step < elem.xtag.stepTable.length-1; step++){
					if (currentValue == elem.xtag.stepTable[step]){
						break;
					}
				}
				step = e.keyCode == 37 ? step - 1 : step + 1;
				if (step >= 0 && step <= elem.xtag.stepTable.length - 1){
					elem.xtag.knob.style.left = (step/(elem.xtag.stepTable.length-1)*100) + '%';
					elem.xtag.input.value = elem.xtag.stepTable[step];
					xtag.fireEvent(elem,'change', { value: elem.xtag.stepTable[step] });
				}
			}
		},
		setters: {
			'min:attribute(data-min)': function(value){				
				initStepTable.call(this, 
					Number(value), 
					Number(this.dataset.max), 
					Number(this.dataset.step));
			}, 
			'max:attribute(data-max)': function(value){
				initStepTable.call(this, 
					Number(this.dataset.min), 
					Number(value), 
					Number(this.dataset.step));
			}, 
			'step:attribute(data-step)': function(value){
				initStepTable.call(this, 
					Number(this.dataset.min), 
					Number(this.dataset.max), 
					Number(value));
			},
			'label:attribute(data-label)': function(value){
				var label = xtag.query(this, "label")[0];
				label.innerHTML = value;
			},
			'minLabel:attribute(data-min-label)': function(value){
				var label = xtag.query(this, ".x-slider-min")[0];
				label.innerHTML = value;
			},
			'maxLabel:attribute(data-max-label)': function(value){
				var label = xtag.query(this, ".x-slider-max")[0];
				label.innerHTML = value;
			},
			'value': function(value) {
				var translatedValue = (this.dataset.max - this.dataset.min) * (value / 100);
				for (var step = 0; step < this.xtag.stepTable.length-1; step++){
					var stepValue = this.xtag.stepTable[step],
						variance = this.dataset.step/2,
						high = Math.min(this.dataset.max, stepValue+variance),
						low =  Math.max(this.dataset.min, stepValue-variance);
					if (translatedValue >= low && translatedValue <=  high){
						break;
					}
				}
	
				var changed = this.value != this.xtag.stepTable[step];
				if (changed){
					this.xtag.input.value = this.xtag.stepTable[step];

					xtag.fireEvent(this,'change', { value: this.xtag.input.value });
	
					if (this.dataset.snap != undefined){
						this.xtag.knob.style.left = ((step/(this.xtag.stepTable.length-1))*100) + '%';
					}
				}
				if (this.dataset.snap == undefined){
					this.xtag.knob.style.left = value + '%';
				}
				window.getSelection().removeAllRanges();
			}
		},
		getters: {
			'value' : function(){
				return Number(this.xtag.input.getAttribute('value'));
			},
			'knob': function() {
				return xtag.query(this, ".x-slider-knob")[0];
			},
			'range': function() {
				return xtag.query(this, ".x-slider-range")[0];
			}
		},
		methods: {
		
		}
	});

})(this, this.document);