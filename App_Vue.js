new Vue({
  el: "#todoapp",
  // 一覧表示
  data(){
    return {
      tasks: [],
      newTask: ""
    }
  },
  mounted(){
    axios
      .get("http://localhost:3100/tasks")
      .then((tasks) => {
        this.tasks = tasks.data.reverse()
      })
  },
  // 追加
  methods: {
    addTask(e){
      if(this.newTask === ""){
        alert("タスクを入力してください")
      } else {
        axios
          .post("http://localhost:3100/tasks", {
            title: this.newTask
          })
          .then((task) => {
            this.tasks.unshift(task.data)
            this.newTask = ""
          })
      }
    },
    // 削除
    onDelete(task, index){
      axios
        .delete(`http://localhost:3100/tasks/${task.id}`)
        .then(() => {
          this.tasks.splice(index, 1)
        })
    },
    // チェック
    onCheck(task, index){
      axios
        .patch(`http://localhost:3100/tasks/${task.id}`)
        .then((task) => {
          this.tasks.splice(index, 1, task.data)

        })
    }
  }
})
