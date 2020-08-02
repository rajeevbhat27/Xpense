 //global declarations
 let totalExpense = 0;
 let AllExpense = [];

 //onLoad function
 function fetchDetails() {
     if (localStorage.getItem('xpenses') !== null) {
         AllExpense = JSON.parse(localStorage.getItem('xpenses'));
         AllExpense.filter(expense => expense.moment = new Date(expense.moment));
     }
     if (localStorage.getItem('total') !== null) {
         totalExpense = parseInt(localStorage.getItem('total'));
     }

     renderList(AllExpense);

     displayExpense.textContent = " Total :" + totalExpense;

 }

 //getting reference
 const displayExpense = document.querySelector("#displayexpense");
 const btnAddExpense = document.querySelector("#btnAddExpense");
 const expenseText = document.querySelector("#inputExpense");
 const descText = document.querySelector("#inputDesc");
 const summaryEl = document.querySelector("#summary");


 //validation for no input or wrong input
 function validate() {
     if (document.querySelector("#inputExpense").value === "" || document.querySelector("#inputDesc").value === "") {
         window.alert("Field should not be Empty!!");
         return false;
     }
     if (isNaN(parseInt(document.querySelector("#inputExpense").value))) {
         window.alert("Expense should be a number!");
         return false;
     }
     return true;

 }

 // Add Expense
 function addTotalExpense() {

     if (validate()) {
         //expense object
         const expenseData = {};
         const expense = parseInt(expenseText.value);
         const desc = descText.value;


         //new expense object
         expenseData.amount = expense;
         expenseData.Description = desc;
         expenseData.moment = new Date()
         //push to array
         AllExpense.push(expenseData);

         //update total expense
         totalExpense = totalExpense + expense;
         displayExpense.textContent = `Total : ${totalExpense}`;

         renderList(AllExpense);
         document.querySelector("#inputExpense").value = "";
         document.querySelector("#inputDesc").value = "";
     }

 }

 function getDateString(momento) {
     return momento.toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
     });
 }

 function renderList(arrOfList) {
     const allExpenseHTML = arrOfList.map(expense => createListItem(expense));
     const joinedAllExpenseHTML = allExpenseHTML.join('');
     summaryEl.innerHTML = joinedAllExpenseHTML;
 }

 function createListItem({
     Description,
     amount,
     moment
 }) {
     return `
                  <li class="list-group-item d-flex justify-content-between">
                          <div class="d-flex flex-column">
                              ${Description}
                              <small class="text-muted">${getDateString(moment)}</small>
                          </div>
                          <div>
                              <span class="px-5">
                                  ${amount}
                              </span>
                              <button 
                              type="button" 
                              class="btn btn-outline-danger btn-sm"
                              onclick="editItem(${moment.valueOf()})"
                              >
                              <i class="fas fa-edit"></i>
                              </button>
                              <button 
                                  type="button" 
                                  class="btn btn-outline-danger btn-sm"
                                  onclick="deleteItem(${moment.valueOf()})"
                                  >
                                  <i class="fas fa-trash-alt"></i>
                              </button>
                             
                              
                          </div>
                      </li>
                  `;
 }

 // Delete expense
 function deleteItem(atTime) {
     let newArr = AllExpense.filter(expense => expense.moment.valueOf() !== atTime);
     totalExpense = totalExpense - AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].amount;

     displayExpense.textContent = `Total : ${totalExpense}`;
     AllExpense = newArr;
     renderList(AllExpense);

 }

 //Edit Expense
 function editItem(atTime) {
     let newAmount = prompt("Amount Spent:", AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].amount);
     let newDesc = prompt("Spent on:", AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].Description);
     if (newDesc != "" && !isNaN(parseInt(newAmount))) {
         let changedValue = newAmount - AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].amount;
         AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].amount = newAmount;
         AllExpense.filter(expense => expense.moment.valueOf() === atTime)[0].Description = newDesc;

         totalExpense = totalExpense + changedValue;
         displayExpense.textContent = `Total : ${totalExpense}`;

         renderList(AllExpense);
     }
 }

 // event listeners
 btnAddExpense.addEventListener("click", addTotalExpense, false);

 // saving to localstorage before refresh/ window close
 window.addEventListener("beforeunload", function () {
     if (AllExpense.length !== null)
         localStorage.setItem('xpenses', JSON.stringify(AllExpense));
     localStorage.setItem('total', JSON.stringify(totalExpense));
 }, false);