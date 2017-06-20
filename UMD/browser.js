
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
