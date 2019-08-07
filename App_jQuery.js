// 一覧
$.ajax({
  url: "http://localhost:3100/tasks",
  type: "GET"
}).then((tasks) => {
  $("#js-todo-count").text(`${tasks.length}`);
  tasks.forEach((task) => {
    if(task.status === "incompleted"){
      addTaskElement(task);
    } else {
      addTaskElement(task);
      $(`[data-title-id=${task.id}]`).addClass("done")
      $(`[data-checkbox-id=${task.id}]`).prop("checked", true)
    }
  });
});

// 削除
const onDelete = (e) => {
  const id = e.target.dataset.deleteId
  $.ajax({
    url: `http://localhost:3100/tasks/${id}`,
    type: "DELETE"
  }).then(() => {
    $(`[data-name=${id}]`).replaceWith("");
    const newCount = parseInt($("#js-todo-count").text()) - 1;
    $("#js-todo-count").text(newCount);
  });
}

// チェック
const onCheck = (e) => {
  const id = e.target.dataset.checkboxId
  if (e.target.checked === true){
    const taskTitle = $(`[data-title-id=${id}]`).text();
    $.ajax({
      url: `http://localhost:3100/tasks/${id}`,
      type: "PATCH"
    }).then(() => {
      $(`[data-title-id=${id}]`).addClass("done")
    });
  } else {
    $.ajax({
      url: `http://localhost:3100/tasks/${id}`,
      type: "PATCH"
    }).then(() => {
      $(`[data-title-id=${id}]`).removeClass("done")
    });
  }
}

// 登録
$("#js-form").on("submit", (e) => {
  e.preventDefault(); // リロードしない処理
  const taskTitle = $("#js-form-input").val();
  $("#js-form-input").val("");
  $.ajax({
    url: "http://localhost:3100/tasks",
    type: "POST",
    data: {title: taskTitle}
  }).then((newTaskResponse) => {
    addTaskElement(newTaskResponse);
    const newCount = parseInt($("#js-todo-count").text()) + 1;
    $("#js-todo-count").text(newCount);
  });
});

// タスクHTML要素作成
const addTaskElement = (task) => {
  const id = task.id
  $("#js-todo-list").prepend(`<li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id}><span data-title-id=${id}>${task.title}</span><button class="delete" data-delete-id=${id}>x</button></input></li>`)
  $(`[data-delete-id=${id}]`).on("click", onDelete)
  $(`[data-checkbox-id=${id}]`).on("click", onCheck)
}
