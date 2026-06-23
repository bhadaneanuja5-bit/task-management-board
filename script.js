function saveTasks() {

    const tasks = [];

    document.querySelectorAll(".task").forEach(task => {

        tasks.push({
            title: task.querySelector("h2").innerText,
            description: task.querySelector("p").innerText,
            status: task.parentElement.id
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".bg");

const toggleModalBtn = document.querySelector("#toggle-modal");
const addTaskBtn = document.querySelector("#add-new-task");

const titleInput = document.querySelector("input");
const descriptionInput = document.querySelector("textarea");

let dragElement = null;

// Open Modal
toggleModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

// Close Modal
modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Task Count
function updateCounts() {
    document.querySelector("#todo .right").textContent =
        todo.querySelectorAll(".task").length;

    document.querySelector("#progress .right").textContent =
        progress.querySelectorAll(".task").length;

    document.querySelector("#done .right").textContent =
        done.querySelectorAll(".task").length;
}

// Drag Event
function addDragEvent(task) {
    task.addEventListener("dragstart", () => {
        dragElement = task;
    });
}

// Delete Event
function addDeleteEvent(task) {
    task.querySelector("button").addEventListener("click", () => {
        task.remove();
        updateCounts();
        saveTasks();
        
    });
}

// Existing Tasks
document.querySelectorAll(".task").forEach(task => {
    addDragEvent(task);
    addDeleteEvent(task);
});

// Add Task
addTaskBtn.addEventListener("click", () => {

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    const task = document.createElement("div");

    task.classList.add("task");
    task.setAttribute("draggable", "true");

    task.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;

    addDragEvent(task);
    addDeleteEvent(task);

    todo.appendChild(task);

    titleInput.value = "";
    descriptionInput.value = "";

    modal.classList.remove("active");

    updateCounts();
    saveTasks();
});

// Drag and Drop
function addDragEventsOnColumn(column) {

    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    column.addEventListener("dragleave", () => {
        column.classList.remove("hover-over");
    });

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    column.addEventListener("drop", (e) => {

        e.preventDefault();

        if (dragElement) {
            column.appendChild(dragElement);
        }

        column.classList.remove("hover-over");

        updateCounts();
        saveTasks();
    });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

window.addEventListener("load", () => {

    const savedTasks =
        JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(taskData => {

        const task = document.createElement("div");

        task.classList.add("task");
        task.setAttribute("draggable", "true");

        task.innerHTML = `
            <h2>${taskData.title}</h2>
            <p>${taskData.description}</p>
            <button>Delete</button>
        `;

        addDragEvent(task);
        addDeleteEvent(task);

        document
            .getElementById(taskData.status)
            .appendChild(task);
    });

    updateCounts();
});

updateCounts();
