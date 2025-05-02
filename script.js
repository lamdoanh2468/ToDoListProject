const toDoInput = document.getElementById("toDoInput");
const addBtn = document.getElementById("addBtn");
const toDoList = document.getElementById("todoList");
//Func add task
function addTask() {
    const taskText = toDoInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task");
        return;
    }
    //Create li tag
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = taskText;
    span.classList.add("to-do");
    //Create delete button
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.style.margin = "0 10px"; // Adjusted margin
    //Delete Event
    delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wannaDelete = window.confirm("Do you want to delete this task");
        if (wannaDelete) {
            li.remove();
        }

    });
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.style.margin = "0 10px"; // Adjusted margin
    editBtn.addEventListener("click", (e) => {
        const editMessage = prompt("Edit the task");
        if (editMessage != null || editMessage.value.trim() != "") {
            e.stopPropagation();
            span.innerText = editMessage;
        }
    });
    //Complete Task Event
    li.addEventListener("click", () => {
        const testClass = span.classList;
        testClass.toggle("completed");
        testClass.toggle("to-do");
    });
    //Add buttons to li
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(editBtn);
    //Add li to ul
    toDoList.appendChild(li);
    //Clear input
    toDoInput.value = "";
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
