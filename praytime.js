// Adds an extended command to show the time since the last prayer and a rough
// estimate of prayer safety.
// The plugin notes crowning, but also provides an extended command to toggle
// crowning manually.
// This only really works when InterHack has seen your last prayer
//
// joc

var praytime = 0;
var crowned = false;
var demigod = false;

var lawCrown = "I crown thee...  The Hand of Elbereth!";
var neuCrown = "Thou shalt be my Envoy of Balance!";
var chaCrown = "Thou art chosen to (?:take lives)|(?:steal souls) for My Glory!";


onMatch(/You begin praying to/, function() {
    praytime = stats.turncount;
});

onMatch(new RegExp(`${lawCrown}|${neuCrown}|${chaCrown}`), function() {
    crowned = true;
});

extendedCommand("crown", function() {
    printLine(`Crowned now ${crowned = !crowned}`, 0);
});

extendedCommand("demigod", function() {
    printLine(`Demigod now ${demigod = !demigod}`, 0);
});

extendedCommand("praytime", function() {
    var timeout = stats.turncount - praytime;
    var confidenceThreshold = (crowned || demigod) ? (crowned && demigod) ? 7479 : 3980 : 1229;
    var safeMsg = `${colormap.green} 95% safe assuming normal timeout\x1B[0m`;
    var unsafeMsg = `${colormap.brown} confidence < 95%\x1B[0m`;

    var response = `The last prayer was ${timeout} turns ago.`;
    if (timeout >= confidenceThreshold) response += safeMsg;
    else response += unsafeMsg;

    printLine(response, 0);
});