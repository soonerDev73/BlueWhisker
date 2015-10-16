/* Javascript */
$(document).ready(function() {
	// Obtain a reference to the canvas element
	// using its id.
	var htmlCanvas = document.getElementById('myCanvas');
	var sources = {
		totalStation:'images/SymbolOfSurveyingTotalStation.jpg',
		prism:'images/Prism.png'
	};
	// Obtain a graphics context on the
	// canvas element for drawing.
	var context = htmlCanvas.getContext('2d');
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
		context.arc(200, 80, 3, 0, 5 * Math.PI);
		context.label ='CP1';
		context.arc(200, 350, 3, 0, 5 * Math.PI);
		context.fill();	
	
	}

	function loadImages(sources, callback) {
		var images = {};
		var loadedImages = 0;
		var numImages = 0;
		// get num of sources
		for(var src in sources) {
			numImages++;
		}
		for(var src in sources) {
			images[src] = new Image();
			images[src].onload = function() {
				if(++loadedImages >= numImages) {
					callback(images);
				}
			};
			images[src].src = sources[src];
		}
	}

	loadImages(sources, function(images) {
		context.drawImage(images.totalStation, 10, 25, 40, 40);
		context.drawImage(images.prism, 10, 75, 40, 40);
	});
	
	// Runs each time the DOM window resize event fires.
	// Resets the canvas dimensions to match window,
	// then draws the new borders accordingly.
	function resizeCanvas() {
		htmlCanvas.width = window.innerWidth;
		htmlCanvas.height = window.innerHeight;
		controlPoints();
			loadImages(sources, function(images) {
		context.drawImage(images.totalStation, 10, 25, 40, 40);
		context.drawImage(images.prism, 10, 75, 40, 40);
	});
		
	}

});

