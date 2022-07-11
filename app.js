class Todo {
  input = document.querySelector("input");
  addBtn = document.querySelector(".plus");
  tasksContent = document.querySelector(".tasks-content");
  countedTasks = document.querySelector(".count-tasks span");
  completedTasks = document.querySelector(".completed-tasks span");
  resetBtn = document.getElementById("btn");
  list = [];

  constructor() {
    this.add();
    this.reset();
    this.togglefinish();
    this.removeFromDOM();
  }

  isEmpty() {
    return this.input.value.trim() === "";
  }

  renderToDOM() {
    this.tasksContent.innerHTML = this.render();
  }

  updateList() {
    let data = {};

    data.id = Math.random().toString();
    data.title = this.input.value.trim();
    data.isCompelted = false;

    this.list.push(data);
    Storage.setItem(this.list);
  }

  add() {
    this.addBtn.addEventListener("click", () => {
      if (this.isEmpty()) {
        Swal.fire({
          icon: "error",
          title: "Forbidden...",
          text: "You Mustn't Add An Empty Task!",
        });
        return;
      }

      this.updateList();
      this.renderToDOM();
      this.updateTasksLength();
      this.input.value = "";
    });
  }

  render() {
    let result = "";
    this.list.forEach((list) => {
      result += `
        <span class="task-box" id=${list.id}>
          <h3 class="headThree ${list.isCompelted ? "finished" : ""}">
            ${list.title}
          </h3>
          <span class="delete"><i class="fas fa-trash-alt"></i></span>
        </span>
      `;
    });

    return result;
  }

  inLocalStorage() {
    this.list = Storage.getItem();
    this.renderToDOM();
  }

  updateTasksLength() {
    this.countedTasks.innerHTML = this.list.length;
  }

  togglefinish() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("headThree")) {
        e.target.classList.toggle("finished");
        todo.toggleCompletedTasks(e.target.parentElement.id);
      }
    });
  }

  toggleCompletedTasks(id) {
    const existedItem = this.list.find((list) => list.id === id);
    if (existedItem) {
      existedItem.isCompelted = !existedItem.isCompelted;
    }

    const completedArr = this.list.filter((list) => list.isCompelted === true);
    Storage.setItem(this.list);

    this.completedTasks.innerHTML = completedArr.length;
  }

  removeFromDOM() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-trash-alt")) {
        todo.remove(e.target.parentElement.parentElement.id);
        e.target.parentElement.parentElement.remove();
      }
    });
  }

  remove(id) {
    const remainingArr = this.list.filter((list) => list.id !== id);
    this.list = remainingArr;

    Storage.setItem(remainingArr);
    this.updateTasksLength();
    this.toggleCompletedTasks(id);

    if (this.tasksContent.childElementCount <= 1) {
      this.showEmptyMessage();
    }
  }

  hasChildern() {
    return this.tasksContent.childElementCount !== 0;
  }

  checkContent() {
    if (!this.hasChildern()) {
      this.showEmptyMessage();
    }
  }

  showEmptyMessage() {
    const message = document.getElementById("no-task");
    const messageBody = document.importNode(message.content, true);
    this.tasksContent.append(messageBody);
  }

  reset() {
    this.resetBtn.addEventListener("click", () => {
      this.clear();
    });
  }

  clear() {
    if (this.list.length === 0) {
      return;
    }

    this.list = [];
    Storage.clearItems();

    this.updateTasksLength();
    this.toggleCompletedTasks();
    this.renderToDOM();
    this.showEmptyMessage();
  }
}

const todo = new Todo();

class Storage {
  static getItem() {
    return JSON.parse(localStorage.getItem("todoList")) || [];
  }

  static setItem(data) {
    localStorage.setItem("todoList", JSON.stringify(data));
  }

  static clearItems() {
    localStorage.removeItem("todoList");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  todo.inLocalStorage();
  todo.updateTasksLength();
  todo.toggleCompletedTasks();
  todo.checkContent();
});
