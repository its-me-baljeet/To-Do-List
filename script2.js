
const addBtn = document.getElementById("add-btn");
// console.log(addBtn)

addBtn.addEventListener("click", () => {
    taskAdder();
})

const inputTaskBox = document.getElementById("input-text");
function errorMsgRemover(container) {

}
inputTaskBox.addEventListener("keypress", function (inputText) {
    if (inputText.key === "Enter") {
        console.log("Enter pressed");
        inputText.preventDefault();

        const errorState = document.getElementsByClassName("error-box");
        if (errorState.length == 1) {
            // error_state.remove();
            Array.from(errorState).forEach(errorMessage => {
                errorMessage.remove();
            })
        }
        addBtn.click();
    }
})

//For Loading the previous stored Tasks.
function load_task() {
    let prevTask = JSON.parse(localStorage.getItem("task_key"));
    if (prevTask) {
        for (const timeStamp in prevTask) {
            // console.log(prevTask)
            // console.log(prevTask[timeStamp]);
            if (prevTask[timeStamp].isCompleted == false) {
                createCard(prevTask, timeStamp, "incomplete-task-container");
            }
            else {
                createCard(prevTask, timeStamp, "completed-task-container");
            }
        }
    }
    checkChildren("incomplete-task-container");
    checkChildren("completed-task-container");
}
//Loading tasks from local storage
load_task();

// creating a card template
function createCard(task, key, container) {
    const toDoList = document.getElementById(`${container}`);
    const toDoItem = document.createElement("div");
    toDoItem.classList.add("list-item");
    const value = task[key].task;
    toDoItem.innerHTML = `<input type="checkbox" class="tick-box" id="${key}"> <p class="task-text"> ${value}</p> <button class="edit-button" id="${key}"><img src="edit.png"S></button> <button class="delete-btn" id="${key}"><img src="delete.svg"></button>`
    toDoList.prepend(toDoItem);

    if (container == "completed-task-container") {
        const checkbox = toDoItem.children[0];
        checkbox.checked = true;
        const taskElement = checkbox.nextElementSibling;
        taskElement.style.textDecoration = "line-through";
    };
    checkChildren("incomplete-task-container");
    checkChildren("completed-task-container");
    toggleCheckbox();
    editCard();
    deleteCard();
}

//adding editing task functionality.

// adding delete functionality
function deleteCard() {
    const delButtonClass = document.getElementsByClassName("delete-btn");
    Array.from(delButtonClass).forEach(delButton => {//Created an array of buttons from the class
        delButton.addEventListener("click", () => {//Added eventlistener for click event.
            const taskId = delButton.id;//storing the timestamp.


            const allTasksList = JSON.parse(localStorage.getItem("task_key"));//retrieving the tasks from localStorage
            delete allTasksList[taskId];//deleting the (key, value) pair
            localStorage.setItem("task_key", JSON.stringify(allTasksList));//saving the new list into localStorage.

            delButton.parentElement.remove();//Removing the button from DOM Tree.
            checkChildren("incomplete-task-container");
            checkChildren("completed-task-container");
        })
    })
}

//adding strikout functionality and toggling between complete and incomplete task.
function toggleCheckbox() {

    let checkBox_class = document.getElementsByClassName("tick-box");
    Array.from(checkBox_class).forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const taskElement = checkbox.nextElementSibling;

            //If task is completed
            if (checkbox.checked) {
                checkbox.parentElement.remove();
                taskElement.style.textDecoration = "line-through";
                document.getElementById("completed-task-container").prepend(taskElement.parentElement);

                const completeTask = JSON.parse(localStorage.getItem("task_key"));
                completeTask[checkbox.id].isCompleted = true;
                localStorage.setItem("task_key", JSON.stringify(completeTask));
            }
            else {
                checkbox.parentElement.remove();
                taskElement.style.textDecoration = "none";
                document.getElementById("incomplete-task-container").prepend(taskElement.parentElement);

                const incompleteTask = JSON.parse(localStorage.getItem("task_key"));
                incompleteTask[checkbox.id].isCompleted = false;
                localStorage.setItem("task_key", JSON.stringify(incompleteTask));
            }
            checkChildren("incomplete-task-container");
            checkChildren("completed-task-container");
        })

    })
}


function taskValidation(inpText) {
    let task_text = inpText.trim();
    // console.log(task_text)
    if (task_text.length) {
        return 1;
    }
    else {
        errorMessage();
        return 0;
    }
}
function errorMessage() {
    //Creating an errorbox
    const error_box = document.createElement("div");
    error_box.classList.add("error-box");
    error_box.innerText = "* Task can't be empty";

    const count_error_box = document.getElementsByClassName("error-box");
    // console.log(count_error_box.length)
    if (count_error_box.length == 0) {

        const toDoList = document.getElementById("incomplete-task-container");
        toDoList.before(error_box);
    }


    const inpText = document.getElementById("input-text");
    inpText.addEventListener("click", () => {
        error_box.remove();
    })
}
function taskAdder() {

    const inpText = document.getElementById("input-text").value;//Taking the text from input box.
    console.log(inpText)
    if (taskValidation(inpText)) {

        const allTasksList = JSON.parse(localStorage.getItem("task_key")) || {};//JSON.parse or stingify tabhi kaam krega jab storage se string milegi. Nahi to ek empty object enter krao
        //JSON- Java Script Object Notation
        //JSON.stringify converts object to string.
        //JSON.parse coverts string to object.

        //creating timeStamp for creating a Unique Key
        const newKey = Date.now();//gives present time in ms.
        // console.log(newKey);

        //adding key value 
        allTasksList[newKey] = { task: inpText, isCompleted: false };//adding key and values to the object.

        //coverting the object into string
        const stringObj = JSON.stringify(allTasksList);
        // console.log(typeof stringObj)//now our object is of type string

        // now save the Element
        localStorage.setItem("task_key", stringObj);
        //create a card to show
        createCard(allTasksList, newKey, "incomplete-task-container");
    }
    document.getElementById("input-text").value = "";//Used for resetting the input box empty.
}

function editCard() {
    const editButtonClass = document.getElementsByClassName("edit-button");
    Array.from(editButtonClass).forEach(editButton => {//Created an array of buttons from the class
        editButton.addEventListener("click", (event) => {//Added eventlistener for click event.
            const taskId = editButton.id;//storing the timestamp.

            const allTasksList = JSON.parse(localStorage.getItem("task_key"));//retrieving the tasks from localStorage

            let currText = allTasksList[taskId].task;

            const card = editButton.parentElement;
            if (!card) return; // Prevent further errors

            const taskElement = card.querySelector("p");

            console.log(taskElement);

            const deleteButton = card.querySelector(".delete-btn")

            const checkbox = card.querySelector("input");
            checkbox.hidden = true;

            const inputBox = document.createElement("input");
            inputBox.type = "text";
            inputBox.value = currText;
            inputBox.classList.add("new-input-box");
            hideErrorMsg(inputBox);


            const saveButton = document.createElement("button");
            saveButton.classList.add("save-button");
            saveButton.innerHTML = `<img src="save.png">`;

            const cancelButton = document.createElement("button");
            cancelButton.classList.add("cancel-button");
            cancelButton.innerHTML = `<img src="cancel.png">`;
            hideErrorMsg(cancelButton);

            inputBox.addEventListener("keypress", (e) => {
                if (e.key == "Enter") {
                    e.preventDefault();
                    saveButton.click();
                }
            })

            taskElement.replaceWith(inputBox);
            editButton.replaceWith(saveButton);
            deleteButton.replaceWith(cancelButton);

            saveButton.addEventListener("click", (saveHandler) => {
                const newText = inputBox.value;

                // console.log(newText);
                if (taskValidation(newText)) {

                    taskElement.innerText = newText;
                    allTasksList[taskId].task = newText;
                    localStorage.setItem("task_key", JSON.stringify(allTasksList));
                    inputBox.replaceWith(taskElement);
                    saveButton.replaceWith(editButton);
                    cancelButton.replaceWith(deleteButton);
                    checkbox.hidden = false;
                }
            })
            cancelButton.addEventListener("click", () => {
                inputBox.replaceWith(taskElement);
                saveButton.replaceWith(editButton);
                cancelButton.replaceWith(deleteButton);
                checkbox.hidden = false;
            })
        })
    })
}

function checkChildren(container) {
    let containerElement = document.getElementById(`${container}`);
    let heading = containerElement.previousElementSibling;
    let showCount = heading.children[1];
    let childCount = containerElement.childElementCount;

    if (childCount === 0) {
        heading.style.display = "none";
        containerElement.style.display = "none";
    }
    else {
        showCount.innerText = `(${childCount})`;
        heading.style.display = "block";
        containerElement.style.display = "block";
    }
}


function hideErrorMsg(element) {
    element.addEventListener("click", function (inputText) {
        inputText.preventDefault();

        const errorState = document.getElementsByClassName("error-box");
        if (errorState.length == 1) {
            // error_state.remove();
            Array.from(errorState).forEach(errorMessage => {
                errorMessage.remove();
            })
        }
    }
    )
}
// toggleCheckbox();