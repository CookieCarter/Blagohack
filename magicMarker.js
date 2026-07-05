// this plugin lets you quickly write the kind of scroll/spellbook you want to
// write with a magic marker
// by Eidolos

var spellbooks = [
    "force bolt",
    "drain life",
    "magic missile",
    "cone of cold",
    "fireball",
    "finger of death",
    "healing",
    "cure blindness",
    "cure sickness",
    "extra healing",
    "stone to flesh",
    "restore ability",
    "detect monsters",
    "light",
    "detect food",
    "clairvoyance",
    "detect unseen",
    "identify",
    "detect treasure",
    "magic mapping",
    "sleep",
    "confuse monster",
    "slow monster",
    "cause fear",
    "charm monster",
    "protection",
    "create monster",
    "remove curse",
    "create familiar",
    "turn undead",
    "jumping",
    "haste self",
    "invisibility",
    "levitation",
    "teleport away",
    "knock",
    "wizard lock",
    "dig",
    "polymorph",
    "cancellation",
];

var scrolls = [
    "charging",
    "enchant armor",
    "enchant weapon",
    "genocide",
    "identify",
    "remove curse",
    "magic mapping",
    "gold detection",
    "taming",
    "scare monster",
    "teleportation",
    "earth",
    "create monster",
    "light",
    "confuse monster",
    "destroy armor",
    "fire",
    "food detection",
    "amnesia",
    "punishment",
    "stinking cloud",
];

// Implement
var inkCost = {
    "mail": "1",
    "amnesia": "4-7",
    "earth": "4-7",
    "fire": "4-7",
    "gold detection": "4-7",
    "food detection": "4-7",
    "light": "4-7",
    "magic mapping": "4-7",
    "create monster": "5-9",
    "destroy armor": "5-9",
    "punishment": "5-9",
    "confuse monster": "6-11",
    "identify": "7-13",
    "charging": "8-15",
    "enchant armor": "8-15",
    "enchant weapon": "8-15",
    "remove curse": "8-15",
    "scare monster": "10-19",
    "stinking cloud": "10-19",
    "taming": "10-19",
    "teleportation": "10-19",
    "genocide": "15-29",
};

// find longest scroll name...
// var longest = 0;
// while (my ($slot, $scroll) = each(%scrolls)) {
//     $longest = length($scroll) if length($scroll) > $longest;
// }

// so we can use it to have a nice table for ink costs
// for my $scroll (values %scrolls)
// {
//     next unless exists $ink_cost{$scroll};
//     $scroll = sprintf "%-${longest}s # %s", $scroll, $ink_cost{$scroll};
// }

onMatch(/^What type of scroll do you want to write\? +$/, showMenu, scrolls, function(i) {
    term_.io.sendString(scrolls[i]);
});

onMatch(/^What type of spellbook do you want to write\? +$/, showMenu, spellbooks, function(i) {
    term_.io.sendString(spellbooks[i]);
});
