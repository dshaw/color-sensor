var five = require('johnny-five')
  , board = new five.Board()
  , photo             // photoresistor
  , ultrasonic        // ultrasonic sensor
  , state = 0         // current color (0 = r, 1 = g, 2 = b)
  , duty = 255        // current duty cycle
  , maxPhotoValue = 0 // highest photoresistor value
  , maxHue = []       // color values at time of highest photoresistor value
  , timer             // looooooooop
  , idle = true       // boolean: is the sensor taking a reading? YES? NO!?
  , leds
  , red
  , green      
  , blue


board.on('ready', function() {
  console.log('board ready')

  red = new five.Led(9)
  blue = new five.Led(10)
  green = new five.Led(11)
  leds = [red, green, blue]
  
  photo = new five.Sensor({ pin: 'A0' , freq: 200 })

  ultrasonic = new five.Ping(3)

  ultrasonic.on('read', function(err, data) {
    //console.log('Ulrasonic sensor: %s', data)
    if(data < 500) {
      if(idle) {
        red.brightness(0)
        green.brightness(0)
        blue.brightness(0)
        getColor()
        console.log('Ultrasonic sensor: object detected at %s', data)
        console.log('Hold still!')
      }
    } else if (!idle) {
      goIdle()
      console.log('Ultrasonic sensor: idle...')
    }
  })

  photo.on('read', function(err, raw) {
    if (err) {
      return console.log('>>> Read error: %s', err)
    }
    //console.log('Photo resistor: raw: %s, normalized: %s', raw, this.normalized)
  })

  /**
   * Step through color shifting by one 
   */
  function stepColor() {
    stateCheck()
    colorCheck()
    leds[state].brightness(duty)
    leds[(state + 1) % 3].brightness(255 - duty)
  }

  /**
   * Check if the duty cycle for our current color
   * is done (0) & if so, swap 'state' to next color
   */
  function stateCheck() {
    //console.log('duty %s, state %s', duty, state)
    if(--duty > 0) {
      return false
    }
    duty = 255

    if (state < 3) console.log('...wait for it...', state, maxHue)

    if(++state == 3) {
      // done with scan
      state = 0
      var hex = rgbToHex(maxHue)
      console.log('color sensed: #%s - %s', hex, 'http://colorhexa.com/'+hex)
      goIdle()
    }
    return true
  }

  /**
   * Check the latest value of our light sensor & 
   * compare to see if it's higher than 
  */
  function colorCheck() {
    if(photo.value > maxPhotoValue) {
      maxPhotoValue = photo.value
      maxHue = [
        red.value
      , green.value
      , blue.value
      ]
    }
  }

  /**
   * Start a color scan!
   */
  function getColor() {
    idle = false
    timer = setInterval(stepColor, 10)
  }

  /**
   * Do nothing...
   */
  function goIdle() {
    state = 0
    duty = 255
    idle = true
    maxPhotoValue = 0
    leds[0].brightness(0)
    leds[1].brightness(0)
    leds[2].brightness(0)
    maxHue = []
    clearInterval(timer)
  }

  function componentToHex(color) {
      var hex = color.toString(16)
      return hex.length == 1 ? '0' + hex : hex
  }

  function rgbToHex(vals) {
      return [
        , componentToHex(vals[0])
        , componentToHex(vals[1])
        , componentToHex(vals[2])
      ].join('')
  }
})