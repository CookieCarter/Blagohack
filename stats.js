// parse all kinds of info about your character (score, stats, align, etc) so
// that other modules have access to this information
// by Eidolos and doy

var stats = JSON.parse(localStorage.getItem("stats"));
if (stats == null) {
    stats = {
        st: 0,
        dx: 0,
        co: 0,
        in: 0,
        wi: 0,
        ch: 0,
        name: "",
        align: "",
        sex: "",
        race: "",
        role: "",
        dlvl: "",
        au: 0,
        curhp: 0,
        maxhp: 0,
        curpw: 0,
        maxpw: 0,
        ac: 0,
        xlvl: 0,
        xp: 0,
        turncount: 0,
        status: ""
    };
    localStorage.setItem("intrinsics", JSON.stringify(intrinsics));
}

var aligns = {
    "lawful" : "Law",
    "neutral": "Neu",
    "chaotic": "Cha",
};

var sexes = {
    "male"  : "Mal",
    "female": "Fem",
};

var races = {
    "dwarven": "Dwa",
    "elven"  : "Elf",
    "human"  : "Hum",
    "orcish" : "Orc",
    "gnomish": "Gno",
};

var roles = {
    "Archeologist": "Arc",
    "Barbarian"   : "Bar",
    "Caveman"     : "Cav",
    "Cavewoman"   : "Cav",
    "Healer"      : "Hea",
    "Knight"      : "Kni",
    "Monk"        : "Mon",
    "Priest"      : "Pri",
    "Priestess"   : "Pri",
    "Rogue"       : "Rog",
    "Ranger"      : "Ran",
    "Samurai"     : "Sam",
    "Tourist"     : "Tou",
    "Valkyrie"    : "Val",
    "Wizard"      : "Wiz",
};

// figure out role, race, gender, align
onMatchEx(/^\w+ (?:\w+ )?(\w+), welcome to NetHack!  You are a (\w+) (\w+) (\w+)(?: (\w+))?\./, 0, function(match) {
    stats = {
        st: 0,
        dx: 0,
        co: 0,
        in: 0,
        wi: 0,
        ch: 0,
        name: "",
        align: "",
        sex: "",
        race: "",
        role: "",
        dlvl: "",
        au: 0,
        curhp: 0,
        maxhp: 0,
        curpw: 0,
        maxpw: 0,
        ac: 0,
        xlvl: 0,
        xp: 0,
        turncount: 0,
        status: ""
    };

    if (typeof match[5] === "undefined") {
        stats.name = match[1];
        stats.align = aligns[match[2]];
        stats.race = races[match[3]];
        stats.role = roles[match[4]];
        if (/(?:woman|ess)$/.test(match[4])) stats.sex = "Fem"
        else sex = "Mal"
    } else {
        stats.sex = sexes[match[3]];
        stats.name = match[1];
        stats.align = aligns[match[2]];
        stats.race = races[match[4]];
        stats.role = roles[match[5]];
    }
    localStorage.setItem("stats", JSON.stringify(stats));
});

onMatchEx(/^\w+ (?:\w+ )?(\w+), the (\w+) (\w+), welcome back to NetHack!/, 0, function(match) {
    stats.name = match[1];
    stats.race = races[match[2]];
    stats.role = roles[match[3]];
    if (match[3] == "Cavewoman" || match[3] == "Priestess")
        stats.sex = "Fem";
    if (match[3] == "Caveman" || match[3] == "Priest")
        stats.sex = "Mal";
    localStorage.setItem("stats", JSON.stringify(stats));
});



// figure out stats (strength, score, etc)
onMatchEx(/^\[(\w+)?.*?St:(\d+(?:\/(?:\*\*|\d+))?) Dx:(\d+) Co:(\d+) In:(\d+) Wi:(\d+) Ch:(\d+)\s*(\w+)(?:\s*S:(\d+))?/, 22, function(match) {
    stats.name = match[1];
    stats.st = match[2];
    stats.dx = match[3];
    stats.co = match[4];
    stats.in = match[5];
    stats.wi = match[6];
    stats.ch = match[7];
    stats.align = match[8];
    localStorage.setItem("stats", JSON.stringify(stats));
});

// parse botl
onMatchEx(/^(Dlvl:\d+|Home \d+|Fort Ludios|End Game|Astral Plane)\s+(?:\$|\*):(\d+)\s+HP:(\d+)\((\d+)\)\s+Pw:(\d+)\((\d+)\)\s+AC:([0-9-]+)\s+(?:Exp|Xp|HD):(\d+)(?:\/(\d+))?(?:\s+T:(\d+))?\s?(.*?)\s*$/, 23, function(match) {
    stats.dlvl = match[1];
    stats.au = match[2];
    stats.curhp = match[3];
    stats.maxhp = match[4];
    stats.curpw = match[5];
    stats.maxpw = match[6];
    stats.ac = match[7];
    stats.xlvl = match[8];
    stats.xp = match[9]; // Should fix
    stats.turncount = match[10];
    stats.status = match[11];
    localStorage.setItem("stats", JSON.stringify(stats));
});