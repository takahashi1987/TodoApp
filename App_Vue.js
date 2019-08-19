new Vue({
  el: "#todoapp",
  data(){
    return {
      tasks: [],
      newTask: "",
      signedIn: false,
      name:"",
      password:"",
      axios: axios.create({ baseURL: "http://localhost:3100" })
    }
  },
  mounted(){
    if(Cookies.get("token")){
      this.axios.defaults.headers.common["Authorization"] = `Token ${ Cookies.get("token") }`
      this.signedIn = true
      this.getLists()
    }
  },
  // 追加
  methods: {
    addTask(){
      if(this.newTask){
        this.axios
          .post("/tasks", {title: this.newTask})
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
      this.axios
        .delete(`/tasks/${task.id}`)
        .then(() => {
          this.tasks.splice(index, 1)
        })
    },
    // チェック
    onCheck(task, index){
      this.axios
        // .patch(`/tasks/${task.id}`, {}, this.httpClient)
        .patch(`/tasks/${task.id}`)
        .then((task) => {
          this.tasks.splice(index, 1, task.data)
        })
    },
    // サインイン
    singIn(){
      this.axios
        .post("/login", {
          name: this.name,
          password: this.password
        })
        .then((token) => {
          this.axios.defaults.headers.common["Authorization"] = `Token ${ Cookies.set("token", token.data) }`
          this.signedIn = true
          this.getLists()
       })
       .catch(() => {
         alert("error")
       })
    },
     // 一覧
    getLists(){
      this.axios
        .get("/tasks")
        .then((tasks) => {
          this.tasks = tasks.data.reverse()
        })
    },
    // サインアウト
    singOut(){
      delete this.axios.defaults.headers.common["Authorization"]
      Cookies.remove("token")
      this.signedIn = false
      this.name = ""
      this.password = ""
    }
  }
})
