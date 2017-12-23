(function () {

	'use strict'

	let canvas = document.getElementById('canvas');
	let ctx = canvas.getContext('2d');

	let canvasW = canvas.width = window.innerWidth;
	let canvasH = canvas.height = window.innerHeight;

	let mouseX = null;
	let mouseY = null;

	let ghosts = [];
	let death = [];

	let MAX_GHOSTS = 10;

	if(canvasW < 100) {
		MAX_GHOSTS = 2;
	} if (canvasW < 500) {
		MAX_GHOSTS = 4;
	} if (canvasW < 800) {
		MAX_GHOSTS = 6;
	}

	class Death {
		constructor(__x, __y) {
			this.x = __x + getRandomNegativeOrPositiveNumberBetween(0, 75);
			this.y = __y + getRandomNegativeOrPositiveNumberBetween(0, 75);
			this.radius = getRandomNumberBetween(1, 10);
			this.vy = getRandomNumberBetween(0.1, 1);
		}
		draw() {
			drawCircleFull(this.x, this.y, this.radius, 'white');
		}
		update() {
			this.y += this.vy;
			this.vy += getRandomNumberBetween(0.1, 1);
		}
	}

	class Phantom {
		// Constructor
		constructor() {
			this.bodyRadius = 30;
			this.handRadius = this.bodyRadius/2.5;
			this.eyeRadius = this.bodyRadius/10;

			this.initialPositionX = getRandomNumberBetween(0, canvasW);
			this.initialPositionY = getRandomNumberBetween(0, canvasH);

			this.positionX = this.initialPositionX;
			this.positionY = this.initialPositionY;

			this.handRightX = this.initialPositionX + this.bodyRadius;
			this.handRightY = this.initialPositionY + this.bodyRadius/1.5;

			this.handLeftX = this.initialPositionX - this.bodyRadius;
			this.handLeftY = this.initialPositionY + this.bodyRadius/1.5;

			this.eyeRightX = this.initialPositionX + this.bodyRadius/4;
			this.eyeRightY = this.initialPositionY;

			this.eyeLeftX = this.initialPositionX - this.bodyRadius/4;
			this.eyeLeftY = this.initialPositionY;

			this.initalPosition_eyeRightX = this.eyeRightX;
			this.initalPosition_eyeRightY = this.eyeRightY;

			this.initalPosition_eyeLeftX = this.eyeLeftX;
			this.initalPosition_eyeLeftY = this.eyeLeftY;

			this.bodyVelocity_X = 0;
			this.bodyVelocity_Y = 0.1;

			this.handsVelocity_X = 0;
			this.handsVelocity_Y = -0.1;

			this.age = 0;

			this.dateUpdated = new Date();

		}
		// Prototype Methods
		draw() {
			drawCircleFull(this.positionX, this.positionY, this.bodyRadius, 'white');
			drawCircleFull(this.handRightX, this.handRightY, this.handRadius, 'white');
			drawCircleFull(this.handLeftX, this.handLeftY, this.handRadius, 'white');
			drawCircleFull(this.eyeRightX, this.eyeRightY, this.eyeRadius, 'black');
			drawCircleFull(this.eyeLeftX, this.eyeLeftY, this.eyeRadius, 'black');
			// ctx.fillStyle = 'white';
			// ctx.font = '18px Arial';
			// ctx.fillText(`${this.age}`, this.positionX - 5, this.positionY - this.bodyRadius - 10);
		
		}
		update() {
			// body movement
			let relativePositionY = Math.abs(this.positionY - this.initialPositionY);
			if(relativePositionY > 5) {
				this.bodyVelocity_Y *= -1;
				this.handsVelocity_Y *= -1;
			}

			this.positionX += this.bodyVelocity_X;
			this.positionY += this.bodyVelocity_Y;

			this.handLeftY += this.handsVelocity_Y;
			this.handRightY += this.handsVelocity_Y;


			// age

			let dateNow = new Date();
			let diferencialTime = dateNow - this.dateUpdated;

			if(diferencialTime > 500) {
				this.age++;
				this.bodyRadius += 0.25;
				this.dateUpdated = dateNow;
			}

			this.handRadius = this.bodyRadius/2;
			this.eyeRadius = this.bodyRadius/10;

			this.eyeRightX = this.positionX + this.bodyRadius/4;
			this.eyeRightY = this.positionY;

			this.eyeLeftX = this.positionX - this.bodyRadius/4;
			this.eyeLeftY = this.positionY;


			// eyes movement
			// let eyesRelativeToMouseX = mouseX - this.positionX;
			// let eyesRelativeToMouseY = mouseY - this.positionY;

			// let eye_X_Right_RelativeToSTART = Math.abs(this.eyeRightX - this.initialPositionX);
			// let eye_Y_Right_RelativeToSTART = Math.abs(this.eyeRightY - this.initialPositionY);

			// let eye_X_Left_RelativeToSTART = Math.abs(this.eyeLeftX - this.initialPositionX);
			// let eye_Y_Left_RelativeToSTART = Math.abs(this.eyeLeftY - this.initialPositionY);


			// this.eyeRightX += eyesRelativeToMouseX/100;
			// this.eyeRightY += eyesRelativeToMouseY/100;
			// this.eyeLeftX += eyesRelativeToMouseX/100;
			// this.eyeLeftY += eyesRelativeToMouseY/100;

			// if(eye_X_Right_RelativeToSTART < 25) {
			// 	this.eyeRightX = this.initalPosition_eyeRightX;
			// } else {
			// 	this.eyeRightX += eyesRelativeToMouseX/100;
			// }

			// if(eye_Y_Right_RelativeToSTART < 25) {
			// 	this.eyeRightY = this.initalPosition_eyeRightY;
			// } else {
			// 	this.eyeRightY += eyesRelativeToMouseY/100;
			// }

			// if(eye_X_Left_RelativeToSTART < 25) {
			// 	this.eyeLeftX = this.initalPosition_eyeLeftX;
			// } else {
			// 	this.eyeLeftX += eyesRelativeToMouseX/100;
			// }

			// if(eye_Y_Left_RelativeToSTART < 25) {
			// 	this.eyeLeftY = this.initalPosition_eyeLeftY;
			// } else {
			// 	this.eyeLeftY += eyesRelativeToMouseY/100;
			// }





		}
	}

	canvas.addEventListener('mousemove', updateMousePosition);
	window.addEventListener('resize', resizeCanvas, false);

	init();

	(function renderFrame() {
		requestAnimationFrame(renderFrame);
		clearCanvas();
		drawRectangleFull(0, 0, canvasW, canvasH, 'black');
		update();
		drawMousePosition();
	}());

	function init() {
		do {
			let p = new Phantom();
			let tooClose = false;
			// too close to canvas borders
			if(p.initialPositionX < p.bodyRadius*2 || p.initialPositionX > canvasW - p.bodyRadius*2 || p.initialPositionY < p.bodyRadius*2 || p.initialPositionY > canvasH - p.bodyRadius*2) {
				tooClose = true;
			}
			// too close to each other
			for(let k = 0; k < ghosts.length; k++) {
				let relativePositionX = Math.abs(ghosts[k].initialPositionX - p.initialPositionX);
				let relativePositionY = Math.abs(ghosts[k].initialPositionY - p.initialPositionY);
				if(relativePositionX < 150 && relativePositionY < 150) {
					tooClose = true;
				}

			}
			if(!tooClose) {
				ghosts.push(p);
			}
		} while(ghosts.length < MAX_GHOSTS);
	}

	function update() {
		for(let i = 0; i < ghosts.length; i++) {
			ghosts[i].update();
			ghosts[i].draw();
			let randomNumberOfDeath = getRandomNumberBetween(0, 1000);
			if(randomNumberOfDeath === 10 || ghosts[i].age === 66) {
				drawDeath(ghosts[i].positionX, ghosts[i].positionY);
				ghosts.splice(i, 1);
			}
		}
		for(let i = 0; i < death.length; i++) {
			death[i].update();
			death[i].draw();
		}
	}

	function drawDeath(x, y) {
		for(let i = 0; i < 25; i++) {
			let d = new Death(x, y);
			death.push(d);
		}
	}

	function updateMousePosition(event) {
		let rect = canvas.getBoundingClientRect();
		let root = document.documentElement;
		mouseX = event.clientX - rect.left - root.scrollLeft;
		mouseY = event.clientY - rect.top - root.scrollTop;
	}

	function drawMousePosition() {
		ctx.fillStyle = 'black';
		ctx.font = '18px Arial';
		ctx.fillText(`${mouseX}, ${mouseY}`, mouseX, mouseY);
	}

	function resizeCanvas() {
		canvasW = canvas.width = window.innerWidth;
		canvasH = canvas.height = window.innerHeight;
	    init();
	}

	function drawLine(startX, startY, endX, endY, color, thickness) {
		if(color) {
			ctx.strokeStyle = color;
		}
		if(thickness) {
			ctx.lineWidth = thickness;
		}
	    ctx.beginPath();
	    ctx.moveTo(startX, startY);
	    ctx.lineTo(endX, endY);
	    ctx.stroke();
	}

	function drawRectangleFull(positionX, positionY, width, height, color) {
		if(color) {
			ctx.fillStyle = color;
		}
		ctx.fillRect(positionX, positionY, width, height);
	}

	function drawRectangleEmpty(positionX, positionY, width, height, borderColor, borderThickness) {
		if(borderColor) {
			ctx.strokeStyle = borderColor;
		}
		if(borderThickness) {
			ctx.lineWidth = borderThickness;
		}
		ctx.beginPath();
		ctx.rect(positionX, positionY, width, height); 
		ctx.stroke();
	}

	function drawCircleFull(centerX, centerY, radius, color) {
		if(color) {
			ctx.fillStyle = color;
		}
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
	}

	function drawCircleEmpty(centerX, centerY, radius, borderColor, borderThickness) {
		if(borderColor) {
			ctx.strokeStyle = borderColor;
		}
		if(borderThickness) {
			ctx.lineWidth = borderThickness;
		}
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		ctx.stroke();
	}

	function drawTriangleFull(firstX, firstY, secondX, secondY, thirdX, thirdY, color) {
		if(color) {
			ctx.fillStyle = color;
		}
	    ctx.beginPath();
	    ctx.moveTo(firstX, firstY);
	    ctx.lineTo(secondX, secondY);
	    ctx.lineTo(thirdX, thirdY);
	    ctx.fill();
	}

	function drawTriangleEmpty(firstX, firstY, secondX, secondY, thirdX, thirdY, borderColor, borderThickness) {
		if(borderColor) {
			ctx.strokeStyle = borderColor;
		}
		if(borderThickness) {
			ctx.lineWidth = borderThickness;
		}
	    ctx.beginPath();
	    ctx.moveTo(firstX, firstY);
	    ctx.lineTo(secondX, secondY);
	    ctx.lineTo(thirdX, thirdY);
	    ctx.lineTo(firstX, firstY);
	    ctx.stroke();
	}

	function drawImage(imgSource, positionX, positionY, width, height) {
		let img = new Image();
		img.src = imgSource;
		window.onload = function() {
			if(width && height) {
				ctx.drawImage(img, positionX, positionY, width, height);
			} else {
				ctx.drawImage(img, positionX, positionY);
			}
		}
	}

	function clearCanvas() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function getRandomNumberBetween(min, max) {
		let num = Math.floor(Math.random() * max) + min;
		return num;
	}

	function getRandomNegativeOrPositiveNumberBetween(min, max) {
		// this will get a number between min and max;
		let num = Math.floor(Math.random() * max) + min;
		// this will add minus sign in 50% of cases
		num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
		return num;
	}

})();