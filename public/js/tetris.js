var tetris = {};

tetris.model = {
	gameCanvas: document.querySelector(".game"),
	gameContext: this.gameCanvas.getContext("2d"),
	W: gameCanvas.width,
	H: gameCanvas.height,
	COLS: 10,
	ROWS: 20,
	bWidth: this.W / this.COLS,
	bHeight: this.H / this.ROWS

};

tetris.render = {

	//정사각형 블럭을 그려주는함수
	drawBlock: function(context, x, y) {
		var width = this.model.W / this.model.COLS;
		var height = this.model.H / this.model.ROWS;

		context.fillRect(width * x, height * y, width - 1, height - 1);
		context.strokeRect(width * x, height * y, width - 1, height - 1);
	},

	//drawBlock함수를 이용해 캔버스에 그려주는 함수
	render: function() {

	}
};

tetris.game = {

	//새 블록을 만든다
	newShape: function() {

	},

	//캔버스의 2d컨텍스트의 초기화
	init: function() {

	},

	//재귀호출되면서 게임진행을 해주는 함수
	tick: function() {

	},

	//내려오던 블럭이 바닥이나 이미 정지해 있는 블럭과 닿으면 정지시켜줌
	freeze: function() {

	},

	//현재 블럭을 회전시켜주는 함수
	rotate: function() {

	},

	//열이 블럭으로 가득차면 지워주는 함수
	clearLines: function() {

	},

	//키입력에 현재블럭을 이동시켜주는 함수
	keyPress: function(key) {

	},

	//블럭이 이동할수 있는지 검사해주는 함수
	valid: function() {

	},

	//게임을 시작할때 호출할 함수
	newGame: function() {

	}

};

