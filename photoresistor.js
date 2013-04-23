var 
	five = require('johnny-five')
	, chuck
	, board
	, photo
	, green
	, blue
	, red
;

board = new five.Board();

board.on('ready', function() {
	
	red = new five.Led(9);
	blue = new five.Led(10);
	green = new five.Led(11);
	photo = new five.Sensor({

		pin : "A0"
		, freq : 200

	});

	var 
		avg = [ 0, 0, 0 ]
		, color = 0
		, read
	;

	setTimeout(function() {

		color = 0
		red.on();

	}, 0);

	setTimeout(function() {

		color = 1;
		red.off();
		blue.on();

	}, 2000);

	setTimeout(function() {

		color = 2;
		blue.off();
		green.on();

	}, 4000);

	photo.on('read', function(err, dat) {

		if(err) { return console.log(">>> Read error: %s", err); }

		console.log("Raw value: %s, normalized: %s", dat, this.normalized);
	});
});