/* Javascript */
$(document).ready(function() {
	// Obtain a reference to the canvas element
	// using its id.
	var htmlCanvas = document.getElementById('myCanvas');
	var sources = {
		station: { src: 'images/SymbolOfSurveyingTotalStation.jpg', x: 10, y: 25 },
		prism: { src: 'images/Prism.png', x: 10, y: 100 }
	};
	var imgSize = {x: 46, y: 46};

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
		context.font = "15px Arial";
		context.fillText(" CP2", 160, 90);
		context.font = "15px Arial";
		context.fillText(" CP1", 160, 360);
	}

	function loadImages() {
		var drawIt = function(img,n){
				context.drawImage(img, n.x, n.y, imgSize.x, imgSize.y);
		};
		// get num of sources
		for(var n in sources) {
			// images[src] = new Image();
			var image = new Image();
			image.src = sources[n].src;
			image.onload = drawIt(image, sources[n]);
		}
		// Draw our line between the images
		context.beginPath();
		context.moveTo(sources.station.x + (imgSize.x / 2),sources.station.y + imgSize.y);
		context.lineTo(sources.prism.x + (imgSize.x / 2),sources.prism.y + (imgSize.y / 2) );
		context.setLineDash([5, 5]);
		context.strokeStyle="blue";
		context.stroke();
	}

	// Runs each time the DOM window resize event fires.
	// Resets the canvas dimensions to match window,
	// then draws the new borders accordingly.
	function resizeCanvas() {
		htmlCanvas.width = window.innerWidth;
		htmlCanvas.height = window.innerHeight;
		controlPoints();
		loadImages();
	};
});

