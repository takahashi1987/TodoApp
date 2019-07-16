$("#js-form").on("submit", task)

function task(){
  alert("コールバックで呼び出し");
}


const request = new XMLHttpRequest();
request.open("GET", `http://localhost:3100/tasks`);
request.send();

console.log(request)






// 関数定義
// $('#toggle').on('click', toggle);
//
// function toggle() {
//   $('#target').toggle("slow");
//   $('#target').css("background","red");
// }
// toggle()という関数を定義して、コールバックに指定しています。


// $('#toggle').on('click', function() {
//   $('#target').toggle("slow");
//   $('#target').css("background","red");
// });
// 関数に名前をつけずに処理をまとめただけの言ってしまえば使い捨ての関数




// イベントの設定にはon()メソッドを使用します。
// on()は取得した要素にイベントを設定するものです。
// $('要素').on('イベント', イベントハンドラ);
