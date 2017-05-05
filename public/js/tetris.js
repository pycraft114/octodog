
const tetris = {};

tetris.model = {
	setData: function() {
		this.gameContext = this.gameCanvas.getContext("2d");
		this.nextContext = this.nextCanvas.getContext("2d");
		this.W = this.gameCanvas.clientWidth;
		this.H = this.gameCanvas.clientHeight;
		this.nW = this.nextCanvas.clientWidth;
		this.nH = this.nextCanvas.clientHeight;
		/*
		this.W = parseInt(window.getComputedStyle(this.gameCanvas).width);
		this.H = parseInt(window.getComputedStyle(this.gameCanvas).height);
		this.nW = parseInt(window.getComputedStyle(this.nextCanvas).width);
		this.nH = parseInt(window.getComputedStyle(this.nextCanvas).height);
		*/
		this.blockWidth = this.W / this.COLS;
		this.blockHeight = this.H / this.ROWS;
	},
	gameContext: null,
	nextContext: null,
	gameBoard:[],
	nextBoard:[],
	score: null,
	goToNextLevel: null,
	lose: false,
	interval: null,
	renderInterval: null,
	curr: null,
	next: null,
	currIdx: null,
	currRotate: null,
	nextIdx: null,
	currX: null,
	currY: null,
	shapes:[],
	colors:[],
	ms:null,
	pause: true
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
		context.strokeStyle = "grey";
		context.fillRect(m.blockWidth * x, m.blockHeight * y, m.blockWidth - 1, m.blockHeight - 1);
		context.strokeRect(m.blockWidth * x, m.blockHeight * y, m.blockWidthh - 1, m.blockHeight - 1);
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {
		const m = this.model;
		m.gameContext.clearRect(0, 0, m.W, m.H);
		m.gameContext.font = "25px Verdana";
		const gradient = m.gameContext.createLinearGradient(0, 0, m.W, 0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		m.gameContext.fillStyle = gradient;
		if(m.lose) {
			m.gameContext.font = "40px Verdana";
			m.gameContext.fillText("GAME OVER", m.blockWidth, m.blockHeight * 10);
			return;
		}
		if(m.pause) {
			m.gameContext.fillText("PAUSE", m.blockWidth * 3, m.blockHeight * 10);
		}
		m.gameContext.fillText("Score  " + m.score.toString(), m.blockWidth, m.blockHeight);

		for(let x = 0; x < m.COLS; x++) {
			for(let y = 0; y < m.ROWS; y++) {
				if(m.gameBoard[y][x]) {
					m.gameContext.fillStyle = m.colors[m.gameBoard[y][x] - 1];
					this.drawBlock(m.gameContext, x, y);
				}
			}
		}

		m.gameContext.fillStyle = m.colors[m.currIdx];
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(m.curr[i]) {
				this.drawBlock(m.gameContext, m.currX + x, m.currY + y);
			}
		}

		m.nextContext.clearRect(0, 0, m.nW, m.nH);
		m.nextContext.strokeStyle = 'black';
		for(let i = 0; i < 16; i++) {
			const x = i % 4;
			const y = (i - x) / 4;
			if(m.next[i]) {
				m.nextContext.fillStyle = m.colors[m.next[i] - 1];
				this.drawBlock(m.nextContext, x + 1, y + 1);
			} 
		}
		
	},	

	// 다음블록을 현재블록에 넣어주고 다음블록을 새로 생성한다. 
	newShape: function() {
		const m = this.model;
		if(m.nextIdx !== null) {
			m.curr = m.next;
			m.currIdx = m.nextIdx;
			m.nextIdx = Math.floor(Math.random() * m.shapes.length);
		}else{
			m.currIdx = Math.floor(Math.random() * m.shapes.length);
			m.curr = m.shapes[m.currIdx][0].split("").map(function(v){
				return Number(v) === 0 ? Number(v) : Number(v) + m.currIdx;
			});
			m.nextIdx = Math.floor(Math.random() * m.shapes.length);
		}
		m.next = m.shapes[m.nextIdx][0].split("").map(function(v){
			return Number(v) === 0 ? Number(v) : Number(v) + m.nextIdx;
		});
		m.currX = 5;
		m.currY = 0;
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
		const m = this.model;
		if(this.valid(0,1)) {
			m.currY++;
		}else{
			this.freeze();
			this.clearLines();
			if(m.lose) {
				clearInterval(m.interval);
				clearInterval(m.renderInterval);
				return false;
			} 
			this.newShape();
		}
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
		if(m.shapes[m.currIdx][m.currRotate + 1]) {
			m.currRotate++;
		}else{
			m.currRotate = 0;
		}
		const newCurr = m.shapes[m.currIdx][m.currRotate].split('').map(function(v){
			return Number(v) === 0 ? Number(v) : Number(v) + m.currIdx;
		})
		return newCurr;
	},

	//열이 블럭으로 가득차면 지워주는 함수
	clearLines: function() {
		const m = this.model;
		for(let y = m.ROWS - 1; y >= 0; y--) {
			let filled = true;
			for(let x = 0; x < m.COLS; x++) {
				if(m.gameBoard[y][x] === 0) {
					filled = false;
					break;
				}
			}
			if(filled) {
				m.score++;
				for(let i = y; i > 0; i--) {
					for(let x = 0; x < m.COLS; x++) {
						m.gameBoard[i][x] = m.gameBoard[i - 1][x];
					}
				}
				y++;
			}
		}

		
	},

	//키입력에 따라 현재블럭을 이동시켜주는 함수
	keyPress: function(key) {
		const m = this.model;
		if(key !== "pause" && m.pause === true) return;
 		switch(key) {
			case 'left':
				//valid(-1)은 현재블럭의 왼쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(-1)) {
					m.currX--;
				}
				break;
			case 'right':
				//valid(1)은 현재블럭의 오른쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(1)) {
					m.currX++;
				}
				break;
			case 'down':
				//valid(0, 1)은 현재블럭의 아래쪽이 비었으면 true 아니면 false를 반환
				if(this.valid(0, 1)) {
					m.currY++;
				}
				break;
			case 'powerDown':
				//case 'down'에서 if를 while로 변경해서 바로 이동가능한 만큼 아래로 이동시킴
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
					clearInterval(m.interval);
					clearInterval(m.renderInterval);
					//아래 코드들은 작동이 안된다 왜일까
					m.gameContext.clearRect(0, 0, m.W, m.H);
					m.gameContext.fillText("Pause", 80, 40);
				}else{
					m.interval = setInterval(this.tick.bind(this), m.ms);
					m.renderInterval = setInterval(this.render.bind(this), 30);
				}
				m.pause = !m.pause;
				break;
		}
	},

	/*블럭이 이동할수 있는지 검사해주는 함수

	*/
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
			/*
			if(newCurr[i]) {
				if(typeof m.gameBoard[y + offsetY] === "undefined"
				|| m.gameBoard[y + offsetY][x + offsetX]
				|| x + offsetX < 0
				|| y + offsetY >= m.ROWS
				|| x + offsetX >= m.COLS ) {
					return false;
				}
				if(typeof m.gameBoard[y + offsetY][x + offsetX] === "undefined") {
					if(x + offsetX > 0 && x + offsetX < m.COLS && offsetY === 1) {
						m.lose = true;
					}
					return false;
				}
				
				*/
			if(newCurr[i]) {
				if(typeof m.gameBoard[y + offsetY] === "undefined"
				|| typeof m.gameBoard[y + offsetY][x + offsetX] === "undefined"
				|| m.gameBoard[y + offsetY][x + offsetX]
				|| x + offsetX < 0
				|| y + offsetY >= m.ROWS
				|| x + offsetX >= m.COLS ) {
					if(x + offsetX > 0 && x + offsetX < m.COLS && offsetY === 1) {
						m.lose = true;
					}
					return false;
				}
			}
		}
		return true;
	},

	//게임을 시작할때 호출할 함수
	newGame: function() {
		const m = this.model;	
		this.init();
		this.newShape();
		clearInterval(m.interval);
		clearInterval(m.renderInterval);
		m.pause = false;
		m.lose = false;
		m.interval = setInterval(this.tick.bind(this), m.ms);
		m.renderInterval = setInterval(this.render.bind(this), 30);
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
			if(typeof keys[evt.keyCode] !== 'undefined' && (this.model.interval)) {
				this.keyPress(keys[evt.keyCode]);
				this.render();
			}
		}.bind(that));
		this.model.startBtn.addEventListener("click", function(evt){
			evt.target.blur();
			this.newGame();
		}.bind(that));
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
	0110 1110 0000 1000
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

	const data = {
		startBtn: document.querySelector(".start"),
		gameCanvas: document.querySelector(".game"),
		nextCanvas: document.querySelector(".next"),
		COLS: 10,
		ROWS: 20,
		ms: 300,
		shapes: shapeMap,
		colors: ["rgba(255, 0, 0, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)", "rgba(75, 192, 192, 0.6)", "rgba(255, 159, 64, 0.6)", "rgba(153, 102, 255, 0.6)"]
	};

	const model = Object.assign(Object.create(tetris.model), data);
	model.setData();
/*
	var render = Object.assign({},Object.create(tetris.render));
	render.model = model;
*/
	const game = Object.create(tetris.game);
	game.model = model;
	game.addEvent();
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
