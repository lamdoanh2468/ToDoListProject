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
    li.innerText = taskText;
    //Create delete button
    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.style.marginLeft = "10px";
    //Delete Event
    delBtn.addEventListener("click", () => {
        li.remove();
    });
    //Complete Task Event
    li.addEventListener("click", () => {
        li.classList.toggle("completed")
    });
    //Add del to li
    li.appendChild(delBtn);

    //Add li to ul
    toDoList.appendChild(li);
    //Clear input
    toDoInput.value = "";
}
//add event
addBtn.addEventListener("click", addTask);
//enter input 
toDoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});
