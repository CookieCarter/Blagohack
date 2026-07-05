// adds a little menu for easy wishing
// it intentionally doesn't send the \n for you so you can check or back up
// by Eidolos

var wish_quantity = 2
var wish_enchantment = 3
var bfg = `blessed fixed greased`
var armor = `${bfg} +${wish_enchantment}`;

var wishes = [
    `${wish_quantity} blessed scrolls of charging`,
    `${wish_quantity} blessed scrolls of genocide`,
    `uncursed fixed greased magic marker`,

    `${armor} gray dragon scale mail`,
    `${armor} silver dragon scale mail`,
    `${armor} speed boots`,
    `${armor} jumping boots`,
    `${armor} helm of brilliance`,
    `${armor} helm of telepathy`,
    `${armor} helm of opposite alignment`,
    `${armor} gauntlets of power`,

    `${bfg} ring of conflict`,
    `${bfg} ring of levitation`,
    `${bfg} ring of teleport control`,

    `${armor} Grayswandir`,
    `${wish_quantity} cursed potions of gain level`,
    `${bfg} amulet of life saving`,
    `7 ${bfg} candles`,
    `${bfg} bag of holding`,
    `${bfg} tooled horn`,

    `${armor} Sceptre of Might`,
    `${bfg} Magic Mirror of Merlin`,
    `${bfg} Orb of Detection`,

    `${bfg} Eye of the Aethiopica`,
    `${bfg} Orb of Fate`,
    `${bfg} Platinum Yendorian Express Card`,
    
    `${bfg} Master Key of Thievery`,
    `${bfg} spellbook of identify`,
    `${bfg} spellbook of magic mapping`
];

// Can implement later
// var lawWishes = [
//     `${armor} Sceptre of Might`,
//     `${bfg} Magic Mirror of Merlin`,
//     `${bfg} Orb of Detection`
// ];

// var neuWishes = [
//     `${bfg} Eye of the Aethiopica`,
//     `${bfg} Orb of Fate`,
//     `${bfg} Platinum Yendorian Express Card`
// ];

// var chaWishes = [
//     `${bfg} Master Key of Thievery`,
//     `${bfg} spellbook of identify`,
//     `${bfg} spellbook of magic mapping`,
// ];

onMatch(/^For what do you wish\? +$/, showMenu, wishes, function(i) {
    term_.io.sendString(wishes[i]);
});