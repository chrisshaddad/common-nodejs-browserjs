let taskList = new Array();



// CRUD Create Read Update Delete

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

module.exports={
    taskList:taskList,
    addTask:addTask,
    deleteTask:deleteTask,
    editTask:editTask,
    done:done,
    undone:undone,
    getTasks:getTasks
}