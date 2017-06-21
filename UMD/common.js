
(function (factory) {
if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
       
        window.common=factory()

    }
}(function () {
let taskList = new Array();
function addTask(x) {
    if (!(x == "" || x == null)) {
        var task = {
            name: x,
            status: "undone"
        };
        taskList.push(task);
    }
}

function deleteTask(x) {
    taskList.splice(x, 1);
}

function editTask(x, str) {
    getTasks().undoneTasks[x].name = str;
}

function done(x) {
    getTasks().undoneTasks[x].status = "done";
}

function undone(x) {
    getTasks().doneTasks[x].status = "undone";
}

function getTasks() {
    const doneTasks = []
    const undoneTasks = []
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].status=="done") {
            doneTasks.push(taskList[i])
        } else {
            undoneTasks.push(taskList[i])
        }
    }

    const final = {
        doneTasks: doneTasks,
        undoneTasks: undoneTasks
    }
    return final
}


 function toStr(){
    return JSON.stringify(taskList);
 }
 function setTaskList(x){
    taskList = JSON.parse(x);
 } 
 function emptyTasks(){
     taskList=[];
 }
 function remove(x){
     if(x==null){
         return taskList.pop();
     }
     else{
         return taskList.splice(x, 1);
     }
 }

 function lengthList(){
     return taskList.length;
 }

return{
    remove:remove,
    lengthList:lengthList,
    emptyTasks:emptyTasks,
    setTaskList:setTaskList,
    toStr:toStr,
    addTask:addTask,
    deleteTask:deleteTask,
    editTask:editTask,
    done:done,
    undone:undone,
    getTasks:getTasks
}


}));