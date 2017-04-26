document.addEventListener("DOMContentLoaded", function(){
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
	1100 1000 0010 1110
	0000 0000 0000 0000
	*/
	shapeMap[4] = [
		"1000100011000000",
		"1110100000000000",
		"0110001000100000",
		"0000001011100000"
	];
	/*[5]
	0010 0000 1110 1100
	0010 1000 0010 1000
	0110 1110 0010 1000
	0000 0000 0000 0000	
	*/
	shapeMap[5] = [
		"0010001001100000",
		"0000100011100000",
		"1110001000000000",
		"1100100010000000"
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

	const model = Object.assign({},Object.create(tetris.model),{
		startBtn: document.querySelector(".start"),
		gameCanvas: document.querySelector(".game"),
		viewCanvas: document.querySelector(".view"),
		COLS: 10,
		ROWS: 20,
		ms: 300,
		shapes: shapeMap,
		colors: ["red", "orange", "yellow", "green", "blue", "navy", "purple"]
	});

/*
	var render = Object.assign({},Object.create(tetris.render));
	render.model = model;
*/
	const game = Object.assign({}, Object.create(tetris.game));
	game.model = model;

/*
	var controller = Object.assign({},Object.create(tetris.controller), {
		keys: {
			27: 'pause',
			37: 'left',
			39: 'right',
			40: 'down',
			32: 'powerDown',
			38: 'rotate'
		}
	});
*/
});

const tetris = {};

tetris.model = {
	gameCanvas,
	gameContext: this.gameCanvas.getContext("2d"),
	gameBoard:[],
	viewCanvas,
	viewContext: this.viewCanvas.getContext("2d"),
	W: gameCanvas.width,
	H: gameCanvas.height,
	COLS,
	ROWS,
	blockWidth: this.W / this.COLS,
	blockHeight: this.H / this.ROWS,
	score,
	goToNextLevel:0,
	lose,
	interval,
	curr,
	currIdx,
	currRotate,
	nextIdx,
	currX,
	currY,
	shapes,
	colors,
	ms
};

/*
tetris.render = {
	//정사각형 블럭을 그려주는함수
	drawBlock: function(context, x, y) {
		var m = this.model;
		context.fillRect(m.blockWidth * x, m.blockHeight * y, m.blockWidth - 1, m.blockHeight - 1);
		context.strokeRect(m.blockWidth * x, m.blockHeight * y, m.blockWidthh - 1, m.blockHeight - 1);
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {

	}
};
*/

tetris.game = {
	//정사각형 블럭을 그려주는함수
	drawBlock: function(context, x, y) {
		const m = this.model;
		context.fillRect(m.blockWidth * x, m.blockHeight * y, m.blockWidth - 1, m.blockHeight - 1);
		context.strokeRect(m.blockWidth * x, m.blockHeight * y, m.blockWidthh - 1, m.blockHeight - 1);
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {

	},	
	//새 블록을 만든다
	newShape: function() {

	},

	//캔버스의 2d컨텍스트의 초기화
	init: function() {
		const m = this.model;
		for(let y = 0; y < m.ROWS; y++) {
			m.gameBoard[y] = [];
			for(let x = 0; x < m.COLS; x++) {
				m.gameBoard[y][x] = 0;
			}
		}
		m.score = 0;
	},

	//재귀호출되면서 게임진행을 해주는 함수
	tick: function() {

	},

	//내려오던 블럭이 바닥이나 이미 정지해 있는 블럭과 닿으면 정지시켜줌
	freeze: function() {
		const m = this.model;
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(m.curr[i]) {
				m.gameBoard[y + m.currY][x + m.currX] = m.curr[i];
			}
		}
	},

	//현재 블럭을 회전시켜주는 함수
	rotate: function() {
		const m = this.model;
		if(m.shapeMap[m.currIdx][m.currRotate + 1]) {
			m.currRotate++;
		}else{
			m.currRotate = 0;
		}
		const newCurr = shapeMap[m.currIdx][m.currRotate].split('').map(function(v){
			return Number(v) === 0 ? Number(v) : Number(v) + m.currIdx;
		})
		return newCurr;
	},

	//열이 블럭으로 가득차면 지워주는 함수
	clearLines: function() {

	},

	//키입력에 따라 현재블럭을 이동시켜주는 함수
	keyPress: function(key) {
		const m = this.model;
		switch(key) {
			case 'left':
				if(this.valid(-1)) {
					m.currX--;
				}
				break;
			case 'right':
				if(this.valid(1)) {
					m.currX++;
				}
				break;
			case 'down':
				if(this.valid(0, 1)) {
					m.currY++;
				}
				break;
			case 'powerDown':
				while(this.valid(0, 1)) {
					m.currY++;
				}
				break;
			case 'rotate':
				const rotated = this.rotate();
				if(this.valid(0, 0, rotated)) {
					m.curr = rotated;
				}
				break;
			case 'pause':
				if(m.pause === false) {
					m.interval = setInterval(this.tick, m.ms);
				}
				m.pause = !m.pause;
				break;
		}
	},

	//블럭이 이동할수 있는지 검사해주는 함수
	valid: function(offsetX, offsetY, newCurr) {
		const m = this.model;
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		offsetX += m.currX;
		offsetY += m.currY;
		newCurr = newCurr || m.curr;

		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(newCurr[i]) {
				if(typeof m.board[y + offsetY] === "undefined"
				|| m.board[y + offsetY][x + offsetX]
				|| x + offsetX < 0
				|| y + offsetY >= m.ROWS
				|| x + offsetX >= m.COLS ) {
					return false;
				}
				if(typeof m.board[y + offsetY][x + offsetX] === "undefined") {
					if(x + offsetX > 0 && x + offsetX < COLS && offsetY === 1) {
						m.lose = true;
					}
					return false;
				}
			}
		}
	},

	//게임을 시작할때 호출할 함수
	newGame: function() {
		const m = this.model;
		clearInterval(m.interval);
		this.init();
		this.newShape();
		m.lose = false;
		m.interval = setInterval(this.tick, m.ms);
	},

	//이벤트 등록
	addEvent: function() {
		const keys = {
			37: 'left',
			39: 'right',
			40: 'down',
			38: 'rotate',
			32: 'powerDown',
			27: 'pause'
		};
		document.addEventListener("onkeydown", function(evt){
			if(typeof kyes[evt.keyCode] !== 'undefined') {
				this.keyPress(keys[evt.keyCode]);
				this.render();
			}
		}.bind(this));
		this.model.startBtn.addEventListener("click", function(){
			this.newGame();
		});
	}

};

/*
tetris.controller = {

	addEvent: function() {
		document.body.addEventListener(function(evt){
			if( typeof this.keys[evt.keyCode] !== "undefinded") {
				//키눌러졌을때 작동할 함수호출
				//render함수호출 
				// 아무래도 옵저버 패턴을 써야 할듯?
			}
		})
	}
};
*/
