/*Qunit을 통한 테스트 가능한 코드로 리팩토링 
-현재 코드에서 테스트코드를 짜기에는 좀 무리가 있어보임
setInterval보다는 setTimeout이나 requestAnimationFrame을 사용할 것
-setTimeout으로 변경완료
*/
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
	this.curr = null;
	this.next = null;
	this.currIdx = null;
	this.nextIdx = null;
	this.currRotateIdx = null;
	this.pause = true;	
	this.currX = null;
	this.currY = null;
	this.playOn = false;
	this.preventKey = false;
}

Tetris.prototype = {

	//창크기 변경시 실행될 함수
	resize: function() {
		this.H = this.gameCanvas.parentElement.clientHeight;
		this.W = (this.H * 0.5);
		this.gameCanvas.parentElement.setAttribute("width", this.W + "px");
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

	//캔버스 text의 gradient값 설정
	setGradient: function() {
		const gradient = this.gameContext.createLinearGradient(0, 0, this.W, 0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		this.gameContext.fillStyle = gradient;
		return gradient;
	},

	//점수 레벨 남은블록 일시정지 텍스트 표시
	renderScoreLv: function() {
		this.gameContext.font = this.blockWidth * 0.7 + "px Verdana";

		if(this.pause) {
			this.gameContext.fillText("PAUSE", this.blockWidth * 4, this.blockHeight * 10);
		}
		this.gameContext.fillText("Score  " + this.score, this.blockWidth, this.blockHeight);
		this.gameContext.fillText("Lv  " + this.currLevel, this.blockWidth * 7, this.blockHeight);
		this.gameContext.fillText("Next  -" + this.goToNextLevel, this.blockWidth * 6, this.blockHeight * 2);

	},
	
	//다음블럭 표시
	renderNext: function() {
		this.nextContext.clearRect(0, 0, this.nW, this.nH);
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(this.next[i]) {
				this.nextContext.fillStyle = this.colors[this.next[i] - 1];
				this.drawBlock(this.nextContext, x + 1, y + 1);
			} 
		}
	},
	
	//게임오버 메시지 표시
	renderGameOver: function(gradient) {
		if(this.lose) {
			this.gameContext.fillStyle = gradient;
			this.gameContext.font = this.blockWidth  + "px Verdana";
			this.gameContext.fillText("GAME OVER", this.blockWidth * 2, this.blockHeight * 10);
			this.nextContext.clearRect(0, 0, this.nW, this.nH);
		}
	},

	//현재블럭을 제외한 이미고정된 블럭 표시
	renderBoard: function() {
		for(let x = 0; x < this.COLS; x++) {
			for(let y = 0; y < this.ROWS; y++) {
				if(this.gameBoard[y][x]) {
					this.gameContext.fillStyle = this.colors[this.gameBoard[y][x] - 1];
					this.drawBlock(this.gameContext, x, y);
				}
			}
		}
	},
	
	//현재블럭표시
	renderCurr: function() {
		this.gameContext.fillStyle = this.colors[this.currIdx];
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(this.curr[i]) {
				this.drawBlock(this.gameContext, this.currX + x, this.currY + y);
			}
		}
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {
		if(!this.playOn) return;
		this.gameContext.clearRect(0, 0, this.W, this.H);
		const gradient = this.setGradient();
		this.renderScoreLv();
		this.renderBoard();
		this.renderCurr();
		this.renderNext();
		this.renderGameOver(gradient);
		//아래코드는 뭔가 생각대로 작동이 안된다 
		requestAnimationFrame(this.render);
	},	

	// 다음블록을 현재블록에 넣어주고 다음블록을 새로 생성한다. 
	newShape: function() {
		this.currRotateIdx = 0;
		if(this.nextIdx !== null) {
			this.curr = this.next;
			this.currIdx = this.nextIdx;
			this.nextIdx = Math.floor(Math.random() * this.shapes.length);
		}else{
			this.currIdx = Math.floor(Math.random() * this.shapes.length);
			this.curr = this.shapes[this.currIdx][this.currRotateIdx];
			this.nextIdx = Math.floor(Math.random() * this.shapes.length);
		}
		this.next = this.shapes[this.nextIdx][0];
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
		if(this.pause || !this.playOn) return;
		if(this.valid(0,1)) {
			this.currY++;
		}else{
			this.freeze();
			this.clearLines();
			if(this.lose) {
				this.render();
				clearTimeout(this.interval);
				if(this.score !== 0) this.postScore();
				rankResister.renderRank();
				util.$(".ranking").scrollTop = 0;
				this.playOn = false;
				return false;
			}
			if(this.goToNextLevel <= 0 && this.currLevel <= 10) {
				this.goToNextLevel = 10;
				this.currLevel++;
			} 
			this.newShape();
		}
		this.render();
		this.interval = setTimeout(this.tick.bind(this), this.ms - (20 * (this.currLevel - 1)));
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
		this.preventKey = false;
	},

	//현재 블럭을 회전시켜주는 함수
	rotate: function() {
		this.shapes[this.currIdx][this.currRotateIdx + 1] ? this.currRotateIdx++ : this.currRotateIdx = 0;
		/*
		if(this.shapes[this.currIdx][this.currRotateIdx + 1]) {
			this.currRotateIdx++;
		}else{
			this.currRotateIdx = 0;
		}
		*/
		return this.shapes[this.currIdx][this.currRotateIdx];
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
		if(key !== "pause" && this.pause === true || this.preventKey === true) return;
 		switch(key) {
			case "left":
				//valid(-1)은 현재블럭의 왼쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(-1)) {
					this.currX--;
				}
				break;
			case "right":
				//valid(1)은 현재블럭의 오른쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(1)) {
					this.currX++;
				}
				break;
			case "down":
				//valid(0, 1)은 현재블럭의 아래쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(0, 1)) {
					this.currY++;
				}
				break;
			case "powerDown":
				//case 'down'에서 if를 while로 변경해서 바로 이동가능한 만큼 아래로 이동시킴
				while(this.valid(0, 1)) {
					this.currY++;
				}
				//블럭이 바닥에 닿기 직전 키입력에 의해 움직이는것을 막기위한 변수
				this.preventKey = true;
				break;
			case "rotate":
				const tempIdx = this.currRotateIdx;
				const rotated = this.rotate();
				if(this.valid(0, 0, rotated)) {
					this.curr = rotated;
				}else {
					this.currRotateIdx = tempIdx;
				}
				break;
			case "pause":
				this.pause = !this.pause;
				if(this.pause === true) {
					clearTimeout(this.interval);
				}else{
					this.tick();
				}
				break;
		}
	},

	//블럭이동가능, 회전가능한지 유효성 검사 게임오버 검사
	valid: function(offsetX, offsetY, newCurr) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		offsetX += this.currX;
		offsetY += this.currY;
		newCurr = newCurr || this.curr;

		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
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
		clearTimeout(this.interval);
		this.pause = false;
		this.lose = false;
		this.tick();
		this.render();
	},

	//점수를 db에 등록
	postScore: function() {
		let data = {
			uid:rankResister.uid(),
			score:this.score
		};
		data = JSON.stringify(data);
		util.sendAjax("POST", "/score", data, "application/json", function(){
			return;
		});
	},

	//이벤트 등록
	addEvent: function() {
		const that = this;
		const keys = {
			37: "left",
			39: "right",
			40: "down",
			38: "rotate",
			32: "powerDown",
			27: "pause"
		};
		document.addEventListener("keydown", function(evt){
			if(typeof keys[evt.keyCode] !== "undefined") {
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
	/*
	shapeMap과 data는 추후 외부 파일로 분리 할 것
	shapeMap분리완료, data안의 property들이 DOM탐색이 필요한 요소들이
	있어서 data는 그대로둠
	DOMContentLoaded부분을 따로 js파일 만들어서 분리시켜야 할듯한데
	팀원과 조율이 필요할듯
	*/
	const data = {
		startBtn: util.$(".start"),
		gameCanvas: util.$(".game canvas"),
		nextCanvas: util.$(".next canvas"),
		COLS: 10,
		ROWS: 20,
		ms: 300,
		//shapes는 shapeMap.js 에서 가져옴
		shapes: shapes,
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