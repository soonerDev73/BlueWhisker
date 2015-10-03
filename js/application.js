/* Javascript */
$(document).ready(function() {
	// Obtain a reference to the canvas element
	// using its id.
	var htmlCanvas = document.getElementById('myCanvas');

	// Obtain a graphics context on the
	// canvas element for drawing.
	var context = htmlCanvas.getContext('2d');
	var c = document.getElementById('myCanvas');
	
	// Start listening to resize events and
	// draw canvas.
	initialize();

	function initialize() {
		// Register an event listener to
		// call the resizeCanvas() function each time
		// the window is resized.
		window.addEventListener('resize', resizeCanvas, false);

		// Draw canvas border for the first time.
		resizeCanvas();
		controlPoints();
	}
	// Display custom canvas.
	// In this case it's a blue, 4 pixel border that
	// resizes along with the browser window.
	function controlPoints() {
		context.strokeStyle = 'blue';
		context.lineWidth = '4';
		context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
		context.beginPath();
		context.arc(200, 80, 6, 0, 5 * Math.PI);
		context.arc(200, 350, 6, 0, 5 * Math.PI);
		context.fill();
	}

	// Runs each time the DOM window resize event fires.
	// Resets the canvas dimensions to match window,
	// then draws the new borders accordingly.
	function resizeCanvas() {
		htmlCanvas.width = window.innerWidth;
		htmlCanvas.height = window.innerHeight;
		
	}

});
