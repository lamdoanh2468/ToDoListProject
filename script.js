const toDoInput = document.getElementById("toDoInput");
const addBtn = document.getElementById("addBtn");
const toDoList = document.getElementById("todoList");
var countTask = 0;
const h2Task = document.getElementById("total-task");
const totalText = h2Task.innerText;
let tasks = [];
//Load savedTasks from local storage -> Convert string to JSON
function loadStorage() {
    window.onload = () => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTask();
        }
    }
}
loadStorage();
//Func add task
function addTask() {
    const taskText = toDoInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task");
        return;
    }
    const newTask = { text: taskText, completed: false };
    tasks.push(newTask);
    saveTask();
    renderTask();
    //Clear input
    toDoInput.value = "";
}
//Save task into LOCAL STORAGE
function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//Use LocalStorage
function renderTask() {
    toDoList.innerHTML = "";
    tasks.forEach((task, index) => {
        //Create li tag
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.innerText = task.text;
        if (task.completed) {
            span.classList.add("completed");
        } else {
            span.classList.add("to-do");
        }
        //Complete Task Event
        li.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTask();
            renderTask();
        });
        //Create delete button
        const delBtn = document.createElement("button");
        delBtn.innerText = "Remove";
        delBtn.style.margin = "0 10px"; // Adjusted margin
        //Delete Event
        delBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const wannaDelete = window.confirm("Do you want to remove this task");
            if (wannaDelete) {
                tasks.splice(index, 1);
                saveTask();
                renderTask();
            }
        });
        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.style.margin = "0 10px"; // Adjusted margin
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const editMessage = prompt("Edit the task", task.text);
            if (editMessage != null || editMessage.value.trim() != "") {
                tasks[index].text = editMessage.trim();
                saveTask();
                renderTask();
            }
        });
        //Update total task 
        h2Task.innerText = totalText + tasks.length;
        //Add buttons to li
        li.appendChild(span);
        li.appendChild(delBtn);
        li.appendChild(editBtn);
        //Add li to ul
        toDoList.appendChild(li);


    })

}
function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}
//add event
const addEvent = addBtn.addEventListener("click", () => {
    setTimeout(addTask, 1000);
});
//enter input 
toDoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});
//Mouse enter : move cursor and tap into element
//Mouse over : move cursor around element
toDoInput.addEventListener("mouseenter", () => {
    toDoInput.placeholder = "Enter your task...";
});
const turnOffInput = toDoInput.addEventListener("mouseout", () => {
    toDoInput.placeholder = "";
});
//Change the title of to-do list
const mainTitle = document.querySelector(".main-title");
if (mainTitle != null) {
    mainTitle.addEventListener("click", () => {
        const editTitle = prompt("What title do you want to ?")
        mainTitle.innerText = editTitle;
    });
} else {
    console.warn("System Error:(");
}
//Handling Selecting Background image
const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const images = document.querySelectorAll(".image-options img");
//
openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden","hide");
    modal.classList.add("show");
})
closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    modal.classList.add("hide");
})
modal.addEventListener("animationend", function handleHide(e) {
    if (e.animationName === "fadeOutScale") {
        modal.classList.add("hidden");
        // modal.removeEventListener("animationend", handleHide);
    }
});
images.forEach((img) => {
    img.addEventListener("click", () => {
        const url = img.getAttribute("data-url");
        document.body.style.backgroundImage = `url(${url})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
    })
}
);




