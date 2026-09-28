const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalCount = document.getElementById("totalCount");
const activeCount = document.getElementById("activeCount");
const doneCount = document.getElementById("doneCount");

const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let currentFilter = "all";

// Add task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.unshift(task);

    saveTasks();
    taskInput.value = "";
    taskInput.focus();

    renderTasks();
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");
        li.className = `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
            <div class="checkbox"></div>
            <div class="task-text"></div>
            <button class="delete-btn" title="Delete task">✕</button>
        `;

        li.querySelector(".task-text").textContent = task.text;

        // Complete task
        li.querySelector(".checkbox").addEventListener("click", () => {
            toggleTask(task.id);
        });

        // Delete task
        li.querySelector(".delete-btn").addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    });

    updateStats();

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Toggle task
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    doneCount.textContent = completed;
}

// Save tasks
function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

// Filter buttons
document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });

});

// Clear completed
clearBtn.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();

});

// Add button
addBtn.addEventListener("click", addTask);

// Enter key
taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }

});

// Dark/light theme
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    const isLight = document.body.classList.contains("light");

    themeBtn.textContent = isLight ? "☀️" : "🌙";

    localStorage.setItem("taskflow-theme", isLight ? "light" : "dark");
});

// Load saved theme
const savedTheme = localStorage.getItem("taskflow-theme");

if (savedTheme === "light") {
    document.body.classList.add("light");
    themeBtn.textContent = "☀️";
}

// Initial render
renderTasks();
