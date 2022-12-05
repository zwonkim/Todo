//api에서 todo 생성
async function createTodo(title, order) {
  const todo = document.getElementById("todo");
  const todos = await getTodoList();
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "apikey": "FcKdtJs202209",
        "username": "KDT3_KimJiWon",
      },
      body: JSON.stringify({
        title: todo.value,
        order: todos.length,
      }),
    }
  );
  const json = await res.json();
  return json;
}

//api 수정
async function modifyTodo(id, { title, done }) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "apikey": "FcKdtJs202209",
        "username": "KDT3_KimJiWon",
      },
      body: JSON.stringify({
        id,
        title,
        done,
      }),
    }
  );
  const json = await res.json();
  return json;
}

//생성된 todo 화면에 출력
async function renderTodo() {
  document.getElementById("todo-list").innerHTML = "";
  let todo = document.getElementById("todo");
  const list = document.getElementById("todo-list");
  document.querySelector(".loader-container").classList.remove("hidden");
  const todos = await getTodoList();
  document.querySelector(".loader-container").classList.add("hidden");

  for (todo of todos) {
    const listItem = document.createElement("li");
    const btnBox = document.createElement("div");

    // 체크버튼
    const checkBtn = document.createElement("input");
    checkBtn.setAttribute("type", "checkbox");
    checkBtn.setAttribute("id", `checkBtn-${todo.id}`);
    checkBtn.addEventListener("change", async (e) => {
      let checkBtnId = e.target.id;
      checkBtnId = checkBtnId.split("-")[1];
      document.getElementById(`${checkBtnId}`).classList.add("done");
      let id = checkBtnId;
      let title = document.getElementById(id).dataset.title;
      let done = true;
      modifyTodo(id, { title, done });
    });

    // X 버튼
    const xBtn = document.createElement("button");
    xBtn.setAttribute("data-id", `${todo.id}`);
    xBtn.setAttribute("id", `xBtn-${todo.id}`);
    xBtn.innerText = "X";

    // 수정 버튼
    const modifyBtn = document.createElement("button");
    modifyBtn.innerText = "수정";

    // listItem
    listItem.className = "todo";
    btnBox.className = "btn-box";
    checkBtn.className = "check-btn";
    xBtn.className = "x-btn";
    modifyBtn.className = "modify-btn";
    listItem.innerText = todo.title;
    listItem.setAttribute("id", `${todo.id}`);
    listItem.setAttribute("data-title", `${todo.title}`);
    listItem.setAttribute("data-done", `${todo.done}`);
    xBtn.addEventListener("click", async (e) => {
      document.getElementById(e.target.dataset.id).remove();
      await removeTodo(e.target.dataset.id);
    });
    btnBox.appendChild(checkBtn);
    btnBox.appendChild(xBtn);
    btnBox.appendChild(modifyBtn);
    listItem.appendChild(btnBox);
    if (todo.done === true) {
      listItem.classList.add("done");
    }
    list.appendChild(listItem);
    document.getElementById("todo").value = null;

    //수정하기 버튼
    modifyBtn.addEventListener("click", (e) => {
      const modal = document.querySelector(".modal");
      modal.classList.remove("hidden");
      const id = e.target.previousSibling.dataset.id;
      modal.setAttribute("id", `${id}`);
    });
  }
}

//엔터키
document.getElementById("todo").addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.key === "Enter" && !e.isComposing) {
    document.getElementById("add-button").click();
  }
});

//수정(모달) 취소
document.getElementById("submit-cancel").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("modify-input").value = null;
  const modal = document.querySelector(".modal");
  modal.classList.add("hidden");
});

//수정(모달) 제출
document
  .getElementById("submit-modify")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const modifyInput = document.getElementById("modify-input");
    const modalEl = document.querySelector(".modal");
    console.log(modalEl);

    let id = modalEl.id;
    let title = document.getElementById("modify-input").value;
    let done = document.getElementById(id).dataset.done;

    const modal = document.querySelector(".modal");
    modal.classList.add("hidden");

    await modifyTodo(id, { title, done });
    await renderTodo();
    modifyInput.value = null;
  });

//추가하기 버튼
document
  .getElementById("add-button")
  .addEventListener("click", async (title) => {
    await createTodo(title);
    renderTodo();
  });

//완료된 항목만 출력
async function renderComplete() {
  document.querySelector(".loader-container").classList.remove("hidden");
  const todos = await getTodoList();
  document.querySelector(".loader-container").classList.add("hidden");
  for (let todo of todos) {
    if (todo.done === true) {
      const list = document.getElementById("todo-list");
      const listItem = document.createElement("li");
      listItem.className = "completeTodo";
      listItem.innerText = todo.title;
      list.appendChild(listItem);
    }
  }
}

//미완료된 항목만 출력
async function renderIncomplete() {
  document.querySelector(".loader-container").classList.remove("hidden");
  const todos = await getTodoList();
  document.querySelector(".loader-container").classList.add("hidden");
  for (let todo of todos) {
    if (todo.done === false) {
      const list = document.getElementById("todo-list");
      const listItem = document.createElement("li");
      listItem.className = "incompleteTodo";
      listItem.innerText = todo.title;
      list.appendChild(listItem);
    }
  }
}

//전체 보기 버튼
document.querySelector(".show-all").addEventListener("click", () => {
  renderTodo();
});

//완료 버튼
document.querySelector(".completed").addEventListener("click", () => {
  document.getElementById("todo-list").innerHTML = "";
  renderComplete();
});

//미완료 버튼
document.querySelector(".incomplete").addEventListener("click", () => {
  document.getElementById("todo-list").innerHTML = "";
  renderIncomplete();
});

//api에서 todo 삭제
async function removeTodo(id) {
  const res = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "apikey": "FcKdtJs202209",
        "username": "KDT3_KimJiWon",
      },
    }
  );
  const json = await res.json();
  return json;
}

//화면에서 todo 삭제
function eraseTodo() {
  let xBtn = document.createElement("button");
  xBtn.addEventListener("click", (e) => {
    const pNode = e.target.parentNode;
    list.removeChild(pNode);
    removeTodo();
  });
}

//api 정보 불러오기
async function getTodoList() {
  const res = await fetch(
    "https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos",
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "apikey": "FcKdtJs202209",
        "username": "KDT3_KimJiWon",
      },
    }
  );
  const json = await res.json();
  return json;
}

(async function () {
  renderTodo();
})();
