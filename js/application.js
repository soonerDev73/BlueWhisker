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
	var control = {
		CP1: { x: 200, y: 350 },
		CP2: { x: 200, y: 80 }
	};
	var zSet = { sx: 0, sy: 0, px: 0, py: 0};
	var isZSetActive = false;
	var imgSize = {x: 46, y: 46};
	var mouse = { xOff: 0, yOff: 0 };
	var intervalId = 0;
	// Start listening to resize events and
	var isDrag = false;
	var mSelect;
	var disDisplay = document.getElementById("dist");
	var angDisplay = document.getElementById("angle");
	var x1 = sources.prism.x + (imgSize.x / 2);
	var y1 = sources.prism.y + (imgSize.y / 2);
	var x2 = sources.station.x + (imgSize.x / 2);
	var y2 = sources.station.y + (imgSize.y / 2);

	// draw canvas.
	initialize();

	function angle() {

		if(isZSetActive){
			var A = getPrismXY();
			var B = getStationXY();
			var C = {x: zSet.px, y: zSet.py};

			var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));
			var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2));
			var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
			angDisplay.innerHTML = radianToDegrees( Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB)) );
		} else {
			angDisplay.innerHTML = "N/A";
		}
	}

	function radianToDegrees(r){
		return r * (180/3.14159);
	}

	function isOverImage(sName){
		if(isZSetActive && sName === "station" ){ return false; }
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

	function draw() {
		clearCanvas();
		controlPoints();
		loadImages();
		distance();
		angle();
		console.log(intervalId);
	}

	// Display custom canvas.
	// In this case it's a blue, 4 pixel border that
	// resizes along with the browser window.
	function controlPoints() {

		for( var cp in control ){
			context.beginPath();
			context.arc(control[cp].x, control[cp].y, 3, 0, 5 * Math.PI);
			context.label = cp;
			context.fill();
			context.font = "15px Arial";
			context.fillText(cp, control[cp].x + 10, control[cp].y);
		}
	}

	function distance() {
		var dsXY = getStationXY();
		var dpXY = getPrismXY();

		var dx = dpXY.x - dsXY.x;
		var dy = dpXY.y - dsXY.y;

		var d = Math.sqrt((dx*dx) + (dy*dy));
		// d = Math.round((d * 100) / 100).toFixed(2);
		d = d / 12;
		disDisplay.innerHTML = d.toFixed(2);
	}

	function loadImages() {
		var drawIt = function(img,n){
			context.drawImage(img, n.x, n.y, imgSize.x, imgSize.y);
		};
		// get num of sources
		for(var n in sources) {
			var image = new Image();
			image.src = sources[n].src;
			image.onload = drawIt(image, sources[n]);
		}

		var sXY = getStationXY();
		var pXY = getPrismXY();

		// Draw our line between the images
		context.beginPath();
		context.lineWidth = '2';
		context.moveTo( sXY.x, sXY.y );
		context.lineTo( pXY.x, pXY.y );
		context.setLineDash([5, 5]);
		context.strokeStyle="blue";
		context.stroke();

		if(isZSetActive) {
			// Draw our zeroSet
			context.beginPath();
			context.moveTo(zSet.sx,zSet.sy);
			context.lineTo(zSet.px,zSet.py);
			context.strokeStyle="black";
			context.stroke();
		}
	}

	function getPrismXY(){
		return {
			x: sources.prism.x + (imgSize.x / 2),
			y: sources.prism.y + (imgSize.y / 2)
		}
	}

	function getStationXY(){
		return {
			x: sources.station.x + (imgSize.x / 2),
			y: sources.station.y + imgSize.y }
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

	function displayZeroSet() {
		// Look up Tenary Operators
		isZSetActive = isZSetActive ? false : true;

		var szXY = getStationXY();
		var pzXY = getPrismXY();

		zSet.sx = szXY.x;
		zSet.sy = szXY.y;
		zSet.px = pzXY.x;
		zSet.py = pzXY.y;
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
		// Listen for clicking out zeroset button
		var zeroSet = document.getElementById("zeroSet");
		zeroSet.addEventListener( 'click', displayZeroSet, true );

		// Add our own mouse events
		canvas.onmousedown = mDown;
		canvas.onmouseup = mUp;

		// Draw canvas border for the first time.
		intervalId = setInterval(draw, 10);
	}
});

