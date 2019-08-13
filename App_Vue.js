new Vue({
  el: "#todoapp",
  data(){
    return {
      tasks: [],
      newTask: "",
      token:"",
      name:"",
      password:""
    }
  },
  mounted(){
    if(Cookies.get("token")){
      this.token = Cookies.get("token")
      this.getLists()
    }
  },
  // 追加
  methods: {
    addTask(){
      if(this.newTask){
        axios
          .post("http://localhost:3100/tasks", {
            title: this.newTask
          }, {
            headers: { Authorization: `Token ${this.token}` }
          })
          .then((task) => {
            this.tasks.unshift(task.data)
            this.newTask = ""
          })
      } else {
        alert("タスクを入力してください")
      }
    },
    // 削除
    onDelete(task, index){
      axios
        .delete(`http://localhost:3100/tasks/${task.id}`, { headers: { Authorization: `Token ${this.token}` }})
        .then(() => {
          this.tasks.splice(index, 1)
        })
    },
    // チェック
    onCheck(task, index){
      axios
        .patch(`http://localhost:3100/tasks/${task.id}`, {}, { headers: { Authorization: `Token ${this.token}` }})
        .then((task) => {
          this.tasks.splice(index, 1, task.data)
        })
    },
    // 一覧
    getLists(){
      axios
        .get("http://localhost:3100/tasks", { headers: { Authorization: `Token ${this.token}` }})
        .then((tasks) => {
          this.tasks = tasks.data.reverse()
        })
    },
    // サインイン
    singIn(){
      axios
        .post("http://localhost:3100/login/login", {
          name: this.name,
          password: this.password
        })
        .then((token) => {
          this.token = token.data
          Cookies.set("token", this.token)
          this.getLists()
       })
       .catch(() => {
         alert("error")
       })
    },
    // サインアウト
    singOut(){
      this.token = ""
      Cookies.remove("token")
    }
  }
})
