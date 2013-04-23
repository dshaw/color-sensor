var five = require('johnny-five')
  , board = new five.Board()
  , photo
  , state = 0
  , duty = 255
  , maxHue
  , red
  , green
  , blue
  , leds = []


board.on('ready', function() {
	console.log('ready', board)

	red = new five.Led(9);
	blue = new five.Led(10);
	green = new five.Led(11);
	leds = [ red, green, blue ];
	
	photo = new five.Sensor({
		  pin : "A0"
		, freq : 200
	});

	photo.on('read', function(err, raw) {
		if(err) { return console.log(">>> Read error: %s", err); }
		console.log("Photo resistor: raw: %s, normalized: %s", raw, this.normalized);
	});

  function stateCheck() {
    if(--duty > 0) {
      return false;
    }
    duty = 255;
    if(++state == 3) {

      state = 0;
    }
    return true;
  }

	function stepColor() {
		stateCheck();
		leds[state].brightness(duty);
		leds[(state + 1) % 3].brightness(255 - duty);
	}



	setInterval(stepColor, 10)
});