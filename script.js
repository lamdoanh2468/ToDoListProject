// DOM Elements
const toDoInput = document.getElementById("toDoInput");
const addBtn = document.getElementById("addBtn");
const toDoList = document.getElementById("todoList");
const mainTitle = document.getElementById("main-title");
const colorPicker = document.getElementById("main-title-color-picker");
const subColorPicker = document.getElementById("tasks-color-picker");
const h2Task = document.getElementById("total-task");
const totalText = h2Task.innerText;
//Current Time 
let tempText = "";
// State variables
let tasks = [];
let countTask = 0;
let currentTaskIndex = null;
let modalMode = "add";
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

    // Priority modal close button
    const closeModalBtn = document.querySelector(".close-modal");
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", hidePriorityModal);
    }
    //Choose priority options each task
    document.querySelectorAll(".priority-option").forEach(btn => {
        btn.addEventListener("click", () => {
            const priority = btn.dataset.priority;
            const dateInput = document.getElementById("deadlineDate");
            const timeInput = document.getElementById("deadlineTime");
            let deadline = "";
            if (!dateInput.value || !timeInput.value) {
                const isChooseNoDL = confirm("You didn't choose time or date.Would you mind to choose no deadline in your task?");
                if (!isChooseNoDL) {
                    return;
                }
            }
            if (dateInput && timeInput && dateInput.value && timeInput.value) {
                deadline = `${dateInput.value}T${timeInput.value}`;
                //Prevent user to choose previous day for now
                const deadlineTime = new Date(`${dateInput.value}T${timeInput.value}`);
                const now = new Date();
                if (now > deadlineTime) {
                    alert("Can't create deadline from past");
                    return;
                }
            }
            if (modalMode === "add") {
                dateInput.value = "";
                timeInput.value = "";
                const newTask = {
                    text: tempText,
                    completed: false,
                    priority: priority,
                    deadline: deadline
                };
                tasks.push(newTask);
            } else if (modalMode === "edit" && currentTaskIndex !== null) {
                tasks[currentTaskIndex].priority = priority;
                tasks[currentTaskIndex].deadline = deadline;
            }
            saveTasks();
            renderTask();
            hidePriorityModal(); //Close choosing priority window
        });
    });
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
        showPriorityModal("add"); //Open choosing priority window
    }
}



function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask() {
    toDoList.innerHTML = "";
    //Using sorted tasks to sort task by priority
    const sortedTasks = [...tasks].sort((a, b) => {
        const priorityOrder = {
            high: 0,
            medium: 1,
            low: 2
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    sortedTasks.forEach((task) => {
        //Create li element        
        const li = createTaskElement(task, tasks.indexOf(task));
        //Add to to-do list
        toDoList.append(li);
        updateTaskCount();
    });
}

function showPriorityModal(mode = "add", taskIndex = null) {
    modalMode = mode;
    currentTaskIndex = taskIndex;
    document.getElementById("priorityModal").classList.remove("hidden");
}

function hidePriorityModal() {
    const modal = document.getElementById("priorityModal");
    modal.classList.add("closing");
    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("closing");
    }, 300);
}

function createTaskElement(task, index) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.add(task.completed ? "completed" : "to-do");

    // Task completion event
    li.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTask();
    });

    // Add buttons
    const delBtn = createButton("Remove", () => openDialog("remove", index));
    const editBtn = createButton("Edit", () => handleEditTask(index, task.text));
    const priorityBtn = createPriority(task, li);
    const deadline = createDeadline();
    li.appendChild(span);
    li.appendChild(delBtn);
    li.appendChild(editBtn);
    li.appendChild(priorityBtn);
    li.appendChild(deadline);
    return li;
}

function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.style.margin = "0 10px";
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        onClick();
    });
    return button;
}

function editPriority(task) {
    const index = tasks.indexOf(task);
    showPriorityModal("edit", index);
}

function createPriority(task, li) {
    const priorityText = document.createElement("div");
    priorityText.innerText = task.priority;

    // Style cho container
    priorityText.style.margin = "0 10px";
    priorityText.style.padding = "4px 12px";
    priorityText.style.borderRadius = "20px";
    priorityText.style.fontWeight = "600";
    priorityText.style.fontSize = "0.9em";
    priorityText.style.textTransform = "capitalize";
    priorityText.style.display = "inline-block";
    priorityText.style.minWidth = "80px";
    priorityText.style.textAlign = "center";

    // Style cho border của task
    li.style.borderLeft = "4px solid";
    li.style.margin = "8px 0";
    li.style.transition = "all 0.3s ease";

    // Set màu sắc dựa trên priority
    if (task.priority === "high") {
        priorityText.style.backgroundColor = "#ffebee";
        priorityText.style.color = "#d32f2f";
        li.style.borderLeftColor = "#d32f2f";
    } else if (task.priority === "medium") {
        priorityText.style.backgroundColor = "#fff3e0";
        priorityText.style.color = "#f57c00";
        li.style.borderLeftColor = "#f57c00";
    } else {
        priorityText.style.backgroundColor = "#e3f2fd";
        priorityText.style.color = "#1976d2";
        li.style.borderLeftColor = "#1976d2";
    }
    priorityText.addEventListener("click", (e) => {
        e.stopPropagation();
        editPriority(task);
    });
    return priorityText;
}

function updateDeadlineDisplays() {
    document.querySelectorAll(".deadline-display").forEach((el, i) => {
        const task = tasks[i];
        if (task.deadline) {
            const now = new Date();
            const deadlineDate = new Date(task.deadline);
            const diff = deadlineDate - now;
            let timeText = "";
            //Calculate time attributes
            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const days = Math.floor(hours / 24);
                timeText = `⏳ Còn ${days}d ${hours % 24}h ${minutes}m`;
                el.style.backgroundColor = diff < 3 * 60 * 60 * 1000 ? "#ffe0e0" : "#e0f7fa";
                el.style.color = diff < 3 * 60 * 60 * 1000 ? "#d32f2f" : "#00796b";
            } else {
                const lateBy = Math.abs(diff);
                const lateHours = Math.floor(lateBy / (1000 * 60 * 60));
                const lateMinutes = Math.floor((lateBy / (1000 * 60)) % 60);
                timeText = `⚠️ Trễ ${lateHours}h ${lateMinutes}m`;
                el.style.backgroundColor = "#ffebee";
                el.style.color = "#c62828";
            }
            el.innerText = timeText;
        } else {
            el.innerText = "⏰ No deadline";
        }
    });
}
setInterval(updateDeadlineDisplays, 6000);

function createDeadline() {
    const deadlineDiv = document.createElement("div");
    deadlineDiv.classList.add("deadline-display");
    deadlineDiv.innerText = "⏰ Đang tải deadline...";
    //Style
    deadlineDiv.style.margin = "0 10px";
    deadlineDiv.style.padding = "4px 12px";
    deadlineDiv.style.borderRadius = "20px";
    deadlineDiv.style.fontWeight = "600";
    deadlineDiv.style.fontSize = "0.9em";
    deadlineDiv.style.textTransform = "capitalize";
    deadlineDiv.style.display = "inline-block";
    deadlineDiv.style.minWidth = "80px";
    deadlineDiv.style.textAlign = "center";
    return deadlineDiv;
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

function openDialog(typeDialog, index) {
    switch (typeDialog) {
        case "remove":
            const removeModal = document.getElementById("removeModal");
            removeModal.classList.remove("hidden");
            const message = "Do you want to delete this task";
            removeModal.querySelector(".modal-header h3").innerText = message;
            const yesOption = document.getElementById('yes-option');
            const noOption = document.getElementById('no-option');
            yesOption.addEventListener("click", () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTask();
                removeModal.classList.add("closing");
                setTimeout(() => {
                    removeModal.classList.add("hidden");
                    removeModal.classList.remove("closing");
                }, 300);
            });
            noOption.addEventListener("click", () => {
                removeModal.classList.add("closing");
                setTimeout(() => {
                    removeModal.classList.add("hidden");
                    removeModal.classList.remove("closing");
                }, 300);
            });
            break;
        case "edit":
            break;
    }
}

function handleEditTask(index, currentText) {
    const editModal = document.getElementById("editModal");
    const editInput = document.getElementById("editInput");
    editInput.value = currentText;
    editModal.classList.remove("hidden");

    const saveEdit = document.getElementById("saveEdit");
    const cancelEdit = document.getElementById("cancelEdit");

    const closeEditModal = () => {
        editModal.classList.add("closing");
        setTimeout(() => {
            editModal.classList.add("hidden");
            editModal.classList.remove("closing");
        }, 300);
    };

    saveEdit.onclick = () => {
        const newText = editInput.value.trim();
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTask();
        }
        closeEditModal();
    };

    cancelEdit.onclick = closeEditModal;
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
        modal.classList.add("hidden");
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