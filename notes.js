// add extended-commands #write and #notes (need better names.. don't want to use
// #note and #notes)
// by Eidolos

var notes = localStorage.getItem("notes");
if (notes == null) {
    notes = "";
    localStorage.setItem("notes", notes);
}

// Reset notes on new game.
onMatch(/^\w+ (?:\w+ )?(\w+), welcome to NetHack!  You are a (\w+) (\w+) (\w+)(?: (\w+))?\./, function() {
    notes = "";
    localStorage.setItem("notes", notes);
});

function noteOnce(note) {
    notes = localStorage.getItem("notes");
    // Check if the note already exists for this level
    if (notes.search(new RegExp(`T:\\d* ${stats.dlvl} ${note}`)) == -1)
        makeNote(note);
}

function makeNote(note) {
    // Just in case the user edited the file in the editor.
    notes = localStorage.getItem("notes");
    // Check if this exact note exists
    if (notes.search(new RegExp(`T:${stats.turncount} ${stats.dlvl} ${note}`)) != -1)
        return;

    // If there is not a newline add one
    if (notes.at(-1) != "\n")
        notes += "\n";

    notes += `T:${stats.turncount} ${stats.dlvl} ${note}\n`;
    localStorage.setItem("notes", notes);
}

extendedCommand("write", function(text) {
    if (text == "")
        printLine("Syntax: #write [note]", 0);
    makeNote(text);
    printLine("Noted!", 0);
});

// Define a ace editor embeded as base64
var editor = "PGh0bWwgbGFuZz1lbj48dGl0bGU+Tm90ZXM8L3RpdGxlPjxzdHlsZSBtZWRpYT1zY3JlZW4+I2VkaXRvcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtyaWdodDowO2JvdHRvbTowO2xlZnQ6MH08L3N0eWxlPjxkaXYgaWQ9ZWRpdG9yPjwvZGl2PjxzY3JpcHQgY2hhcnNldD11dGYtOCBzcmM9aHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9hY2UtYnVpbGRzQDEuNDMuNi9zcmMtbWluLW5vY29uZmxpY3QvYWNlLm1pbi5qcz48L3NjcmlwdD48c2NyaXB0Pm51bGw9PWxvY2FsU3RvcmFnZS5nZXRJdGVtKCJub3RlcyIpJiZsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgibm90ZXMiLCIiKTt2YXIgZWRpdG9yPWFjZS5lZGl0KCJlZGl0b3IiKTtlZGl0b3Iuc2V0VGhlbWUoImFjZS90aGVtZS9tb25va2FpIiksZWRpdG9yLnNlc3Npb24uc2V0TW9kZSgiYWNlL21vZGUvcGxhaW5fdGV4dCIpLGVkaXRvci5zZXRWYWx1ZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgibm90ZXMiKSksZWRpdG9yLmNsZWFyU2VsZWN0aW9uKCk7dmFyIGk9ZWRpdG9yLnNlc3Npb24uZ2V0TGVuZ3RoKCktMSxSYW5nZT1hY2UucmVxdWlyZSgiYWNlL3JhbmdlIikuUmFuZ2UsbGluZT1lZGl0b3Iuc2Vzc2lvbi5nZXRMaW5lKGkpLHJhbmdlPW5ldyBSYW5nZShpLGxpbmUubGVuZ3RoLGksbGluZS5sZW5ndGgpO2VkaXRvci5zZWxlY3Rpb24uc2V0U2VsZWN0aW9uUmFuZ2UocmFuZ2UsITEpLGVkaXRvci5mb2N1cygpLGVkaXRvci5zZXNzaW9uLm9uKCJjaGFuZ2UiLGZ1bmN0aW9uKGUpe2xvY2FsU3RvcmFnZS5zZXRJdGVtKCJub3RlcyIsZWRpdG9yLmdldFZhbHVlKCkpfSksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoImZvY3VzIixlPT57ZWRpdG9yLnNldFZhbHVlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCJub3RlcyIpKSxlZGl0b3IuY2xlYXJTZWxlY3Rpb24oKX0pOzwvc2NyaXB0Pg==";

extendedCommand("notes", function() {
    window.open(URL.createObjectURL(new Blob([atob(editor)], { type: "text/html" })), "_blank");
    printLine("", 0);
})

// set up some autonotes
// major events
onMatch(/^For what do you wish\?/, makeNote, "Got a wish!");
onMatchEx(/Welcome to experience level (\d+)\./, 0, function(match) {makeNote(`Hit experience level ${match[1]}.`)});
onMatch(/You receive a faint telepathic message from /, makeNote, "Quest!");
onMatch(/"So thou thought thou couldst kill me, fool\."/, makeNote, "Rodney encounter!");
onMatch(/Double Trouble\.\.\./, makeNote, "Double Trouble!");
onMatch(/A mysterious force momentarily surrounds you\.\.\./, makeNote, "Hit by the mysterious force.");
onMatch(/But now thou must face the final Test\.\.\./, makeNote, "Entered the Endgame.");

// altars
onMatchEx(/There is an altar to .*? \((\w+)\) here\./, 0, function(match) {noteOnce(`${match[1]} altar`)});
onMatchEx(/^.\s+.*?\((\w+) altar\)/, 0, function(match) {noteOnce(`${match[1]} altar`)});

// shops
onMatch(/You hear (?:the chime of a cash register\.|someone cursing shoplifters\.|Neiman and Marcus arguing!)/, noteOnce, "Level has some kind of shop");

var shoptypes = {
    "general store": "general",
    "used armor dealership": "armor",
    "second-hand bookstore": "scroll",
    "liquor emporium": "potion",
    "antique weapons outlet": "weapon",
    "delicatessen": "food",
    "jewelers": "ring",
    "quality apparel and accessories": "wand",
    "hardware store": "tool",
    "rare books": "spellbook",
    "lighting store": "lighting",
    "health food": "special food"
};

Object.keys(shoptypes).forEach(shoptype => {
    onMatchEx(new RegExp(`".+?, .+?!  Welcome(?: again)? to .*? (${shoptype})!"`), 0,  function(match) {noteOnce(`Level has a ${shoptypes[match[1]]} store`)});
});

// nonshop special rooms
onMatch(/You hear (?:the footsteps of a guard on patrol\.|Ebenezer Scrooge!|the quarterback calling the play\.|someone counting gold coins\.)/,
    noteOnce, "Level has a vault.");
onMatch(/You hear (?:a sound reminiscent of a seal barking\.|a sound reminiscent of an elephant stepping on a peanut\.|Doctor Doolittle!)/,
    noteOnce, "Level has a zoo.");
onMatch(/(?:You hear (?:the tones of courtly conversation\.|a sceptre pounded in judgment\.|Queen Beruthiel's cats!)|Someone shouts "Off with (?:his|her) head!")/,
    noteOnce, "Level has a throne room.");
onMatch(/You hear (?:someone praising .*?\.|someone beseeching .*?\.|an animal carcass being offered in sacrifice\.|a strident plea for donations\.)/,
    noteOnce, "Level has a temple with coaligned priest.");
onMatch(/You hear (?:a low buzzing\.|an angry drone\.|bees in your bonnet!|bees in your \(nonexistent\) bonnet!)/,
    noteOnce, "Level has a beehive.");
onMatch(/(?:You suddenly realize it is unnaturally quiet\.|The .*? on the back of your .*? stands up\.|The .*? on your .*? seems to stand up\.)/,
    noteOnce, "Level has a graveyard.");
onMatch(/You hear (?:blades being honed\.|loud snoring\.|dice being thrown\.|General MacArthur!)/,
    noteOnce, "Level has a barracks.");
onMatch(/You (?:hear mosquitoes!|smell marsh gas!|hear Donald Duck!)/,
    noteOnce, "Level has a swamp.");
onMatch(/You hear (?:a strange wind\.|convulsive ravings\.|snoring snakes\.|someone say "No more woodchucks!"|a loud ZOT!)/,
    noteOnce, "Level has Oracle.");

// dungeon features
onMatch(/You hear (?:a slow drip\.|a gurgling noise\.|dishes being washed!)/,
    noteOnce, "Level has a sink.");
onMatch(/You hear (?:water falling on coins\.|the splashing of a naiad\.|bubbling water\.|a soda fountain!)/, 
    noteOnce, "Level has a fountain.");