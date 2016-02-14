var increasing = true;
var increaseDecrease = function(min, max, current){
	if(current >= max){
		increasing = false;
	}
	else if(current <= min)increasing = true;

	if(increasing)current++;
	else{
		current--;
	}
	return current;
};

var Slider = function(args){
	if(!args)args = {};
	this.x = args.x || 0;
	this.y = args.y || 0;
	this.height = args.height || 15;
	this.width = args.width || 15;
	this.min = args.min || 0;
	this.max = args.max || 100;
	this.current = args.current || this.min;
	this.background = args.background || 'black';
};

Slider.prototype.draw = function(context){
	var slider = this;
	context.beginPath();
	context.fillStyle = this.background;
	context.moveTo(this.x + this.current, this.y);
	context.lineTo(this.x + this.width + this.current, this.y);
	context.lineTo(this.x + (this.width/2) + this.current, this.y + this.height);
	context.fill();
	this.current = increaseDecrease(this.min, this.max, this.current);
}

var Powerbar = function(args){
	if(!args)args = {};
	this.x = args.x || 0;
	this.y = args.y || 0;
	this.width = args.width || 115;
	this.height = args.height || 35;
	this.background = args.background || 'pink';
	this.slider = args.slider || new Slider({x: this.x, y: this.y});
};

Powerbar.prototype.draw = function(context){
	var powerBar = this;
	context.fillStyle = this.background;
	context.fillRect(powerBar.x, powerBar.y, powerBar.width, powerBar.height);
	this.slider.draw(context);
}
