 //global declarations
 let totalExpense = 0;
 let AllExpense = [];

 function init() {
   loadDropdown();
   fetchDetails();
 }

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

     displayExpense.textContent = ` Total: ${totalExpense}₹`;
 }

 //get dropdown options
 function loadDropdown() {
   const options = [
     'Shopping',
     'Food',
     'Rent',
     'Bill',
     'Misc',
   ];
   const html = options.map(option => `<option value="${option}">${option}</option>\n`).join();
   const inputs = document.querySelectorAll('form .categories');
   console.log(inputs)
   inputs.forEach(input => input.innerHTML = html);
  }

 //getting reference
 const displayExpense = document.querySelector("#displayexpense");
 const expenseForm = document.querySelector("#expense-form");
 const expenseText = document.querySelector("#inputExpense");
 const expenseCategory = expenseForm.elements['category'];
 const summaryEl = document.querySelector("#summary");
 const modal = document.querySelector('#edit-modal');
 const modalOverlay = document.querySelector('#edit-modal-backdrop');


 //validation for no input or wrong input
 function validate() {
     if (!(expenseText.value && expenseCategory.options[expenseCategory.selectedIndex].value)) {
         window.alert("Fields should not be Empty!!");
         return false;
     }
     if (isNaN(parseInt(expenseText.value))) {
         window.alert("Expense should be a number!");
         return false;
     }
     return true;

 }

 // Add Expense
 function addTotalExpense(e) {
   e.preventDefault();

     if (validate()) {
         //expense object
         const expenseData = {};
         const expense = parseInt(expenseText.value);
         const cat = expenseCategory.options[expenseCategory.selectedIndex].value;


         //new expense object
         expenseData.amount = expense;
         expenseData.Category = cat;
         expenseData.moment = new Date()
         //push to array
         AllExpense.push(expenseData);

         //update total expense
         totalExpense = totalExpense + expense;
         displayExpense.textContent = `Total: ${totalExpense}₹`;

         renderList(AllExpense);
         document.querySelector("#inputExpense").value = "";
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
     Category,
     amount,
     moment
 }) {
     return `
                  <li class="list-group-item d-flex justify-content-between">
                          <div class="d-flex flex-column">
                              ${Category}
                              <small class="text-muted">${getDateString(moment)}</small>
                          </div>
                          <div>
                              <span class="px-5">
                                  ${amount}₹
                              </span>
                              <button 
                              type="button" 
                              class="btn btn-outline-danger btn-sm"
                              onclick="showModal(${moment.valueOf()})"
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
function editItem(e) {
  e.preventDefault();
  console.log(modal.elements['time'].value)
  const item = AllExpense.find(expense => expense.moment.valueOf() === +modal.elements['time'].value)
  const newCategory = modal.elements['category'].value;
  const newAmount = modal.elements['amount'].value;
  if (newCategory && !isNaN(parseInt(newAmount))) {
    let changedValue = newAmount - item.amount;
    item.amount = newAmount;
    item.Category = newCategory;
    
    totalExpense = totalExpense + changedValue;
    displayExpense.textContent = `Total : ${totalExpense}`;
    
    hideModal();
    renderList(AllExpense);
  }
}

//display edit modal
function showModal(atTime) {
  console.log(atTime)
  const item = AllExpense.find(expense => expense.moment.valueOf() === atTime);
  modal.elements['category'].value = item.Category;
  modal.elements['amount'].value = item.amount;
  modal.elements['time'].value = atTime;
  modal.classList.add('show');
  modalOverlay.classList.add('show');
}

//hide edit modal
function hideModal() {
  modal.classList.remove('show');
  modalOverlay.classList.remove('show');
}

 // event listeners
 expenseForm.addEventListener("submit", (e) => addTotalExpense(e), false);
 modal.addEventListener("submit", (e) => editItem(e), false);
 modal.addEventListener("mousedown", (e) => {
   if(e.target === modal)
    hideModal()
  }, false);

 // saving to localstorage before refresh/ window close
 window.addEventListener("beforeunload", function () {
     if (AllExpense.length !== null)
         localStorage.setItem('xpenses', JSON.stringify(AllExpense));
     localStorage.setItem('total', JSON.stringify(totalExpense));
 }, false);