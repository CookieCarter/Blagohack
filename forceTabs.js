// this sets up some "press tab to continue" prompts for important messages,
// like "You are slowing down."
// by Eidolos and toft (idea by doy)

pressTab(/\bYou are slowing down\./, "Lizard, !acid, STF, pray? 2 turns to live.");
pressTab(/\bYou don't feel very well\./, 'Fire, Cure Sickness, Aesc, "unchang, poly, pray? Around 10 turns to live.');
pressTab(/\bYou faint from lack of food\./);
pressTab(/\bYou feel deathly sick\./, "You have about 20 turns to live.");
pressTab(/\bYou feel (?:much|even) worse\./, "Your turns to live have just been cut to about a third.");
pressTab(/\bStop eating\?/);
pressTab(/\bThe [^.!\e]*? swings itself around you!/, 'Kill, tele, poly, "MB, freeze, delev? 1 turn to live.');
pressTab(/^Really quit without saving\? \[yn\] \(n\) +$/);

pressTab(/"So thou thought thou couldst kill me, fool\."/);
pressTab(/\bDouble Trouble\.\.\./);

pressTab(/\bNothing happens\./);
pressTab(/\bYou don't have enough energy to cast that spell\./);

pressTab(/You hear the howling of the CwnAnnwn\.\.\./, "You have less than 1/10 of your maximum hit points left.");
pressTab(/You hear the wailing of the Banshee\.\.\./, "You have 1 hit point left.");