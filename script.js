// DOM Elements
const toDoInput = document.getElementById("toDoInput");
const addBtn = document.getElementById("addBtn");
const toDoList = document.getElementById("todoList");
const mainTitle = document.getElementById("main-title");
const colorPicker = document.getElementById("main-title-color-picker");
const subColorPicker = document.getElementById("tasks-color-picker");
const h2Task = document.getElementById("total-task");
const totalText = h2Task.innerText;
let tempText = "";
// State variables
let tasks = [];
let countTask = 0;

// Initialize application when window loads
window.addEventListener('load', initializeApp);

function initializeApp() {
    loadStorage();
    setupEventListeners();
}

// Load data from localStorage
function loadStorage() {
    const savedTasks = localStorage.getItem("tasks");
    const savedBackground = localStorage.getItem("backgroundUrl");
    const mainTitleColor = localStorage.getItem("mainTitleColor");
    const subTitleColor = localStorage.getItem("subTitleColor");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        renderTask();
    }

    if (savedBackground) {
        setBackgroundImage(savedBackground);
    }

    if (mainTitleColor) {
        setMainTitleColor(mainTitleColor);
    }

    if (subTitleColor) {
        setSubTitleColor(subTitleColor);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Add task events
    addBtn.addEventListener("click", () => setTimeout(addTask, 1000));
    toDoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });

    // Input placeholder events
    toDoInput.addEventListener("mouseenter", () => {
        toDoInput.placeholder = "Enter your task...";
    });
    toDoInput.addEventListener("mouseout", () => {
        toDoInput.placeholder = "";
    });

    // Title and color picker events
    if (mainTitle) {
        mainTitle.addEventListener("click", handleTitleEdit);
        colorPicker.addEventListener("input", handleMainTitleColorChange);
    }

    if (subColorPicker) {
        subColorPicker.addEventListener("input", handleSubTitleColorChange);
    }

    // Background image modal events
    setupBackgroundModalEvents();
}

// Task management functions
function addTask() {
    const taskText = toDoInput.value.trim();
    if (!taskText) {
        alert("Please enter a task");
        return;
    } else {
        tempText = taskText;
        toDoInput.value = "";
        showPriorityModal(); //Open choosing priority window
    }
}
document.querySelectorAll(".priority-option").forEach(btn => {
    btn.addEventListener("click", () => {
        const priority = btn.dataset.priority;
        tasks.push({ text: tempText, completed: false, priority });
        saveTasks();
        renderTask();
        hidePriorityModal(); //Close choosing priority window
    });
});
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask() {
    toDoList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        toDoList.appendChild(li);
    });
    updateTaskCount();
}
function showPriorityModal() {
    document.getElementById("priorityModal").classList.remove("hidden");
}
function hidePriorityModal() {
    document.getElementById("priorityModal").classList.add("hidden");
}
function createTaskElement(task, index) {
    const li = document.createElement("li");
    li.classList.add("task-item");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("task-content");
    
    const span = document.createElement("span");
    span.innerText = task.text;
    span.classList.add(task.completed ? "completed" : "to-do");
    contentDiv.appendChild(span);

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("task-buttons");

    // Task completion event
    li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTask();
    });

    // Add buttons
    const delBtn = createButton("Remove", () => handleDeleteTask(index));
    const editBtn = createButton("Edit", () => handleEditTask(index, task.text));
    const priorityBtn = createPriorityButton(task, index, () => handlePriorityTask(index));
    
    delBtn.classList.add("task-button");
    editBtn.classList.add("task-button");
    priorityBtn.classList.add("priority-button");
    
    if (task.priority) {
        priorityBtn.classList.add(`priority-${task.priority.toLowerCase()}`);
    }

    buttonsDiv.appendChild(delBtn);
    buttonsDiv.appendChild(editBtn);
    buttonsDiv.appendChild(priorityBtn);

    li.appendChild(contentDiv);
    li.appendChild(buttonsDiv);
    return li;
}

function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
    });
    return button;
}

function createPriorityButton(task, index, onClick) {
    const priorityBtn = document.createElement("button");
    priorityBtn.innerText = task.priority || "Set Priority";
    priorityBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
    });
    return priorityBtn;
}

function handlePriorityTask(index) {
    const priorities = ["High", "Medium", "Low"];
    const currentPriority = tasks[index].priority;
    const currentIndex = priorities.indexOf(currentPriority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    tasks[index].priority = priorities[nextIndex];
    saveTasks();
    renderTask();
}

// Event handlers
function handleTitleEdit() {
    const editTitle = prompt("What title do you want to?");
    if (editTitle && editTitle.length !== 0) {
        mainTitle.innerText = editTitle;
    }
}

function handleMainTitleColorChange() {
    const newColor = colorPicker.value;
    setMainTitleColor(newColor);
    localStorage.setItem("mainTitleColor", newColor);
}
function handleSubTitleColorChange() {
    const newColor = subColorPicker.value;
    setSubTitleColor(newColor);
    localStorage.setItem("subTitleColor", newColor);
}

function handleDeleteTask(index) {
    const wannaDelete = window.confirm("Do you want to remove this task?");
    if (wannaDelete) {
        tasks.splice(index, 1);
        saveTasks();
        renderTask();
    }
}

function handleEditTask(index, currentText) {
    const editMessage = prompt("Edit the task", currentText);
    if (editMessage != null && editMessage.trim() !== "") {
        tasks[index].text = editMessage.trim();
        saveTasks();
        renderTask();
    }
}

// Utility functions
function setMainTitleColor(color) {
    mainTitle.style.color = color;
    colorPicker.value = color;
}

function setSubTitleColor(color) {
    h2Task.style.color = color;
    subColorPicker.value = color;
}

function setBackgroundImage(url) {
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.minHeight = "100vh";
}

function updateTaskCount() {
    h2Task.innerText = totalText + tasks.length;
}

// Background modal setup
function setupBackgroundModalEvents() {
    const openModalBtn = document.getElementById("openModal");
    const modal = document.getElementById("modal");
    const closeModalBtn = document.getElementById("closeModal");
    const images = document.querySelectorAll(".image-options img");

    modal.classList.add("hidden", "hide");

    openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden", "hide");
        modal.classList.add("show");
    });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("show");
        modal.classList.add("hide");
    });

    modal.addEventListener("animationend", (e) => {
        if (e.animationName === "fadeOutScale") {
            modal.classList.add("hidden");
        }
    });

    images.forEach((img) => {
        img.addEventListener("click", () => {
            const url = img.getAttribute("data-url");
            setBackgroundImage(url);
            localStorage.setItem("backgroundUrl", url);
        });
    });
}




