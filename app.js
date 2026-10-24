const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem(todoConfig.storageKey));
    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem(todoConfig.storageKey, JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task!");
        taskInput.focus();
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    saveTasks();
    displayTasks();
    taskInput.value = "";
    taskInput.focus();
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task) {
        const li = document.createElement("li");
        li.className = "flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.className = "w-5 h-5 accent-indigo-600 cursor-pointer";
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "flex-1 min-w-0 break-words text-gray-700";

        if (task.completed) {
            span.classList.add("line-through", "text-gray-400");
        }

        if (todoConfig.allowDelete) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-md text-sm transition";
            deleteBtn.addEventListener("click", function() {
                tasks = tasks.filter(function(item) {
                    return item.id !== task.id;
                });
                saveTasks();
                displayTasks();
            });
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
        } else {
            li.appendChild(checkbox);
            li.appendChild(span);
        }

        taskList.appendChild(li);
    });

    const remaining = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remaining + (remaining === 1 ? " remaining" : " remaining");
    emptyMessage.classList.toggle("hidden", tasks.length > 0);
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();
