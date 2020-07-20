let counter = 0;

function counterIncrement() {
    counter++;
}

const element = document.querySelector("#btnIncrement");
element.addEventListener("click", counterIncrement, false);
console.log(counter);