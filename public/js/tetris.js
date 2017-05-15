//Qunit을 통한 테스트 가능한 코드로 리팩토링 setInterval보다는 setTimeout이나 requestAnimationFrame을 사용할 것
function Tetris(data) {
	for(let props in data) {
		this[props] = data[props];
	}
	this.gameContext = this.gameCanvas.getContext("2d");
	this.nextContext = this.nextCanvas.getContext("2d");
	this.resize();
	this.gameBoard = [];
	this.score = 0;
	this.currLevel = null;
	this.goToNextLevel = null;
	this.lose = false;
	this.interval = null;
	this.renderInterval = null;
	this.curr = null;
	this.next = null;
	this.currIdx = null;
	this.nextIdx = null;
	this.currRotateIdx = null;
	this.pause = true;	
	this.currX = null;
	this.currY = null;
	this.playOn = false;
}

Tetris.prototype = {
	//창크기 변경시 실행될 함수
	resize: function() {

		this.H = this.gameCanvas.parentElement.clientHeight;
		this.W = (this.H * 0.5);
		this.gameCanvas.parentElement.setAttribute("width", this.W + "px");
		//this.nW = this.nextCanvas.parentElement.clientWidth;
		this.nH = this.nextCanvas.parentElement.clientHeight;
		this.nW = this.nH * 0.7;
		this.nextCanvas.parentElement.setAttribute("width", this.nW + "px");
		this.gameCanvas.width = this.W;
		this.gameCanvas.height = this.H;
		this.nextCanvas.width = this.nW;
		this.nextCanvas.height = this.nH;
		this.blockWidth = this.W / this.COLS;
		this.blockHeight = this.H / this.ROWS;
	},
	//정사각형 블럭을 그려주는함수
	drawBlock: function(context, x, y) {
		context.strokeStyle = "grey";
		context.fillRect(this.blockWidth * x, this.blockHeight * y, this.blockWidth - 1, this.blockHeight - 1);
		context.strokeRect(this.blockWidth * x, this.blockHeight * y, this.blockWidth - 1, this.blockHeight - 1);
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {
		if(!this.playOn) return;
		this.gameContext.clearRect(0, 0, this.W, this.H);
		this.gameContext.font = this.blockWidth * 0.7 + "px Verdana";
		const gradient = this.gameContext.createLinearGradient(0, 0, this.W, 0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		this.gameContext.fillStyle = gradient;

		if(this.pause) {
			this.gameContext.fillText("PAUSE", this.blockWidth * 4, this.blockHeight * 10);
		}
		this.gameContext.fillText("Score  " + this.score, this.blockWidth, this.blockHeight);
		this.gameContext.fillText("Lv  " + this.currLevel, this.blockWidth * 7, this.blockHeight);
		this.gameContext.fillText("Next  -" + this.goToNextLevel, this.blockWidth * 6, this.blockHeight * 2);

		for(let x = 0; x < this.COLS; x++) {
			for(let y = 0; y < this.ROWS; y++) {
				if(this.gameBoard[y][x]) {
					this.gameContext.fillStyle = this.colors[this.gameBoard[y][x] - 1];
					this.drawBlock(this.gameContext, x, y);
				}
			}
		}

		this.gameContext.fillStyle = this.colors[this.currIdx];
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(this.curr[i]) {
				this.drawBlock(this.gameContext, this.currX + x, this.currY + y);
			}
		}

		this.nextContext.clearRect(0, 0, this.nW, this.nH);
		this.nextContext.strokeStyle = 'black';
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(this.next[i]) {
				this.nextContext.fillStyle = this.colors[this.next[i] - 1];
				this.drawBlock(this.nextContext, x + 1, y + 1);
			} 
		}
		if(this.lose) {
			this.gameContext.fillStyle = gradient;
			this.gameContext.font = this.blockWidth  + "px Verdana";
			this.gameContext.fillText("GAME OVER", this.blockWidth * 2, this.blockHeight * 10);
			this.nextContext.clearRect(0, 0, this.nW, this.nH);
		}
	},	

	// 다음블록을 현재블록에 넣어주고 다음블록을 새로 생성한다. 
	newShape: function() {
		if(this.nextIdx !== null) {
			this.curr = this.next;
			this.currIdx = this.nextIdx;
			this.nextIdx = Math.floor(Math.random() * this.shapes.length);
		}else{
			this.currIdx = Math.floor(Math.random() * this.shapes.length);
			let currShape = this.shapes[this.currIdx][0].split("");
			currShape = currShape.map(function(val){
				return Number(val);
			});
			this.curr = currShape.map(function(val){
				return val === 0 ? val : (val + this.currIdx);
			}.bind(this));
			this.nextIdx = Math.floor(Math.random() * this.shapes.length);
		}
		let nextShape = this.shapes[this.nextIdx][0].split("");
		nextShape = nextShape.map(function(val){
			return Number(val);
		});
		this.next = nextShape.map(function(val){
			return val === 0 ? val : (val + this.nextIdx);
		}.bind(this));
		this.currRotateIdx = 0;
		this.currX = 5;
		this.currY = 0;
	},

	//캔버스의 2d컨텍스트의 초기화
	init: function() {
		for(let y = 0; y < this.ROWS; y++) {
			this.gameBoard[y] = [];
			for(let x = 0; x < this.COLS; x++) {
				this.gameBoard[y][x] = 0;
			}
		}
		this.currLevel = 1;
		this.goToNextLevel = 10;
		this.score = 0;
	},

	//재귀호출되면서 게임진행을 해주는 함수
	tick: function() {
		if(this.valid(0,1)) {
			this.currY++;
		}else{
			this.freeze();
			this.clearLines();
			if(this.lose) {
				this.render();
				clearInterval(this.interval);
				clearInterval(this.renderInterval);
				this.postScore();
				util.sendAjax("GET", "/game/" + 10, null, "application/json", function () {
					rankResister.ajaxResponseHandler(rankResister.verifier.bind(rankResister), this.responseText);
    			});
				util.$(".ranking").scrollTop = 0;
				this.playOn = false;
				return false;
			}
			if(this.goToNextLevel <= 0 && this.currLevel <= 10) {
				clearInterval(this.interval);
				this.goToNextLevel = 10;
				this.currLevel++;
				this.interval = setInterval(this.tick.bind(this), this.ms - 20 * this.currLevel);
			} 
			this.newShape();
		}
	},

	//내려오던 블럭이 바닥이나 이미 정지해 있는 블럭과 닿으면 정지시켜줌
	freeze: function() {
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(this.curr[i]) {
				this.gameBoard[y + this.currY][x + this.currX] = this.curr[i];
			}
		}
	},

	//현재 블럭을 회전시켜주는 함수
	rotate: function() {
		if(this.shapes[this.currIdx][this.currRotateIdx + 1]) {
			this.currRotateIdx++;
		}else{
			this.currRotateIdx = 0;
		}
		/*split 전까지 변수로 담아서 사용할것
		map에서 리턴되는 값이 NaN이 나옴 
		-> map의 콜백에서의 this를 bind해줌으로 해결
		*/ 
		let newCurr = this.shapes[this.currIdx][this.currRotateIdx].split("");
		newCurr = newCurr.map(function(val){
			return Number(val) === 0 ? Number(val) : (Number(val) + this.currIdx);
		}.bind(this));
		return newCurr;
	},

	//열이 블럭으로 가득차면 지워주는 함수
	clearLines: function() {
		for(let y = this.ROWS - 1; y >= 0; y--) {
			let filled = true;
			for(let x = 0; x < this.COLS; x++) {
				if(this.gameBoard[y][x] === 0) {
					filled = false;
					break;
				}
			}
			if(filled) {
				this.score++;
				if(this.currLevel !== 10) {
					this.goToNextLevel--;
				}
				for(let i = y; i > 0; i--) {
					for(let x = 0; x < this.COLS; x++) {
						this.gameBoard[i][x] = this.gameBoard[i - 1][x];
					}
				}
				y++;
			}
		}

		
	},

	//키입력에 따라 현재블럭을 이동시켜주는 함수
	keyPress: function(key) {
		if(key !== "pause" && this.pause === true) return;
 		switch(key) {
			case 'left':
				//valid(-1)은 현재블럭의 왼쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(-1)) {
					this.currX--;
				}
				break;
			case 'right':
				//valid(1)은 현재블럭의 오른쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(1)) {
					this.currX++;
				}
				break;
			case 'down':
				//valid(0, 1)은 현재블럭의 아래쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(0, 1)) {
					this.currY++;
				}
				break;
			case 'powerDown':
				//case 'down'에서 if를 while로 변경해서 바로 이동가능한 만큼 아래로 이동시킴
				while(this.valid(0, 1)) {
					this.currY++;
				}
				break;
			case 'rotate':
				const rotated = this.rotate();
				if(this.valid(0, 0, rotated)) {
					this.curr = rotated;
				}
				break;
			case 'pause':
				if(this.pause === false) {
					clearInterval(this.interval);
					clearInterval(this.renderInterval);	
				}else{
					this.interval = setInterval(this.tick.bind(this), this.ms - (20 * this.currLevel));
					this.renderInterval = setInterval(this.render.bind(this), 30);
				}
				this.pause = !this.pause;

				break;
		}
	},

	/*블럭이 이동할수 있는지 검사해주는 함수

	*/
	valid: function(offsetX, offsetY, newCurr) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		offsetX += this.currX;
		offsetY += this.currY;
		newCurr = newCurr || this.curr;

		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			//중첩된 if 문은 제거 할 수 있다. valid는 분리해봐야 할 듯. Qunit을 통한 test code로 리팩토링.
			if(newCurr[i]) {
				if(typeof this.gameBoard[y + offsetY] === "undefined"
				|| typeof this.gameBoard[y + offsetY][x + offsetX] === "undefined"
				|| this.gameBoard[y + offsetY][x + offsetX]
				|| x + offsetX < 0
				|| y + offsetY >= this.ROWS
				|| x + offsetX >= this.COLS ) {
					if(x + offsetX > 0 && x + offsetX < this.COLS && offsetY === 1) {
						this.lose = true;
					}
					return false;
				}
			}
		}
		return true;
	},

	//게임을 시작할때 호출할 함수
	newGame: function() {	
		this.playOn = true;
		this.init();
		this.newShape();
		clearInterval(this.interval);
		clearInterval(this.renderInterval);
		this.pause = false;
		this.lose = false;
		this.interval = setInterval(this.tick.bind(this), this.ms);
		this.renderInterval = setInterval(this.render.bind(this), 30);

	},

	//점수를 db에 등록
	postScore: function() {
		let data = {
			uid:util.$(".user-id a").innerText,
			score:this.score
		};
		console.log(data);
		util.sendAjax("POST", "/score", data, "application/json", function(){
			return;
		});
	},
	//이벤트 등록
	addEvent: function() {
		const that = this;
		const keys = {
			37: 'left',
			39: 'right',
			40: 'down',
			38: 'rotate',
			32: 'powerDown',
			27: 'pause'
		};
		document.addEventListener("keydown", function(evt){
			if(typeof keys[evt.keyCode] !== 'undefined' && (that.interval)) {
				if(that.playOn === true) evt.preventDefault();
				that.keyPress(keys[evt.keyCode]);
				that.render();
			}
		});
		this.startBtn.addEventListener("click", function(evt){
			evt.target.blur();
			that.newGame();
		});
		window.addEventListener("resize", function(){
			that.resize();
			that.render();
		});
	}
};
	
document.addEventListener("DOMContentLoaded", function(){
	//shapeMap과 data는 추후 외부 파일로 분리 할 것
	const shapeMap = [];

	/*[0]
	0000 1000 1110 0010
	0100 1100 0100 0110
	1110 1000 0000 0010
	0000 0000 0000 0000
	*/
	shapeMap[0] = [
		"0000010011100000",
		"1000110010000000",
		"1110010000000000",
		"0010011000100000"
	];
	/*[1]
	1100 0010
	0110 0110
	0000 0100
	0000 0000
	*/
	shapeMap[1] = [
		"1100011000000000",
		"0010011001000000"
	];
	/*[2]
	0110 0100
	1100 0110
	0000 0010
	0000 0000
	*/
	shapeMap[2] = [
		"0110110000000000",
		"0100011000100000"
	];
	/* [3]
	0100 0000
	0100 1111
	0100 0000
	0100 0000
	*/
	shapeMap[3] = [
		"0100010001000100",
		"0000111100000000"
	];
	/*[4] 
	1000 1110 0110 0000
	1000 1000 0010 0010
	1100 0000 0010 1110
	0000 0000 0000 0000
	*/
	shapeMap[4] = [
		"1000100011000000",
		"1110100000000000",
		"0110001000100000",
		"0000001011100000"
	];
	/*[5]
	0010 0000 1100 1110 
	0010 1000 1000 0010 
	0110 1110 1000 0000 
	0000 0000 0000 0000	
	*/
	shapeMap[5] = [
		"0010001001100000",
		"0000100011100000",
		"1100100010000000",
		"1110001000000000"
	];
	/*[6]
	1100
	1100
	0000
	0000
	*/
	shapeMap[6] = [ 
		"1100110000000000"
	];

	const data = {
		startBtn: util.$(".start"),
		gameCanvas: util.$(".game canvas"),
		nextCanvas: util.$(".next canvas"),
		userId: util.$(".user-id a").innerText,
		COLS: 10,
		ROWS: 20,
		ms: 300,
		shapes: shapeMap,
		colors: [
			"rgba(255, 0, 0, 0.6)", 
			"rgba(255, 99, 132, 0.6)", 
			"rgba(54, 162, 235, 0.6)", 
			"rgba(255, 206, 86, 0.6)", 
			"rgba(75, 192, 192, 0.6)", 
			"rgba(255, 159, 64, 0.6)", 
			"rgba(153, 102, 255, 0.6)"
		]
	};

	const tetris = new Tetris(data);
	tetris.addEvent();
});