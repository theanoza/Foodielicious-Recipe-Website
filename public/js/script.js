let addIngredientsButton = document.getElementById('addIngredientsButton');
let ingredientList = document.querySelector('.ingredientList');
let ingredientDivision = document.querySelectorAll('.ingredientDivision')[0];

addIngredientsButton.addEventListener('click', function(){
    let newIngredients = ingredientDivision.cloneNode(true);
    let input = newIngredients.getElementsByTagName('input')[0];
    input.value = '';
    ingredientList.appendChild(newIngredients);
});


/******* Progress Bar 

const nextInstr = document.getElementById("next");
const prevInstr = document.getElementById("prev");
const progress = document.getElementById('progress');
const wrap = document.querySelectorAll('.text-wrap');

let current_check = 1;

nextInstr.addEventListener("click", () => {
    current_check++;
    if(current_check > wrap.length) {
        current_check = wrap.length;
    }
    updateProgress();
});

prevInstr.addEventListener("click", () => {
    current_check--;
    if(current_check < 1) {
        current_check = 1;
    }
    updateProgress();
});

function updateProgress() {
    wrap.forEach((wrap, index) => {
        if(index < current_check) {
            wrap.classList.add('active');
        } else {
            wrap.classList.remove('active');
        }
    });

    const active = document.querySelectorAll('.active');
    progress.style.width = (active.length - 1) / (wrap.length - 1) * 80 + '%'

    if (current_check === 1) {
        prevInstr.disabled = true;
    } else if (current_check === wrap.length) {
        nextInstr.disabled = true;
    } else {
        prevInstr.disabled = false;
        nextInstr.disabled = false;
    }
} *******/