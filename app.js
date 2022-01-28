const mainForm = document.getElementById("mainForm");
const inputs = mainForm.getElementsByTagName("input");
const childrenSelectors = document.getElementById("childrenSelectors");

const inputsValidation = {
    adults: {
        min: 1,
        max: 30,
        defaultValue: 1,
        counterElementId: "adultsCounter",
    },
    children: {
        min: 0,
        max: 10,
        defaultValue: 0,
        counterElementId: "childrenCounter",
        additionalChanges: input => {
            console.log("here");
            const { value } = input;
            if(value > 0) {
                document.getElementById("childrenSelectorsTitle").style.display = "block";
            } else {
                document.getElementById("childrenSelectorsTitle").style.display = "none";
            }
            childrenSelectors.innerHTML = "";
            for (let i = 0; i < value; i++) {
                const newSelect = document.createElement('select');
                newSelect.name = `select${i}`;
                for (let j = 1; j < 18; j++) {
                    newSelect.innerHTML += `<option value="${j}">${j} years old</option>`;
                }
                childrenSelectors.appendChild(newSelect);
            }
        },
    },
    rooms: {
        min: 1,
        max: 30,
        defaultValue: 1,
        counterElementId: "roomsCounter",
    },
};

const inputDefaultInitialization = (input) => {
    const { min, max, defaultValue, counterElementId, additionalChanges } = inputsValidation[input.name];
    input.value = defaultValue;
    const counterElement = document.getElementById(counterElementId);
    counterElement.textContent = defaultValue;
    const btns = input.closest(".numberChanger").getElementsByTagName("button");
    for(let btn of btns) {
        if(btn.textContent === "-") {
            btn.addEventListener('click', () => {
                //TODO add styles changing
                if(min < input.value) {
                    input.value--;
                }
                counterElement.textContent = input.value;
                if(additionalChanges) {
                    additionalChanges(input);
                }
            });
        } else {
            btn.addEventListener('click', () => {
                //TODO add styles changing
                if(max > input.value) {
                    input.value++;
                }
                counterElement.textContent = input.value;
                if(additionalChanges) {
                    additionalChanges(input);
                }
            });
        }
    }
};

for (let input of inputs) {
    inputDefaultInitialization(input);
}

const getChildrenSelectorValues = () => {
    const selectors = childrenSelectors.getElementsByTagName("select");
    const childAgesData = [];
    for (let selector of selectors) {
        childAgesData.push(selector.value);
    }
    return childAgesData.toString();
}

mainForm.onsubmit = async (event) => {
    event.preventDefault();
    const adults = event.target.adults.value;
    const children = getChildrenSelectorValues();
    const rooms = event.target.rooms.value;
    const res = await fetch(`https://fe-student-api.herokuapp.com/api/hotels?search=Miami&adults=${adults}&children=${children}&rooms=${rooms}`);
    const resJSON = await res.json();
    console.log(resJSON);
}
