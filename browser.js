var taskList = new Array();

function initTaskList() {
  if (localStorage.getItem("tasks") === null) {
    localStorage.setItem("tasks", "[]");
  } else taskList = JSON.parse(localStorage.getItem("tasks"));
}

function clearTasks() {
  if (confirm("Are you sure you want to clear all your tasks?")) {
    taskList = [];
    saveAndPrint();
    alert("Task list was cleared");

  }
}

function saveTaskList() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

function saveAndPrint(){
  saveTaskList();
  printTaskList();
}

function addTask(x) {
  if (!(x == "" || x == null)) {
    var task = {
      name: x,
      status: "undone"
    };
    taskList.push(task);
    saveAndPrint();
    document.getElementById('addBox').value = "";
  }
}

function deleteTask(x) {
  if (confirm("Are you sure you want to delete task number: " + (x + 1))) {
    taskList.splice(x, 1);
    saveAndPrint();
  }
}

function editTask(x, str) {
  getTasks.undoneTasks[x].name = str;
  saveAndPrint();
}

function done(x) {
  getTasks().undoneTasks[x].status = "done";
  saveAndPrint();
}

function undone(x) {
  getTasks().doneTasks[x].status = "undone";
  saveAndPrint();
}

function getTasks(){
      const doneTasks = []
    const undoneTasks = []
    for(var i=0;i<taskList.length;i++){
        if(taskList[i].status=="done"){
            doneTasks.push(taskList[i])
        }
        else{
            undoneTasks.push(taskList[i])
        }
    }
    const final = {doneTasks:doneTasks,undoneTasks:undoneTasks}
    return final
}

function taskTemplate(done,task,i){
  return "<input type='text' value='" + task.name + "' id='task" + i + "' "+(done?"disabled":"")+">" +
  "<input type='button' value='DELETE' onclick='deleteTask(" + i + ")'/>" +
  "<input type='button' value='"+(done?"UNDO":"DO")+"' onclick='"+(done?"undone":"done")+"(" + i + ")'/>" +
  (done?"":"<input type='button' value='SAVE' onclick='editTask(" + i + ",document.getElementById(\"task" + i + "\").value)'>");
}

const taskDoneTemplate = taskTemplate.bind(null,false)
const taskUndoneTemplate = taskTemplate.bind(null,true)

const undoneList = document.getElementById('undoneList');
const doneList = document.getElementById('doneList');

function printTaskList() {
  
  let strUndone = "";
  let strDone = "";
  
  const tasks = getTasks();
  const doneTasks = tasks.doneTasks;
  const undoneTasks = tasks.undoneTasks;

  for (let i = 0; i < undoneTasks.length; i++) {
     
      strUndone += "<li>" + taskDoneTemplate(undoneTasks[i],i) + "</li>\n";
  }

  for (let i = 0; i < doneTasks.length; i++) {
     
      strDone += "<li>" + taskUndoneTemplate(doneTasks[i],i) + "</li>\n";
      
  } 
  

  undoneList.innerHTML = strUndone;
  doneList.innerHTML = strDone;
}

document.getElementById('add').addEventListener("click", function () {
  addTask(document.getElementById('addBox').value);
});
document.getElementById('reset').addEventListener("click", clearTasks);
document.getElementById('addBox').addEventListener("keydown",function(e){if(e.keyCode==13)addTask(document.getElementById('addBox').value);});

initTaskList();
printTaskList();