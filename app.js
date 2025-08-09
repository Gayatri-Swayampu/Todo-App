let tasks = [];

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    tasks = storedTasks;
    updateTaskList();
    updateStats();
  }
});

const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addTask();
});

document.getElementById("priorityFilter").addEventListener("change", updateTaskList);

document.getElementById("sortDueDate").addEventListener("click", () => {
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  updateTaskList();
});

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const dueDate = document.getElementById("dueDateInput").value;
  const priority = document.getElementById("priorityInput").value;

  if (text && dueDate && priority) {
    tasks.push({ text, dueDate, priority, completed: false });
    clearInputs();
    updateTaskList();
    updateStats();
    saveTasks();
  }
}

function clearInputs() {
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  document.getElementById("priorityInput").value = "";
}

function updateTaskList() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const filter = document.getElementById("priorityFilter").value;
  const visibleTasks = filter === "all" ? tasks : tasks.filter(t => t.priority === filter);

  document.getElementById("filterSortContainer").style.display = tasks.length > 0 ? "flex" : "none";

  visibleTasks.forEach((task, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? "completed" : ""}">
          <input type="checkbox" ${task.completed ? "checked" : ""} />
          <div class="task-details">
            <p>${task.text}</p>
            <small>Due: ${task.dueDate}</small>
            <span class="priority-badge priority-${task.priority}">${task.priority}</span>
          </div>
        </div>
        <div class="icons">
          <img src="./img/edit.png" alt="Edit" onclick="editTask(${index})" />
          <img src="./img/delete.png" alt="Delete" onclick="deleteTask(${index})" />
        </div>
      </div>
    `;
    listItem.querySelector("input[type='checkbox']").addEventListener("change", () => toggleTaskComplete(index));
    taskList.appendChild(listItem);
  });
}

function toggleTaskComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  updateTaskList();
  updateStats();
  saveTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
}

function editTask(index) {
  const task = tasks[index];
  document.getElementById("taskInput").value = task.text;
  document.getElementById("dueDateInput").value = task.dueDate;
  document.getElementById("priorityInput").value = task.priority;
  tasks.splice(index, 1);
  updateTaskList();
  updateStats();
  saveTasks();
}

function updateStats() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  document.getElementById("progress").style.width = `${progress}%`;
  document.getElementById("numbers").innerText = `${completedTasks} / ${totalTasks}`;
}
