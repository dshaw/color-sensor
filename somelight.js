var 
	five = require('johnny-five')
	, leds
	, board
	, photo
	, state = 0
	, duty = 255
	, maxHue
	, green
	, blue
	, red
;

board = new five.Board();

board.on('ready', function() {
	
	red = new five.Led(9);
	blue = new five.Led(10);
	green = new five.Led(11);
	leds = [ red, green, blue ];
	
	photo = new five.Sensor({

		pin : "A0"
		, freq : 200

	});

	photo.on('read', function(err, dat) {

		if(err) { return console.log(">>> Read error: %s", err); }

		console.log("Raw value: %s, normalized: %s", dat, this.normalized);
	});

	function stepColor() {

		stateCheck();
		leds[state].brightness(duty);
		leds[(state + 1) % 3].brightness(255 - duty);
	};	
	function stateCheck() {

		if(--duty > 0) {

			return false;
		}
		duty = 255;
		if(++state == 3) {

			state = 0;
		}
		return true;
	};

	setInterval(stepColor, 10)
});