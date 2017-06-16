'use strict';
var fs = require('fs');
/**
 * startApp - Starts the applucation
 *
 * @param  {string} name the name of the app
 * @returns {void}
 */
function startApp(name) {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onDataReceived);
  console.log("Welcome to " + name + "'s application!");
  console.log("--------------------");
}


/**
 * onDataReceived - Decides what to do depending on the data that was received
 *
 * @param  {string} text data typed by the user
 * @returns {void}
 */

var commands = {
  exit: quit,
  quit: quit,
  help: help,
  list: list,
  save: save,
  load: load,
  hello: hello,
  add: add,
  remove: remove,
  editMode: editMode,
  edit: edit,
  done: done,
  undone: undone
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


/**
 * unknownCommand - Runs when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */
function unknownCommand(c) {
  console.log('\nunknown command: "' + c.trim() + '"\n')
}


/**
 * hello - Says hello
 *
 * @returns {void}
 */

function hello(x) {
  if (x == null) {
    console.log('\nhello!\n')
  } else {
    console.log('\nhello ' + x + "!\n");
  }
}


/**
 * add - adds a task and stores it in an array
 *
 * @returns {void}
 */
function add(x) {
  var task = {
    name: x,
    status: "undone"
  };
  taskList.push(task);
  console.log('\nadded task: "' + x + '"\n');
}
/**
 * list - lists taskList
 *
 * @returns {void}
 */
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
/**
 * quit - exits the application
 *
 * @returns {void}
 */
function quit() {

  console.log('\nQuitting now, goodbye!')
  process.exit();

}
/**
 * remove - removes last taks from list
 *
 */
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


/**
 * edit - editing taskList values
 *
 */
function editMode(x) {

  if (x <= getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    mode = "edit";
    console.log("\nedit mode\n");
    console.log("editing task: " +  getTasks().undoneTasks[x - 1].name + "\n");
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " +  getTasks().undoneTasks.length)
  }
}

function edit(index, x) {
  getTasks().undoneTasks[index-1].name = x;
  console.log("\ntask edited\n");
  mode="normal";
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

function done(x) {
  if (x <= getTasks().undoneTasks.length && x > 0 && (/\d+/.test(x))) {
    getTasks().undoneTasks[x - 1].status = "done";
    console.log("\ndid task: " + getTasks().undoneTasks[x - 1].name);
  } else {
    console.log("\ninvalid input please enter a number withing the lists' length: " + getTasks().undoneTasks.length)
  }
}

function undone(x) {
  if (x <= getTasks().doneTasks.length && x > 0 && (/\d+/.test(x))) {
    getTasks().doneTasks[x - 1].status = "undone";
    console.log("\nundid task: " + getTasks().doneTasks[x - 1].name);
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
/**
 * help - lists all possible inputs
 *
 */
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

// STARTING THE APPLICATION HERE!

const state = {
  mode: 'normal',
  currentTask: 0
}

let mode = "normal";
let currentEditedTaskNumber = 0
let taskList = new Array();



startApp("Chriss Haddad")