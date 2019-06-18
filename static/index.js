const labels = document.querySelectorAll('.form label');
const inputs = document.querySelectorAll('.form .input');
const form = document.querySelectorAll('.form');
let button;
button = document.createElement("button");
button.innerHTML = "Next";
button.classList.add('button');
button.classList.add('nextInput');
button.style.margin = '1rem auto';
button.style.width = '10rem';
button.style.fontSize = '1rem';

let alert = document.createElement("p");
alert.classList.add('alert');

form[0].appendChild(alert);
form[0].appendChild(button);

for (let i=2; i<labels.length; i++){
    labels[i].classList.add('hide');
}
for (let i=2; i<inputs.length; i++){
    inputs[i].classList.add('hide');
}

function checkIfValid () {
    if (inputs[0].validity.valid === true && inputs[1].validity.valid === true){
        alert.innerHTML = '';
        inputs[0].classList.add('hide');
        labels[0].classList.add('hide');
        inputs[1].classList.add('hide');
        labels[1].classList.add('hide');

        inputs[2].classList.remove('hide');
        labels[2].classList.remove('hide');
        inputs[3].classList.remove('hide');
        labels[3].classList.remove('hide');
        inputs[4].classList.remove('hide');
        labels[4].classList.remove('hide');
        if (inputs[2].validity.valid === true && inputs[3].validity.valid === true && inputs[4].validity.valid === true) {
            alert.innerHTML = '';
            inputs[2].classList.add('hide');
            labels[2].classList.add('hide');
            inputs[3].classList.add('hide');
            labels[3].classList.add('hide');
            inputs[4].classList.add('hide');
            labels[4].classList.add('hide');

            inputs[5].classList.remove('hide');
            labels[5].classList.remove('hide');
            inputs[6].classList.remove('hide');
            labels[6].classList.remove('hide');
            inputs[7].classList.remove('hide');
            labels[7].classList.remove('hide');
            if (inputs[5].validity.valid === true && inputs[6].validity.valid === true && inputs[7].validity.valid === true) {
                alert.innerHTML = '';
                inputs[5].classList.add('hide');
                labels[5].classList.add('hide');
                inputs[6].classList.add('hide');
                labels[6].classList.add('hide');
                inputs[7].classList.add('hide');
                labels[7].classList.add('hide');
                button.classList.add('hide');

                labels[8].classList.remove('hide');
                inputs[8].classList.remove('hide');
                inputs[9].classList.remove('hide');
                inputs[10].classList.remove('hide');
                inputs[11].classList.remove('hide');
            }else {
                alert.innerHTML = 'Please fill in all the forms';
            }
        }else {
            alert.innerHTML = 'Please fill in all the forms';
        }
    }else {
        alert.innerHTML = 'Please fill in all the forms';
    }
}

button.addEventListener('click', () => {
    checkIfValid();
});