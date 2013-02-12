/**
 * Input Calc
 * Turn any input into a calculator.
 * @author Michael Price <pricema@gmail.com>
 * @todo Calculate pre-determined items selectable by checkboxes per item.
 * @todo Support keystrokes
 * @todo Make calculator input direction = rtl
 */
!(function($,can){
	"use strict";
	//default options
	var defaults = {
		calc_input_HTML: '<input type="text" class="input-calc-widget" readonly/>', //calculator display input
		calc_btn_container_HTML:'<div/>',
		calc_row_HTML:'<div/>',
		calc_button_HTML: '<button class="btn calc-input-button" />',
		control_HTML: { 
			el:'<div class="calc-input-container"/>',
			style:{
				position:'absolute',
				top:0,
				left:0,
				display:'none',
				height:'180px',
				width:'230px',
				border:"1px solid #eee",
				"text-align":"center",
				"border-radius":"5px"	
			}
		},
		control_wrapper:'<div/>',
		input_read_only:true
	};

	//prototype definition object
	var fn = {
		controller:[],
		controls:{},
		body:null,
		mode:'default',
		current_value:0
	}

	//private methods
	var priv = {
		//positions the body of the widget next to text element
		position_body:function(){
			fn.body.css(this.options.control_HTML.style);

			fn.body.css('top',this.element.find('.input-calc-main').offset().top);

			fn.body.css('left',this.element.find('.input-calc-main').offset().left+this.element.width()+15);
		},
		//builds the default calculator widget
		build_default:function(){
			
			var self = this;
			var inputs = [['7','8','9','+'],['4','5','6','-'],['1','2','3','/'],['0','.','=','*']];
			var out = $(this.options.calc_btn_container_HTML);
			
			fn.body = $(this.options.control_HTML.el);

			fn.controls.display = $(this.options.calc_input_HTML);

			fn.body.append(fn.controls.display);

			//iterate through my little input array and build the buttons
			$.each(inputs,function(idx,calc_row){
				
				var r =  $(self.options.calc_row_HTML);

				$.each(calc_row,function(idx,calc_button){
					var b = $(self.options.calc_button_HTML);
					b.width('35');
					b.text(calc_button);
					b.css("margin-right","5px");
					r.append(b);
				});

				out.append(r);
			});

			fn.body.append(out);


			this.element.closest('div').append(fn.body);

			fn.body.css('width',fn.controls.display.width());
		}
	}

	fn.init=function(o){

		if(this.options.input_read_only == true){
			this.element.find('input.input-calc-main').attr('readonly','readonly');
		}
		
		this.element.find('input.input-calc-main').val('0');

		if(this.options.items)
			$.warn('Items arent supported in input_cal'); //items aren't supported yet
			
		this.element.width(this.element.find('input.input-calc-main').width());

		priv.build_default.apply(this);		

		priv.position_body.apply(this);	
	}

	//toggle the widget display
	fn['input.input-calc-main click']=function(){
		fn.body.toggle();
	}

	//calculator button events
	fn['button.calc-input-button click']=function(el){
		//add values to the calculator display
		if(el.text() == '='){
			fn.calculate.apply(this);
			return;
		}

		var v = fn.controls.display.val();
		
		fn.controls.display.val(v+el.text());	
	}	

	//used to calculate
	fn.calculate=function(){
		if(fn.mode == 'default'){
			var total = 0;

			try{
				total = eval(fn.controls.display.val());
				//i know eval is evil but it's such a nice simple way to calculate values.
			}catch(err){
				//invalid input like ++ or -- or /+=*
				//cheap fix for now but at least it keeps from breaking anything.
				total = 0;

			}
				
			this.element.find('input.input-calc-main').val(total);

			fn.controls.display.val('');

			fn.body.hide();
		}	
	}

	//jquery plugin style widgets like jmvc
	$.fn.input_calc=function(options){
		//set the options
		defaults = $.extend(defaults,options||{});
		//create the control instance
		var instance = can.Control(defaults,fn);
		//instantiate a control for each found element
		this.each(function(idx,el){
			el=$(el);
			el.addClass('input-calc-main');
			el.wrap(defaults.control_wrapper);
			fn.controller[idx] = new instance(el.parent(),defaults);
		});
		
	}

})(window.jQuery,can);