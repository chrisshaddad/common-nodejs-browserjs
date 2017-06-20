   'use strict';
    var fs = require('fs');
    var common = require('./common.js');

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
  common.addTask(x);
  console.log('\nadded task: "' + x + '"\n');
}

function list() {
  console.log("\nhere's the list of undone tasks:")
  for (var i = 0; i < common.getTasks().undoneTasks.length; i++) {
    console.log((i + 1) + " - " + common.getTasks().undoneTasks[i].name);
  }

  console.log(" \nhere's the list of done tasks:");
  for (var i = 0; i < common.getTasks().doneTasks.length; i++) {
    console.log((i + 1) + " - " + common.getTasks().doneTasks[i].name);
  }
}
function quit() {

  console.log('\nQuitting now, goodbye!')
  process.exit();

}
function remove(x) {
  if (x == null) {
    console.log('\nremoved task:"' + common.taskList.pop().name + '"\n');
  } else if (/\d+/.test(x)) {
    if (x < 0 || (x >= common.taskList.length + 1) || isNaN(x)) {
      console.log("\nindex not in array or you haven't entered a number\n");
    } else {
      console.log('removed task: "' + common.taskList.splice(x, 1).name + '"\n');
    }
  }
}
function editMode(x) {

  if (x <= common.getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    mode = "edit";
    console.log("\nedit mode\n");
    console.log("editing task: " +  common.getTasks().undoneTasks[x - 1].name + "\n");
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " +  common.getTasks().undoneTasks.length)
  }
}

function editTaskNode(index, x) {
  common.editTask(index,x);
  console.log("\ntask edited\n");
  mode="normal";
}
function doneNode(x) {
  if (x <= common.getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    const index = x-1;
    const message = "\ndid task: " + common.getTasks().undoneTasks[index].name
    common.done(index);
    console.log(message);
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " + common.getTasks().undoneTasks.length)
  }
}

function undoneNode(x) {
  if (x <= common.getTasks().doneTasks.length && x > 0 && (/\d+/.test(x))) {
    const index = x-1;
    const message = "\nundid task: " + common.getTasks().doneTasks[index].name
    console.log("index",index)
    common.undone(index);
    console.log(message);
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " + common.getTasks().doneTasks.length)
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
  if (common.taskList.length > 0) {
    var str = JSON.stringify(common.taskList);
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
    common.taskList = JSON.parse(data);
  });
}

function help() {
  console.log(
    '\nHere is a list of all possible commands: \n' +
    'hello - Simple Hello! \n' +
    'hello "yourname" - shows your name with the hello\n' +
    'quit - quits the application \nexit - exists the application  \n' +
    'add "task"- adds a task \n' +
    'list - lists common.taskList  \n' +
    'remove - removes the last task in the list \n' +
    'remove "index" - removes the task at that index \n' +
    'edit - enters edit mode\n' +
    'edit "index" - enters edit mode at that index\n' +
    'do "index" - changes a common.taskList status to done\n' +
    'undo "index" - changes a common.taskList status to undone\n' +
    'save - saves the common.taskList in a file\n');
}
let mode = "normal";
let currentEditedTaskNumber = 0


startApp("Chriss Haddad")