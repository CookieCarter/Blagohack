// Globals
var keymap = {};
var keyonce = {};
var extendedCommands = {};
var funcs = [];
var rows = [];
var isAnnotation = false;
var preface = "";
var waitFor = [null, null];

var username = localStorage.getItem("username");
if (username == null) {
    username = "";
    localStorage.setItem("username", username);
}

var password = localStorage.getItem("password");
if (password == null) {
    password = "";
    localStorage.setItem("password", password);
}


var colormap = {
    "nhblack"     : "\e[1;30m", // override to "\e[1;30m" if you want!
    "black"       : "\e[0;30m",
    "bblack"      : "\e[1;30m",
    "bold&black"  : "\e[1;30m",
    "black&bold"  : "\e[1;30m",
    "bblack"      : "\e[1;30m",
    "darkgray"    : "\e[1;30m",
    "darkgrey"    : "\e[1;30m",

    "red"         : "\e[0;31m",
    "bred"        : "\e[1;31m",
    "bold&red"    : "\e[1;31m",
    "red&bold"    : "\e[1;31m",
    "orange"      : "\e[1;31m",

    "green"       : "\e[0;32m",
    "bgreen"      : "\e[1;32m",
    "bold&green"  : "\e[1;32m",
    "green&bold"  : "\e[1;32m",

    "brown"       : "\e[0;33m",
    "bbrown"      : "\e[1;33m",
    "bold&brown"  : "\e[1;33m",
    "brown&bold"  : "\e[1;33m",
    "yellow"      : "\e[1;33m",
    "darkyellow"  : "\e[1;33m",

    "blue"        : "\e[0;34m",
    "bblue"       : "\e[1;34m",
    "bold&blue"   : "\e[1;34m",
    "blue&bold"   : "\e[1;34m",

    "purple"      : "\e[0;35m",
    "bpurple"     : "\e[1;35m",
    "bold&purple" : "\e[1;35m",
    "purple&bold" : "\e[1;35m",
    "magenta"     : "\e[0;35m",
    "bmagenta"    : "\e[1;35m",
    "bold&magenta": "\e[1;35m",
    "magenta&bold": "\e[1;35m",

    "cyan"        : "\e[0;36m",
    "bcyan"       : "\e[1;36m",
    "bold&cyan"   : "\e[1;36m",
    "cyan&bold"   : "\e[1;36m",

    "white"       : "\e[0;37m",
    "bwhite"      : "\e[1;37m",
    "gray"        : "\e[0;37m",
    "grey"        : "\e[0;37m",
    "bold&white"  : "\e[1;37m",
    "white&bold"  : "\e[1;37m",
};



// Helper Functions

function printf(msg) {
    term_.io.terminal_.interpret(msg);
}

// Adds a function to the call array
// Called every screen update
function add(func) {
    funcs.push(func);
}

function makeTab(match, replace) {
    onMatch(match, tab, replace);
}

// Prompt to type specific characters
function tab(replace) {
    annotate(`Tab: ${replace}`);
    keyonce["\t"] = replace;
}

// Stops the user from making any action until they press tab
function forceTab(message) {
    if (message == null)
        annotate(`\x1B[1;31mPress tab to continue!`);
    else
        annotate(`\x1B[1;31m${message} Press tab to continue!`);
    waitFor = ["\t", clearAnnotation];
}

function pressTab(match, message) {
    onMatch(match, forceTab, message);
}

function remap(key, result) {
    keymap[key] = result;
}

function unmap(key) {
    delete keymap[key];
}

// Adds a extended command
function extendedCommand(cmd, func) {
    extendedCommands[cmd] = func;
}

// Checks if an extended command was entered and executes
// it passes in the string following the command.
// checkExtended returns true if a command was found.
function checkExtended() {
    var cmd = rows[0].innerText.match(/^# (\w+) ?(.*)/);
    if (cmd == null)
        return false;
    if (typeof extendedCommands[cmd[1]] !== "undefined") {
        // Ensure that extended command box is gone before next command
        preface = "\x1B\x1B";

        extendedCommands[cmd[1]](cmd[2]);
        return true;
    }
    return false;
}

// Shows a menu of the given items and passes
// the index of the item chosen to the callback.
// NOTE: Only supports 61 items
function showMenu(items, callback) {
    // save cursor (7), goto alternate buffer ([?47l)
    printf("\x1B7\x1B[?47l\x1B[2J\x1B[0m\x1B[H");
    var char = "@";
    items.forEach(item => {
        char = String.fromCharCode(char.charCodeAt(0)+1);
        printf(`${char}: ${item}\x1B[K\r\n`);
    });
    printf("=> \x1B[K");
    waitFor = [new RegExp(`[A-${char}]`), function(s) {
        // Restore screen and cursor
        printf("\x1B[?47h\x1B8");
        callback(s.charCodeAt(0)-65);
    }];
}

// Prints text at a specific row
function printLine(text, row) {
    printf(`\x1B7\x1B[${row}H\x1B[0m${text}\x1B[0m\x1B[K\x1B8`)
}

// Prints text below top line
function annotate(annotation) {
    printf(`\x1B7\x1B[2H\x1B[1;30m${annotation}\x1B[0m\x1B[K\x1B8`);
    isAnnotation = true;
}

// Prints an annotation when a match is found
function makeAnnotation(match, annotation) {
    onMatch(match, annotate, annotation);
}

function clearAnnotation() {
    if (isAnnotation) {
        printf("\x1B7\x1B[2H\x1B[K\x1B8");
        isAnnotation = false;
    }
}

// Runs the given function everytime a match is found (on line 0)
function onMatch(match, func, ...args) {
    add(function() {
        if (match.test(rows[0].innerText))
            func(...args);
    });
}

// Same as onMatch but you may specify the line and it passes the match in as arg0
function onMatchEx(match, line, func, ...args) {
    add(function() {
        if (match.test(rows[line].innerText))
            func(rows[line].innerText.match(match), ...args);
    });
}


// Key and screen events

// Called when key is pressed
// Returns false if character is unhandled
function onKey(s) {
    // Don't allow any keypress to made until a key is pressed
    if (waitFor[0] != null) {
        if (s.match(waitFor[0]) != null) {
            if (waitFor[1] != null) {
                waitFor[1](s);
            }
            waitFor = [null, null];
        }
        return true;
    }

    if (preface != "") {
        term_.io.sendString(preface);
        preface = "";
    }

    // Check if there is a one time binding (which trumps normal bindings)
    if (typeof keyonce[s] !== "undefined") {
        if (typeof keyonce[s] === "function")
            keyonce[s]();
        if (typeof keyonce[s] === "string")
            term_.io.sendString(keyonce[s]);
        delete keyonce[s];
        return true;
    } else if (typeof keymap[s] !== "undefined") {
        if (typeof keymap[s] === "function")
            keymap[s]();
        if (typeof keymap[s] === "string")
            term_.io.sendString(keymap[s]);
        return true;
    }

    if (s == "\r") {
        if (checkExtended())
            return true;
    }

    return false;
}

// Called when screen is updated (normally)
function onScreen() {
    rows = term_.io.terminal_.document_.querySelectorAll("x-row");

    clearAnnotation();
    // Remove waitFor in case the screen was updated while one was active
    waitFor = [null, null];

    funcs.forEach(func => {func()});
}

// Called when the client connects to the server
function onConnect() {
    // Auto login
    if (username != "") {
        term_.io.sendString(`l${username}\n`);
        if (password != "")
            term_.io.sendString(`${password}\n`);
    }
}



// Hterm hooks

WSTTY.prototype.connect = function(addr) {
    this.statusMenu("Connecting...", true);
    this.ws = new WebSocket(addr +
                            "?c=" + this.io.columnCount +
                            "&l=" + this.io.rowCount);
    this.ws.binaryType = "arraybuffer";

    this.ws.onmessage = function(msg) {
        if (!msg || !msg.data)
            return;
        if (typeof msg.data === "string")
            return;
        this.io.writeUTF8(
            String.fromCharCode.apply(
                String, new Uint8Array(msg.data)));
    }.bind(this)
    this.ws.onerror = this.statusMenu.bind(this, "Connection error.", false);
    this.ws.onclose = this.statusMenu.bind(this, "Connection closed.", false);

    this.ws.addEventListener("open", (event) => {
        onVTKeystrokeOld = window.term_.io.onVTKeystroke;
        window.term_.io.onVTKeystroke = function(s) {
            if (!onKey(s))
                onVTKeystrokeOld(s);
        }

        window.term_.io.writeUTF8 = function (string) {
            if (this.terminal_.io != this)
                throw 'Attempt to print from inactive IO object.';
            
            this.terminal_.interpret(string);

            onScreen();
        }
        onConnect()
    });
};