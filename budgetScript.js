var budgetController = (function(){

   var Expense = function(id,description,value){
	   this.id = id;
	   this.description = description;
	   this.value = value;
   };
   
    var Income = function(id,description,value){
	   this.id = id;
	   this.description = description;
	   this.value = value;
   };
   
   var calculateTotal = function(type){
	   var sum=0;
	   data.allItems[type].forEach(function(cur){
		   sum= sum+cur.value;
	   });
	   data.totals[type] = sum;
   };
   var data ={
	   allItems:{
		   exp: [],
		   inc: []
	   },
	   totals: {
		   exp: 0,
		   inc: 0
	   },
	   budget : 0
   };
   
   return {
	   addItem: function(type,des,val){
		   var newItem,ID;
		   
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id+1;
			}else {
				ID = 0;
			}
		   if(type === 'exp'){
			   newItem = new Expense(ID,des,val);
		   }else if( type === 'inc' ){
			   newItem = new Income(ID,des,val);
		   }
		   
		   data.allItems[type].push(newItem);
		   return newItem;
	   },
	   
	   testing: function(){
		   console.log(data);
	   },
	   
	   calculateBudget: function(){
		   //calculate total income and expense
		   calculateTotal('exp');
		   calculateTotal('inc');
		   
		   //calculate the budget: income-expenses
		   data.budget = data.totals.inc - data.totals.exp;
		 
	   },
	   
	   getBudget: function(){
		   return{
			   budget: data.budget,
			   totalInc: data.totals.inc,
			   totalExp: data.totals.exp
		   };
	   }
   }
})();

//UI CONTROLLER
var UIController = (function(){

     return{
		 getinput: function(){
			 return{
				 type: document.getElementById("opr").value,
				 description: document.getElementById("desc").value,
				 value: parseFloat(document.getElementById("val").value)
			 }
		 },
		 
		 addListItem: function(obj, type){
			 var html,newHtml,element;
			 //Create HTML string with placeholder text
			 
			 if(type === 'inc'){
				 element = '.income_list'
				 html = '<div class="item clearfix" id="income-%id%"><div style="display: inline-block; margin:10px;">%description%</div><div class="right clearfix" style="display: inline-block; margin:10px;">%value%</div><div style="display: inline-block; margin:10px;"><button class="item__delete--btn" style="border:none;"><i class="fa fa-close" style="font-size:20px"></i></button></div></div>'; 
			 }
			 else if(type === 'exp'){
				 element = '.expense_list'
				 html = '<div class="item clearfix" id="expense-%id%"> <div style="display: inline-block; margin:10px;">%description%</div><div class="right clearfix" style="display: inline-block; margin:10px;">%value%</div><div style="display: inline-block; margin:10px;"><button class="item__delete--btn" style="border:none;"><i class="fa fa-close" style="font-size:20px"></i></button></div></div>'; 
			 }
			 //Replace the Placeholder text with some actual data
			 newHtml = html.replace('%id%', obj.id);
			 newHtml = newHtml.replace('%description%', obj.description);
			 newHtml = newHtml.replace('%value%', obj.value);
			 
			 //Insert the HTML into the DOM
			 if(type === 'inc'){
				document.querySelector('.income_list').insertAdjacentHTML('beforeend', newHtml);
			 }else if(type === 'exp'){
				 document.querySelector('.expense_list').insertAdjacentHTML('beforeend', newHtml);
			 }
			  
		 },
		 
		 clearFields: function(){
			 var fields, filedsArr;
			 
			 fields = document.querySelectorAll('#desc'+ ', '+'#val');
			 
			 fieldsArr = Array.prototype.slice.call(fields);
			 
			 fieldsArr.forEach(function(current, index,array){
				 current.value = "";
			 });
			 
			 fieldsArr[0].focus();
		 },
		 
		 displayBudget: function(obj){
			 document.querySelector('.budget__income--value').textContent = obj.totalInc;
			 document.querySelector('.budget__expense--value').textContent = obj.totalExp;
			 document.querySelector('.budget__value').textContent = obj.budget;
		 }
	 }
})();


//GLOBAL APP CONTROLLER
var controller= (function(budgetCtrl, UICtrl){
	
	var setupEventListeners = function(){
		document.getElementById("add_btn").addEventListener('click', ctrlAddItem);
	
	document.addEventListener('keypress', function(event){
		if(event.keyCode === 13 || event.which === 13){
			ctrlAddItem();
		}
	});
	};
	
	var updateBudget = function(){
		
		//1.Calculate the budget
		budgetCtrl.calculateBudget();
		
		//2. Return the budget
		var budget = budgetCtrl.getBudget();
		
		//3. Display the budget on the UI
		//console.log(budget);
		UICtrl.displayBudget(budget);
		
	};
	var ctrlAddItem = function(){
		var input,newItem;
		//1.Get the field Input data
		input = UICtrl.getinput();
		
		if(input.description !== "" && !isNaN(input.value) && input.value>0){
			
		//2. Add the item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		//3.Add the item to the UI
		UICtrl.addListItem(newItem, input.type);
		}
		
		//4.Clear the fields
		UICtrl.clearFields();
		//5. Calculate and update budget
		updateBudget();
	};
	return {
		init: function(){
			console.log('Application has started');
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
			});
			setupEventListeners();
		}
	}
	
})(budgetController,UIController);

controller.init();