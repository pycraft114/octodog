function merge(arr1,arr2){
    let length;
    let returnArray = [];
    if(arr1.length > arr2.length){length = arr1.length}
    else{length = arr2.length}
    for(let i = 0; i < length; i ++){
        returnArray.push(returnSmall(arr1[i],arr2[i]))
    }
}

function returnSmall(num1,num2){
    if(num1 >= num2){return num2}
    else{return num1}
}

console.log((2+3)/2);