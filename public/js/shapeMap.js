const shapes = function() {
	const shapeMap = [];
	/*[0]
	0100 0100 0000 0100
	1110 0110 1110 1100
	0000 0100 0100 0100
	0000 0000 0000 0000

	0000 1000 1110 0010
	0100 1100 0100 0110
	1110 1000 0000 0010
	0000 0000 0000 0000
	*/
	shapeMap[0] = [
		/*
		"0000010011100000",
		"1000110010000000",
		"1110010000000000",
		"0010011000100000"
		*/
		"0100111000000000",
		"0100011001000000",
		"0000111001000000",
		"0100110001000000"
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
	0100 0000 1100 0010
	0100 1110 0100 1110 
	0110 1000 0100 0000
	0000 0000 0000 0000

	1000 1110 0110 0000
	1000 1000 0010 0010
	1100 0000 0010 1110
	0000 0000 0000 0000
	*/
	shapeMap[4] = [
		/*
		"1000100011000000",
		"1110100000000000",
		"0110001000100000",
		"0000001011100000"
		*/
		"0100010001100000",
		"0000111010000000",
		"1100010001000000",
		"0010111000000000"
	];
	/*[5]
	0100 1000 0110 0000
	0100 1110 0100 1110
	1100 0000 0100 0010
	0000 0000 0000 0000

	0010 0000 1100 1110 
	0010 1000 1000 0010 
	0110 1110 1000 0000 
	0000 0000 0000 0000	
	*/
	shapeMap[5] = [
		/*
		"0010001001100000",
		"0000100011100000",
		"1100100010000000",
		"1110001000000000"
		*/
		"0100010011000000",
		"1000111000000000",
		"0110010001000000",
		"0000111000100000"
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
	const result = [];
	shapeMap.forEach(function(strArr, idx){
		result[idx] = [];
		strArr.forEach(function(str){
			const numArr = str.split("").map(function(cha){
				return cha === "0" ? 0 : idx + 1;
			});
			result[idx].push(numArr);
		});
	});
	return result;
}();