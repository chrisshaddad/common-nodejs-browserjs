let taskList = new Array();

while (taskList.length) {
    taskList.pop()
}

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


function isBrowser() {
    return (typeof window != 'undefined')
}

function isNode() {
    return (typeof process != 'undefined')
}

if (isBrowser()) {


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

    function saveAndPrint() {
        saveTaskList();
        printTaskList();
    }


    function addTaskBrowser(x) {
        addTask(x);
        saveAndPrint();
        document.getElementById('addBox').value = "";
    }

    function deleteTaskBrowser(x) {
        if (confirm("Are you sure you want to delete task number: " + (x + 1))) {
            deleteTask(x);
            saveAndPrint();
        }
    }

    function editTaskBrowser(x, str) {
        editTask(x, str);
        saveAndPrint();
    }

    function doneBrowser(x) {
        done(x);
        saveAndPrint();
    }

    function undoneBrowser(x) {
        undone(x);
        saveAndPrint();
    }

    function taskTemplate(done, task, i) {
        return "<input type='text' value='" + task.name + "' id='task" + i + "' " + (done ? "disabled" : "") + ">" +
            "<input type='button' value='DELETE' onclick='deleteTaskBrowser(" + i + ")'/>" +
            "<input type='button' value='" + (done ? "UNDO" : "DO") + "' onclick='" + (done ? "undoneBrowser" : "doneBrowser") + "(" + i + ")'/>" +
            (done ? "" : "<input type='button' value='SAVE' onclick='editTaskBrowser(" + i + ",document.getElementById(\"task" + i + "\").value)'>");
    }

    const taskDoneTemplate = taskTemplate.bind(null, false)
    const taskUndoneTemplate = taskTemplate.bind(null, true)

    const undoneList = document.getElementById('undoneList');
    const doneList = document.getElementById('doneList');

    function printTaskList() {

        let strUndone = "";
        let strDone = "";

        const tasks = getTasks();
        const doneTasks = tasks.doneTasks;
        const undoneTasks = tasks.undoneTasks;

        for (let i = 0; i < undoneTasks.length; i++) {

            strUndone += "<li>" + taskDoneTemplate(undoneTasks[i], i) + "</li>\n";
        }

        for (let i = 0; i < doneTasks.length; i++) {

            strDone += "<li>" + taskUndoneTemplate(doneTasks[i], i) + "</li>\n";

        }


        undoneList.innerHTML = strUndone;
        doneList.innerHTML = strDone;
    }

    document.getElementById('add').addEventListener("click", function () {
        addTaskBrowser(document.getElementById('addBox').value);
    });
    document.getElementById('reset').addEventListener("click", clearTasks);
    document.getElementById('addBox').addEventListener("keydown", function (e) {
        if (e.keyCode == 13) addTaskBrowser(document.getElementById('addBox').value);
    });

    initTaskList();
    printTaskList();

} else if (isNode()) {
    'use strict';
    var fs = require('fs');

    function startApp(name) {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', onDataReceived);
        console.log("Welcome to " + name + "'s application!");
        console.log("--------------------");
    }
    var commands = {
        exit: quit,
        quit: quit,
        help: help,
        list: list,
        save: save,
        load: load,
        hello: hello,
        add: addTaskNode,
        remove: remove,
        editMode: editMode,
        edit: editTaskNode,
        done: doneNode,
        undone: undoneNode
    }

function onDataReceived(text) {

  var input = text.replace(/\s+/g, " ").trim();
  var inputArgs = input.split(" ");
  var command = inputArgs[0]
  var arg = inputArgs[1]


  if (mode == "normal") {

    if (command === 'add') {
      commands.add(inputArgs.slice(1).join(" "));
    } else if (command === 'edit') {
      currentEditedTaskNumber = arg;
      commands.editMode(arg);
    } else if (command in commands) {
      commands[command](arg)
    } else {
      unknownCommand(input)
    }

  } else if (mode === "edit") {
    commands.edit(currentEditedTaskNumber,inputArgs[0]);
  }
}

function unknownCommand(c) {
  console.log('\nunknown command: "' + c.trim() + '"\n')
}
function hello(x) {
  if (x == null) {
    console.log('\nhello!\n')
  } else {
    console.log('\nhello ' + x + "!\n");
  }
}

function addTaskNode(x) {
  addTask(x);
  console.log('\nadded task: "' + x + '"\n');
}

function list() {
  console.log("\nhere's the list of undone tasks:")
  for (var i = 0; i < getTasks().undoneTasks.length; i++) {
    console.log((i + 1) + " - " + getTasks().undoneTasks[i].name);
  }

  console.log(" \nhere's the list of done tasks:");
  for (var i = 0; i < getTasks().doneTasks.length; i++) {
    console.log((i + 1) + " - " + getTasks().doneTasks[i].name);
  }
}
function quit() {

  console.log('\nQuitting now, goodbye!')
  process.exit();

}
function remove(x) {
  if (x == null) {
    console.log('\nremoved task:"' + taskList.pop().name + '"\n');
  } else if (/\d+/.test(x)) {
    if (x < 0 || (x >= taskList.length + 1) || isNaN(x)) {
      console.log("\nindex not in array or you haven't entered a number\n");
    } else {
      console.log('removed task: "' + taskList.splice(x, 1).name + '"\n');
    }
  }
}
function editMode(x) {

  if (x <= getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    mode = "edit";
    console.log("\nedit mode\n");
    console.log("editing task: " +  getTasks().undoneTasks[x - 1].name + "\n");
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " +  getTasks().undoneTasks.length)
  }
}

function editTaskNode(index, x) {
  editTask(index,x);
  console.log("\ntask edited\n");
  mode="normal";
}
function doneNode(x) {
  if (x <= getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    const index = x-1;
    const message = "\ndid task: " + getTasks().undoneTasks[index].name
    done(index);
    console.log(message);
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " + getTasks().undoneTasks.length)
  }
}

function undoneNode(x) {
  if (x <= getTasks().doneTasks.length && x > 0 && (/\d+/.test(x))) {
    const index = x-1;
    const message = "\nundid task: " + getTasks().doneTasks[index].name
    console.log("index",index)
    undone(index);
    console.log(message);
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " + getTasks().doneTasks.length)
  }
}

function save() {
  if (!process.argv[2]) {
    saveFile('file.json');
  } else {
    saveFile(process.argv[2]);
  }
}

function save() {
  if (!process.argv[2]) {
    saveFile('file.json');
  } else {
    saveFile(process.argv[2]);
  }
}

function saveFile(name) {
  console.log('saving to', name)
  if (taskList.length > 0) {
    var str = JSON.stringify(taskList);
    fs.writeFile(name, str, {
      encoding: 'utf8'
    }, function (err) {
      if (err) {
        console.error('there was an error: ', err);
        return;
      } else {
        console.log('all good, thanks\n')
      }
    });
    console.log('\ndata was appended to file\n');
  } else {
    console.log("\nyour console is empty\n")
  }
}

function load() {

  if (!process.argv[2]) {
    loadFile('file.json');
  } else {
    loadFile(process.argv[2]);
  }
}

function loadFile(name) {
  console.log("\nfile is loaded\n")
  fs.readFile(name, 'utf8', function (err, data) {
    if (err) throw err;
    taskList = JSON.parse(data);
  });
}

function help() {
  console.log(
    '\nHere is a list of all possible commands: \n' +
    'hello - Simple Hello! \n' +
    'hello "yourname" - shows your name with the hello\n' +
    'quit - quits the application \nexit - exists the application  \n' +
    'add "task"- adds a task \n' +
    'list - lists taskList  \n' +
    'remove - removes the last task in the list \n' +
    'remove "index" - removes the task at that index \n' +
    'edit - enters edit mode\n' +
    'edit "index" - enters edit mode at that index\n' +
    'do "index" - changes a taskList status to done\n' +
    'undo "index" - changes a taskList status to undone\n' +
    'save - saves the taskList in a file\n');
}
let mode = "normal";
let currentEditedTaskNumber = 0


startApp("Chriss Haddad")

} else {
    console.log("I have no idea where you're running this")
}