export class App {
  mount(){
    const formElement = document.getElementById("js-form");
    const containerElement = document.getElementById("js-todo-list");
    const todoItemCountElement = document.getElementById("js-todo-count");

    // 一覧表示
    const request = new XMLHttpRequest();
    request.open("GET", `http://localhost:3100/tasks`);
    request.send();
    request.addEventListener("load", (e) => {
      // タスク一覧
      const tasks = JSON.parse(e.target.responseText);
      // Todo数
      const count = `${tasks.length}`;
      //Todo数 数値変換
      const todoItemCount = Number(count);
      // Todo数 代入
      todoItemCountElement.textContent = todoItemCount;

      tasks.forEach((task) => {
        // id取得
        const id = task.id
        // statusで表示切り替え
        if (task.status === "completed"){containerElement.insertAdjacentHTML("afterbegin",
          `<li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id} checked><s data-strike-id="${id}">${task.title}</s><button class="delete" data-delete-id=${id}>x</button></input></li>`
          );
        } else {containerElement.insertAdjacentHTML("afterbegin",
          `<li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id}><span data-title-id=${id}>${task.title}</span><button class="delete" data-delete-id=${id}>x</button></input></li>`
          );
        }
      });

      // 削除イベント関数
      const deleteEvent = (e) => {
        const request = new XMLHttpRequest();
        request.open("DELETE", `http://localhost:3100/tasks/${e.target.dataset.deleteId}`);
        request.send();
        // Todo HTML要素 取得
        const taskElement = e.srcElement.offsetParent
        // Todo HTML要素 削除
        taskElement.outerHTML = ''
        // Todo数 取得
        let todoItemCount = Number(todoItemCountElement.textContent);
        // Todo数 マイナス1
        todoItemCount -= 1;
        // Todo数 代入
        todoItemCountElement.textContent = todoItemCount;
      }

      // 削除
      const deleteElements = document.querySelectorAll(".delete")
      deleteElements.forEach((deleteElement) => {
        deleteElement.addEventListener("click", deleteEvent, false);
      });

      // チェックボックスイベント関数
      const checkBoxEvent = (e) => {
        // id取得
        const id = e.target.dataset.checkboxId
        if (e.srcElement.checked === true){
          const request = new XMLHttpRequest();
          request.open("PATCH", `http://localhost:3100/tasks/${id}`);
          request.send();
          // Todoタイトル HTML要素取得(Todoタイトル用)
          const taskTitleElement = document.querySelector(`[data-title-id="${id}"]`);
          // Todo HTML要素 取得
          const taskElement = e.srcElement.offsetParent
          // Todo HTML要素 打ち消し線 追加
          taskElement.outerHTML = `<li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id} checked><s data-strike-id="${id}">${taskTitleElement.textContent}</s><button class="delete" data-delete-id=${id}>x</button></input></li>`
          // チェックボックス HTML要素
          const checkBoxElement = document.querySelector(`[data-checkbox-id="${id}"]`)
          // イベント設定
          checkBoxElement.addEventListener("change", checkBoxEvent, false);
          // デリートボタンHTML要素
          const deleteElement = document.querySelector(`[data-delete-id="${id}"]`)
          // イベント設定
          deleteElement.addEventListener("click", deleteEvent, false);
        } else {
          const request = new XMLHttpRequest();
          request.open("PATCH", `http://localhost:3100/tasks/${id}`);
          request.send();
          // 打ち消し線 HTML要素取得(Todoタイトル用)
          const strikeElement = document.querySelector(`[data-strike-id="${id}"]`);
          // Todo HTML要素 取得
          const taskElement = e.srcElement.offsetParent
          // Todo HTML要素 打ち消し線 削除
          taskElement.outerHTML = `<li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id}><span data-title-id=${id}>${strikeElement.textContent}</span><button class="delete" data-delete-id=${id}>x</button></input></li>`
          // チェックボックス HTML要素
          const checkBoxElement = document.querySelector(`[data-checkbox-id="${id}"]`);
          // イベント設定
          checkBoxElement.addEventListener("change", checkBoxEvent, false);
          // デリートボタン HTML要素
          const deleteElement = document.querySelector(`[data-delete-id="${id}"]`)
          // イベント設定
          deleteElement.addEventListener("click", deleteEvent, false);
        }
      }

      // チェックボックス
      const checkBoxElements = document.querySelectorAll(".checkbox")
      checkBoxElements.forEach((checkBoxElement) => {
        checkBoxElement.addEventListener("change", checkBoxEvent, false);
      });

      // タスク登録 関数
      formElement.addEventListener("submit", (e) => {
        // リロードしない処理
        e.preventDefault();
        // インプット HTML要素
        const inputElement = document.getElementById("js-form-input");

        const request = new XMLHttpRequest();
        request.open("POST", `http://localhost:3100/tasks`);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // Todoタイトル 取得
        const task = `title=${inputElement.value}`;
        request.send(task);

        // リクエストが終了したら実行
        request.onload = (e) => {
          // レスポンス内容取得
          const newTaskResponse = JSON.parse(e.target.responseText);
          // id取得
          const id = newTaskResponse.id
          // 各dataにidを設定
          containerElement.insertAdjacentHTML("afterbegin", `
            <li class="task" data-name=${id}><input type="checkbox" class="checkbox" data-checkbox-id=${id}><span data-title-id=${id}>${newTaskResponse.title}</span><button class="delete" data-delete-id=${id}>x</button></input></li>
          `);
          // チェックボックス HTML要素
          const checkBoxElement = document.querySelector(`[data-checkbox-id="${id}"]`);
          // イベント設定
          checkBoxElement.addEventListener("change", checkBoxEvent, false);
          // デリートボタン HTML要素
          const deleteElement = document.querySelector(`[data-delete-id="${id}"]`)
          // イベント設定
          deleteElement.addEventListener("click", deleteEvent, false);
        }
        inputElement.value = "";
        // Todo数 取得
        let todoItemCount = Number(todoItemCountElement.textContent);
        // Todo数 プラス1
        todoItemCount += 1;
        // Todo数 代入
        todoItemCountElement.textContent = todoItemCount;
      });
    }); // 一覧表示終了
  }
}
