"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// DOM Elements
var toDoInput = document.getElementById("toDoInput");
var addBtn = document.getElementById("addBtn");
var toDoList = document.getElementById("todoList");
var mainTitle = document.getElementById("main-title");
var colorPicker = document.getElementById("main-title-color-picker");
var subColorPicker = document.getElementById("tasks-color-picker");
var h2Task = document.getElementById("total-task");
var totalText = h2Task.innerText; //Current Time 

var tempText = ""; // State variables

var tasks = [];
var countTask = 0;
var currentTaskIndex = null;
var modalMode = "add"; // Initialize application when window loads

window.addEventListener('load', function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetchTasksFromServer());

        case 2:
          setupEventListeners();

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});

function fetchTasksFromServer() {
  var res, _ref, success, data;

  return regeneratorRuntime.async(function fetchTasksFromServer$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(fetch("http://localhost:4567/api/tasks"));

        case 3:
          res = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          _ref = _context2.sent;
          success = _ref.success;
          data = _ref.data;

          if (success) {
            tasks = data.map(function (item) {
              return {
                text: item.title,
                completed: item.completed,
                priority: item.priority_name,
                deadline: item.deadline,
                tags: item.tags
              };
            });
          } else {
            console.error("Server returns error:", data);
          }

          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          console.error("Cannot fetch tasks:", _context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
} // Load data from localStorage


function loadStorage() {
  var savedTasks = localStorage.getItem("tasks");
  var savedBackground = localStorage.getItem("backgroundUrl");
  var mainTitleColor = localStorage.getItem("mainTitleColor");
  var subTitleColor = localStorage.getItem("subTitleColor");

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
} // Setup all event listeners


function setupEventListeners() {
  // Add task events
  addBtn.addEventListener("click", function () {
    return setTimeout(addTask, 1000);
  });
  toDoInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
  }); // Input placeholder events

  toDoInput.addEventListener("mouseenter", function () {
    toDoInput.placeholder = "Enter your task...";
  });
  toDoInput.addEventListener("mouseout", function () {
    toDoInput.placeholder = "";
  }); // Title and color picker events

  if (mainTitle) {
    mainTitle.addEventListener("click", handleTitleEdit);
    colorPicker.addEventListener("input", handleMainTitleColorChange);
  }

  if (subColorPicker) {
    subColorPicker.addEventListener("input", handleSubTitleColorChange);
  } // Background image modal events


  setupBackgroundModalEvents(); // Priority modal close button

  var closeModalBtn = document.querySelector(".close-modal");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", hidePriorityModal);
  } //Choose priority options each task


  document.querySelectorAll(".priority-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var priority = btn.dataset.priority;
      var tagsInput = document.getElementById("tagsTask");
      var dateInput = document.getElementById("deadlineDate");
      var timeInput = document.getElementById("deadlineTime");
      var deadline = "";

      if (!dateInput.value || !timeInput.value) {
        var isChooseNoDL = confirm("You didn't choose time or date.Would you mind to choose no deadline in your task?");

        if (!isChooseNoDL) {
          return;
        }
      }

      if (dateInput && timeInput && dateInput.value && timeInput.value) {
        deadline = "".concat(dateInput.value, "T").concat(timeInput.value); //Prevent user to choose previous day for now

        var deadlineTime = new Date("".concat(dateInput.value, "T").concat(timeInput.value));
        var now = new Date();

        if (now > deadlineTime) {
          alert("Can't create deadline from past");
          return;
        }
      }

      if (modalMode === "add") {
        dateInput.value = "";
        timeInput.value = "";
        var tagsConverted = tagsInput.value.match(/#\w+/g);
        var newTask = {
          text: tempText,
          completed: false,
          priority: priority,
          tags: tagsConverted ? tagsConverted.map(function (tag) {
            return tag.replace('#', '');
          }) : [],
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
} // Task management functions


function addTask() {
  var taskText = toDoInput.value.trim();

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
  toDoList.innerHTML = ""; //Using sorted tasks to sort task by priority

  var sortedTasks = _toConsumableArray(tasks).sort(function (a, b) {
    var priorityOrder = {
      high: 0,
      medium: 1,
      low: 2
    };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  sortedTasks.forEach(function (task) {
    //Create li element        
    var li = createTaskElement(task, tasks.indexOf(task)); //Add to to-do list

    toDoList.append(li);
    updateTaskCount();
  });
}

function showPriorityModal() {
  var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "add";
  var taskIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  modalMode = mode;
  currentTaskIndex = taskIndex;
  document.getElementById("priorityModal").classList.remove("hidden");
}

function hidePriorityModal() {
  var modal = document.getElementById("priorityModal");
  modal.classList.add("closing");
  setTimeout(function () {
    modal.classList.add("hidden");
    modal.classList.remove("closing");
  }, 300);
}

function createTaskElement(task, index) {
  var li = document.createElement("li");
  var span = document.createElement("span");
  span.textContent = task.text;
  span.classList.add(task.completed ? "completed" : "to-do");
  var tags = document.createElement("div");
  tags.classList.add("task-tags");

  if (Array.isArray(task.tags)) {
    task.tags.forEach(function (tag) {
      var tagSpan = document.createElement("span");
      tagSpan.innerText = "#".concat(tag);
      tagSpan.style.backgroundColor = "#f0f0f0";
      tagSpan.style.color = "#333";
      tagSpan.style.borderRadius = "12px";
      tagSpan.style.padding = "2px 8px";
      tagSpan.style.margin = "2px";
      tagSpan.style.fontSize = "0.8em";
      tagSpan.style.display = "inline-block";
      tags.appendChild(tagSpan);
    });
  } // Task completion event


  li.addEventListener("click", function () {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTask();
  }); // Add buttons

  var delBtn = createButton("Remove", function () {
    return openDialog("remove", index);
  });
  var editBtn = createButton("Edit", function () {
    return handleEditTask(index, task.text);
  });
  var priorityBtn = createPriority(task, li);
  var deadline = createDeadline();
  li.appendChild(span);
  li.appendChild(delBtn);
  li.appendChild(editBtn);
  li.appendChild(priorityBtn);
  li.appendChild(deadline);
  li.appendChild(tags);
  return li;
}

function createButton(text, onClick) {
  var button = document.createElement("button");
  button.innerText = text;
  button.style.margin = "0 10px";
  button.addEventListener("click", function (e) {
    e.stopPropagation();
    onClick();
  });
  return button;
}

function editPriority(task) {
  var index = tasks.indexOf(task);
  showPriorityModal("edit", index);
}

function createPriority(task, li) {
  var priorityText = document.createElement("div");
  priorityText.innerText = task.priority; // Style cho container

  priorityText.style.margin = "0 10px";
  priorityText.style.padding = "4px 12px";
  priorityText.style.borderRadius = "20px";
  priorityText.style.fontWeight = "600";
  priorityText.style.fontSize = "0.9em";
  priorityText.style.textTransform = "capitalize";
  priorityText.style.display = "inline-block";
  priorityText.style.minWidth = "80px";
  priorityText.style.textAlign = "center"; // Style cho border của task

  li.style.borderLeft = "4px solid";
  li.style.margin = "8px 0";
  li.style.transition = "all 0.3s ease"; // Set màu sắc dựa trên priority

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

  priorityText.addEventListener("click", function (e) {
    e.stopPropagation();
    editPriority(task);
  });
  return priorityText;
}

function updateDeadlineDisplays() {
  document.querySelectorAll(".deadline-display").forEach(function (el, i) {
    var task = tasks[i];

    if (task.deadline) {
      var now = new Date();
      var deadlineDate = new Date(task.deadline);
      var diff = deadlineDate - now;
      var timeText = ""; //Calculate time attributes

      if (diff > 0) {
        var hours = Math.floor(diff / (1000 * 60 * 60));
        var minutes = Math.floor(diff / (1000 * 60) % 60);
        var days = Math.floor(hours / 24);
        timeText = "\u23F3 C\xF2n ".concat(days, "d ").concat(hours % 24, "h ").concat(minutes, "m");
        el.style.backgroundColor = diff < 3 * 60 * 60 * 1000 ? "#ffe0e0" : "#e0f7fa";
        el.style.color = diff < 3 * 60 * 60 * 1000 ? "#d32f2f" : "#00796b";
      } else {
        var lateBy = Math.abs(diff);
        var lateHours = Math.floor(lateBy / (1000 * 60 * 60));
        var lateMinutes = Math.floor(lateBy / (1000 * 60) % 60);
        timeText = "\u26A0\uFE0F Tr\u1EC5 ".concat(lateHours, "h ").concat(lateMinutes, "m");
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
  var deadlineDiv = document.createElement("div");
  deadlineDiv.classList.add("deadline-display");
  deadlineDiv.innerText = "⏰ Đang tải deadline..."; //Style

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
} // Event handlers


function handleTitleEdit() {
  var editTitle = prompt("What title do you want to?");

  if (editTitle && editTitle.length !== 0) {
    mainTitle.innerText = editTitle;
  }
}

function handleMainTitleColorChange() {
  var newColor = colorPicker.value;
  setMainTitleColor(newColor);
  localStorage.setItem("mainTitleColor", newColor);
}

function handleSubTitleColorChange() {
  var newColor = subColorPicker.value;
  setSubTitleColor(newColor);
  localStorage.setItem("subTitleColor", newColor);
}

function openDialog(typeDialog, index) {
  switch (typeDialog) {
    case "remove":
      var removeModal = document.getElementById("removeModal");
      removeModal.classList.remove("hidden");
      var message = "Do you want to delete this task";
      removeModal.querySelector(".modal-header h3").innerText = message;
      var yesOption = document.getElementById('yes-option');
      var noOption = document.getElementById('no-option');
      yesOption.addEventListener("click", function () {
        tasks.splice(index, 1);
        saveTasks();
        renderTask();
        removeModal.classList.add("closing");
        setTimeout(function () {
          removeModal.classList.add("hidden");
          removeModal.classList.remove("closing");
        }, 300);
      });
      noOption.addEventListener("click", function () {
        removeModal.classList.add("closing");
        setTimeout(function () {
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
  var editModal = document.getElementById("editModal");
  var editInput = document.getElementById("editInput");
  editInput.value = currentText;
  editModal.classList.remove("hidden");
  var saveEdit = document.getElementById("saveEdit");
  var cancelEdit = document.getElementById("cancelEdit");

  var closeEditModal = function closeEditModal() {
    editModal.classList.add("closing");
    setTimeout(function () {
      editModal.classList.add("hidden");
      editModal.classList.remove("closing");
    }, 300);
  };

  saveEdit.onclick = function () {
    var newText = editInput.value.trim();

    if (newText) {
      tasks[index].text = newText;
      saveTasks();
      renderTask();
    }

    closeEditModal();
  };

  cancelEdit.onclick = closeEditModal;
} // Utility functions


function setMainTitleColor(color) {
  mainTitle.style.color = color;
  colorPicker.value = color;
}

function setSubTitleColor(color) {
  h2Task.style.color = color;
  subColorPicker.value = color;
}

function setBackgroundImage(url) {
  document.body.style.backgroundImage = "url(".concat(url, ")");
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.minHeight = "100vh";
}

function updateTaskCount() {
  h2Task.innerText = totalText + tasks.length;
} // Background modal setup


function setupBackgroundModalEvents() {
  var openModalBtn = document.getElementById("openModal");
  var modal = document.getElementById("modal");
  var closeModalBtn = document.getElementById("closeModal");
  var images = document.querySelectorAll(".image-options img");
  modal.classList.add("hidden", "hide");
  openModalBtn.addEventListener("click", function () {
    modal.classList.remove("hidden", "hide");
    modal.classList.add("show");
  });
  closeModalBtn.addEventListener("click", function () {
    modal.classList.remove("show");
    modal.classList.add("hidden");
  });
  modal.addEventListener("animationend", function (e) {
    if (e.animationName === "fadeOutScale") {
      modal.classList.add("hidden");
    }
  });
  images.forEach(function (img) {
    img.addEventListener("click", function () {
      var url = img.getAttribute("data-url");
      setBackgroundImage(url);
      localStorage.setItem("backgroundUrl", url);
    });
  });
}