var intrinsics = JSON.parse(localStorage.getItem("intrinsics"));
if (intrinsics == null) {
    intrinsics = [];
    localStorage.setItem("intrinsics", JSON.stringify(intrinsics));
}

// Reset intrinsics on new game
onMatch(/^\w+ (?:\w+ )?(\w+), welcome to NetHack!  You are a (\w+) (\w+) (\w+)(?: (\w+))?\./, function() {
    intrinsics = [];
    roleIntrinsics[stats.role].forEach(intr => {
        intrinsics.push(intr);
    });
    raceIntrinsics[stats.race].forEach(intr => {
        intrinsics.push(intr);
    });
    localStorage.setItem("intrinsics", JSON.stringify(intrinsics));
});

// Implement
var roleIntrinsics = {
    "Arc": ["stealth", "fast"],
    "Bar": ["poison"],
    "Cav": [],
    "Hea": ["poison"],
    "Kni": [],
    "Mon": ["fast", "sleep", "see invisible"],
    "Pri": [],
    "Rog": ["stealth"],
    "Ran": ["searching"],
    "Sam": ["fast"],
    "Tou": [],
    "Val": ["cold"],
    "Wiz": [],
};

// Implement
var raceIntrinsics = {
    "Dwa": [],
    "Elf": [],
    "Hum": [],
    "Orc": ["poison"],
    "Gno": [],
};

// Implement
var intrinsicsColors = {
    "fast"           : "\x1B[1;35m",
    "poison"         : "\x1B[0;32m",
    "sleep"          : "\x1B[1;31m",
    "fire"           : "\x1B[1;33m",
    "cold"           : "\x1B[1;36m",
    "shock"          : "\x1B[1;34m",
};

// Implement
var shortenIntrinsic = {
    "disintegration": "disint",
    "sleep": "slp",
    "shock": "shk",
    "poison": "pois",
    "see invisible": "SI",
    "invisibility": "invis",
    "teleport control": "TC",
    "teleportitis": "tpitis",
    "searching": "srch",
    "stealth": "stlth",
    "warning": "warn",
    "telepathy": "ESP",
};

function showIntrinsics() {
    printf("\x1B7\x1B[H\x1B[0m")
    if (intrinsics.length == 0) {
        printf("No Intrinsics");
    } else {
        printf("Intrinsics: ");
        printf(intrinsics[0]);
        for (var i = 1; i < intrinsics.length; i++) {
            printf(`, ${intrinsics[i]}`);
        }
    }
    printf("\x1B[0m\x1B[K\x1B8");
}

extendedCommand("intrinsics", showIntrinsics);
extendedCommand("int", showIntrinsics);

function addIntr(intr) {
    if (intrinsics.indexOf(intr) == -1) {
        intrinsics.push(intr);
        localStorage.setItem("intrinsics", JSON.stringify(intrinsics));
        annotate(`Gained ${intr}.`);
    }
}

function delIntr(intr) {
    if (intrinsics.indexOf(intr) != -1) {
        intrinsics.splice(intrinsics.indexOf(intr), 1);
        localStorage.setItem("intrinsics", JSON.stringify(intrinsics));
        annotate(`Lost ${intr}.`);
    }
}

onMatch(/You feel (?:(?:especially )?healthy|hardy)\./, addIntr, "poison");
onMatch(/You feel (?:full of hot air|warm)\./, addIntr, "cold");
onMatch(/You (?:feel a momentary chill|feel cool(?!er)|be chillin")\./, addIntr, "fire");
onMatch(/You feel (?:wide )?awake./, addIntr, "sleep");
onMatch(/You feel (?:very firm|totally together, man)\./, addIntr, "disintegration");
onMatch(/Your health currently feels amplified!/, addIntr, "shock");
onMatch(/You feel (?:insulated|grounded in reality)/, addIntr, "shock");

// other intrinsics
onMatch(/You feel (?:very jumpy|diffuse)\./, addIntr, "teleportitis");
onMatch(/You feel (?:in control of yourself|centered in your personal space)\./, addIntr, "teleport control");
onMatch(/You feel controlled\./, addIntr, "teleport control");
onMatch(/You feel (?:a strange mental acuity|in touch with the cosmos)\./, addIntr, "telepathy");
onMatch(/You feel hidden\./, addIntr, "invisibility");
onMatch(/You feel perceptive\./, addIntr, "searching");
onMatch(/You feel stealthy\./, addIntr, "stealth");
onMatch(/You feel sensitive\./, addIntr, "warning");
onMatch(/You feel (?:very self-conscious|transparent)\./, addIntr, "see invisible");
onMatch(/You see an image of someone stalking you\./, addIntr, "see invisible");
onMatch(/Your vision becomes clear\./, addIntr, "see invisible");
onMatch(/You (?:seem faster|feel quick|speed up)./, addIntr, "fast");
onMatch(/"and thus I grant thee the gift of Speed!"/, addIntr, "fast");

// notices that we still have a resistance
onMatch(/You seem unaffected by the poison/, addIntr, "poison");
onMatch(/The poison doesn't seem to affect you/, addIntr, "poison");
onMatch(/The fire doesn't feel hot!/, addIntr, "fire");
onMatch(/The feel mildly hot\./, addIntr, "fire");
onMatch(/You don't feel cold\./, addIntr, "cold");
onMatch(/You feel mildly chilly\./, addIntr, "cold");
onMatch(/You feel a mild tingle\./, addIntr, "shock");
onMatch(/You seem unhurt\./, addIntr, "shock");
onMatch(/You are not disintegrated\./, addIntr, "disintegration");

// dangerous messages
// losing resists
onMatch(/You feel warmer\./, delIntr, "fire");
onMatch(/You feel cooler\./, delIntr, "cold");
onMatch(/You feel a little sick\./, delIntr, "poison");
onMatch(/You feel tired\./, delIntr, "sleep");
onMatch(/You feel conductive\./, delIntr, "shock");

// losing intrinsics
onMatch(/You feel unaware\./, delIntr, "warning");
onMatch(/You slow down\./, delIntr, "fast");
onMatch(/You seem slower\./, delIntr, "fast");
onMatch(/You feel (?:slow|slower)\./, delIntr, "fast");
onMatch(/You feel paranoid\./, delIntr, "invisibility");
onMatch(/You feel clumsy\./, delIntr, "stealth");
onMatch(/You feel less jumpy\./, delIntr, "teleportitis");
onMatch(/You feel uncontrolled\./, delIntr, "teleport control");
onMatch(/You (?:thought you saw something|tawt you taw a puttie tat)\./, delIntr, "see invisible");
onMatch(/Your senses fail\./, delIntr, "telepathy");