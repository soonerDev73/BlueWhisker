/* Javascript */
$(document).ready(function() {
	// Obtain a reference to the canvas element
	// using its id.
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	// Our image resources
	var sources = {
		station: { src: 'images/SymbolOfSurveyingTotalStation.png', x: 10, y: 25 },
		prism: { src: 'images/Prism.png', x: 10, y: 100 }
	};
	var images = [];
	var imgSize = {x: 46, y: 46};
	var mouse = { xOff: 0, yOff: 0 };
	var intervalId = 0;
	// Start listening to resize events and
	var isDrag = false;
	var mOffsetX;
	var mOffsetY;
	var mSelect;

	// draw canvas.
	initialize();

	function isOverImage(sName){
		if(mouse.x >= sources[sName].x && mouse.x <= (sources[sName].x + imgSize.x)){
			if(mouse.y >= sources[sName].y && mouse.y <= (sources[sName].y + imgSize.y)){
				return true;
			}
		}
		return false;
	}

	function mMove(e){
		if(isDrag){
			sources[mSelect].x = mouse.x - mouse.xOff;
			sources[mSelect].y = mouse.y - mouse.yOff;
		}
	}

	function mDown(){
		for(var src in sources){
			if(isOverImage(src)){
				mouse.xOff = mouse.x - sources[src].x;
				mouse.yOff = mouse.y - sources[src].y;

				mSelect = src;
				isDrag = true;
				canvas.onmousemove = mMove;
				return;
			}
		}
	}

	function mUp(){
		console.log("Mouse has been released at " + mouse.x + ", " + mouse.y);
		isDrag = false;
		canvas.onmousemove = null;
		mSelect = null;
	}

	function getMousePos(evt) {
		var rect = canvas.getBoundingClientRect();
		mouse.x = evt.clientX - rect.left;
		mouse.y = evt.clientY - rect.top;
	}

	function initialize() {
		// the window is resized.
		resizeCanvas();

		// Add event listener to get out mouse position
		canvas.addEventListener('mousemove', function(evt) { getMousePos(evt); });
		// Block text selection on doubleclick
		canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
		// Register an event listener to resize window
		window.addEventListener('resize', resizeCanvas, false);

		// Add our own mouse events
		canvas.onmousedown = mDown;
		canvas.onmouseup = mUp;

		// Draw canvas border for the first time.
		intervalId = setInterval(draw, 10);
	}
	function draw() {
		clearCanvas();
		controlPoints();
		loadImages();
		console.log(intervalId);
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
			images.push(image);
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
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};
	
	function clearCanvas() {
		context.clearRect(0, 0, canvas.width, canvas.height) 
	}
});

