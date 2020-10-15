document.addEventListener('keydown', function(event){
    
    console.log("Key pressed : " + event.key + " type: " + typeof event.key + " value: " + event.value);
    if (event.ctrlKey && event.key == "Backspace"){
        CS.clean();
    }
    KeyHandler(event.key);
});
//accessor variables
var KH = KeyHandler();
var CS = new CalcScripts();
var HH = new HistoryHandler();

function KeyHandler(key){
	if(!isNaN(key)){
		CS.insert(key);
	} else if (key == "("){
        CS.insert("(");
    } else if (key == ")"){
        CS.insert(")");
    }else if (key == "Backspace"){
        CS.back();
    } else {
        switch(key){
            case('+'):
                CS.insert('+');
                break;
            case('-'):
                CS.insert('-');
                break;
            case('*'):
                CS.insert('*');
                break;
            case('/'):
                CS.insert('/');
                break;
            case('.'):
                CS.insert('.');
                break;
            case("^"):
                CS.insert('^');
                break;
        }
    }
	this.AnimateKeyPressed = function(key){
        //add ripple effect or some shi
	}
}

//css scripts
function changeOpacity() {
	var slider = document.getElementById("opacity-slider");
	var calculator = document.getElementById("calculator");

	calculator.style.opacity = slider.value;
}

//calc scripts
function CalcScripts(){
	this.insert = function(num){
        document.form.textview.value = document.form.textview.value+num;
    }
    var pressed = false;
    this.brackets = function(){
        if(!pressed){
            document.form.textview.value = document.form.textview.value + "(";
            pressed = true;
            return;
        } else {
            document.form.textview.value = document.form.textview.value + ")";
            pressed = false;
            return;
        }
    }
	this.equal = function(){
		var exp = document.form.textview.value;
		if(exp){
            var ms = new MathSolver();
            var ment = ms.infixToPostfix(exp).toString().replace(/\s+/g,'').split(",");
			var result = ms.postfixEval(ment);
			console.log("postFix: " +  ment);
            console.log("result: " + result);
            if(result==null){
                alert("Enter a valid equation to solve! (Press: 'Ctrl + Backspace', to Delete Everything )")
                result = exp;
            }
			document.form.textview.value = result;
		}
	}
	this.clean = function(){
		document.form.textview.value = "";
	}
	this.back = function(){
		var exp = document.form.textview.value;
		document.form.textview.value = exp.substring(0,exp.length-1);
    }
}

function HistoryHandler(){
    this.history = [];
    this.addHistory = function(element){
        history.push();
    }
    this.deleteHistoryElement = function(element){

    } 
    this.deleteAllHistory = function(){

    }
    this.showHistory = function(){
        if(document.form.textview.value.length > 0){
            history.push(document.form.textview.value);
        }
        var count = 0;
        for(element of history){
            document.form.textview.value = element;
        }
    }
}

//required funcitons for postfix algoritm
String.prototype.isNumeric = function() {
	return !isNaN(parseFloat(this)) && isFinite(this);
}
Array.prototype.clean = function() {
	for(var i = 0; i < this.length; i++) {
		if(this[i] === "") {
			this.splice(i, 1);
		}
	}
return this;
}

function MathSolver() {
    this.infixToPostfix = function(infix) {
        var outputQueue = [];
        var operatorStack = [];
        var operators = {
            "^": {
                precedence: 4,
                associativity: "Right"
            },
            "/": {
                precedence: 3,
                associativity: "Left"
            },
            "*": {
                precedence: 3,
                associativity: "Left"
            },
            "+": {
                precedence: 2,
                associativity: "Left"
            },
            "-": {
                precedence: 2,
                associativity: "Left"
            }
        }
        infix = infix.replace(/\s+/g, "");
		infix = infix.split(/([\+\-\*\/\^\(\)])/).clean();
        for(var i = 0; i < infix.length; i++) {
			console.log(operatorStack[i]);
            var token = infix[i];
            if(token.isNumeric() || token === ".") {
                outputQueue.push(token);
            } else if("^*/+-".indexOf(token) !== -1) {
                var o1 = token;
                var o2 = operatorStack[operatorStack.length - 1];
                while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop();
                    o2 = operatorStack[operatorStack.length - 1];
                }
				operatorStack.push(o1);
            } else if(token === "(") {
                operatorStack.push(token);
            } else if(token === ")") {
                while(operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop();
            }
        }
        while(operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop() + " ");
        }
        return outputQueue;
	}
	this.postfixEval = function(postfixArray){
		var stack = [];
        console.log(typeof postfixArray)
        for( element of postfixArray){
            console.log("element: " + element +  " | type:" + typeof element);

            if(isNaN(element)){
                var x = stack.pop();
                var y = stack.pop();
                console.log("var x/y: " + x + " " + y + " element: " + element) ;
                switch(element){
                    case('+'):
                        stack.push(y + x);
                        break;
                    case('-'):
                        stack.push(y - x);
                        break;
                    case('*'):
                        stack.push(y * x);
                        break;
                    case('/'):
                        stack.push(y / x);
                        break;
                    case("^"):
                        stack.push(Math.pow(y , x));
                        break;
                }
            } else {
                stack.push( parseFloat(element) );
            }
        }
        //final check for non numbers within the stack
        var returnValue = null;
        while( stack.length > 0 ){
            console.log( stack );
            var element = stack.pop(); 
            if(isNaN(element)){
                continue;
            } else{
                returnValue = element;
            }
        }
        return returnValue;
	}
}
