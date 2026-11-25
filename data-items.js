// Feats, backgrounds and equipment (PHB 2014). Text is summarized.
(function (DB) {
  // ---------------- FEATS ----------------
  DB.FEATS = [
    { id: 'alert', name: 'Alert', text: '+5 initiative; can\'t be surprised while conscious; hidden attackers don\'t get advantage on you.', fx: { init: 5 } },
    { id: 'athlete', name: 'Athlete', asiChoice: ['STR', 'DEX'], text: '+1 STR or DEX. Stand from prone with 5 ft; climbing costs no extra movement; running jumps after 5 ft.' },
    { id: 'actor', name: 'Actor', asi: { CHA: 1 }, text: '+1 CHA. Advantage on Deception/Performance to pass as someone else; mimic voices.' },
    { id: 'charger', name: 'Charger', text: 'After Dashing, bonus action melee attack (+5 damage) or shove 10 ft.' },
    { id: 'crossbowexpert', name: 'Crossbow Expert', text: 'Ignore loading; no disadvantage on ranged attacks within 5 ft; bonus action hand crossbow attack after attacking with a one-handed weapon.' },
    { id: 'defensiveduelist', name: 'Defensive Duelist', prereq: { abil: { DEX: 13 } }, text: 'Reaction: add proficiency to AC against one melee attack while wielding a finesse weapon you are proficient with.' },
    { id: 'dualwielder', name: 'Dual Wielder', text: '+1 AC while wielding a melee weapon in each hand; two-weapon fighting with non-light weapons; draw/stow two weapons at once.' },
    { id: 'dungeondelver', name: 'Dungeon Delver', text: 'Advantage to detect secret doors and on saves vs traps; resistance to trap damage; search for traps at normal pace.' },
    { id: 'durable', name: 'Durable', asi: { CON: 1 }, text: '+1 CON. Minimum HP regained per Hit Die = 2 × CON mod.' },
    { id: 'elementaladept', name: 'Elemental Adept', prereq: { caster: true }, choices: [{ id: 'type', label: 'Damage type', type: 'list', n: 1, opts: [{ id: 'acid', name: 'Acid' }, { id: 'cold', name: 'Cold' }, { id: 'fire', name: 'Fire' }, { id: 'lightning', name: 'Lightning' }, { id: 'thunder', name: 'Thunder' }] }], text: 'Your spells ignore resistance to the chosen type; treat 1s on its damage dice as 2s. Can be taken more than once.' },
    { id: 'grappler', name: 'Grappler', prereq: { abil: { STR: 13 } }, text: 'Advantage on attacks vs creatures you grapple; can try to pin them (both restrained).' },
    { id: 'gwm', name: 'Great Weapon Master', text: 'Bonus action attack after a melee crit or kill; take -5 to hit for +10 damage with heavy weapons.' },
    { id: 'healer', name: 'Healer', text: 'Stabilizing with a healer\'s kit leaves 1 HP; action to heal 1d6 + 4 + HD with a kit (once per creature per rest).' },
    { id: 'heavilyarmored', name: 'Heavily Armored', prereq: { armor: 'Medium armor' }, asi: { STR: 1 }, fx: { armor: ['Heavy armor'] }, text: '+1 STR. Proficiency with heavy armor.' },
    { id: 'heavyarmormaster', name: 'Heavy Armor Master', prereq: { armor: 'Heavy armor' }, asi: { STR: 1 }, text: '+1 STR. In heavy armor, reduce nonmagical bludgeoning/piercing/slashing damage by 3.' },
    { id: 'inspiringleader', name: 'Inspiring Leader', prereq: { abil: { CHA: 13 } }, text: '10 minute speech: up to six creatures gain temp HP = your level + CHA mod.' },
    { id: 'keenmind', name: 'Keen Mind', asi: { INT: 1 }, text: '+1 INT. Always know north and hours to sunrise/sunset; recall anything from the past month.' },
    { id: 'lightlyarmored', name: 'Lightly Armored', asiChoice: ['STR', 'DEX'], fx: { armor: ['Light armor'] }, text: '+1 STR or DEX. Proficiency with light armor.' },
    { id: 'linguist', name: 'Linguist', asi: { INT: 1 }, choices: [{ id: 'langs', label: 'Three languages', type: 'language', n: 3 }], text: '+1 INT. Learn three languages; create ciphers.' },
    { id: 'lucky', name: 'Lucky', text: '3 luck points per long rest: roll an extra d20 for an attack, check or save (or an attack against you) and choose.' },
    { id: 'mageslayer', name: 'Mage Slayer', text: 'Reaction attack vs adjacent casters; they have disadvantage on concentration saves from your damage; advantage on saves vs adjacent casters\' spells.' },
    { id: 'magicinitiate', name: 'Magic Initiate', choices: [
      { id: 'cls', label: 'Spell list', type: 'list', n: 1, opts: [{ id: 'B', name: 'Bard' }, { id: 'C', name: 'Cleric' }, { id: 'D', name: 'Druid' }, { id: 'S', name: 'Sorcerer' }, { id: 'K', name: 'Warlock' }, { id: 'W', name: 'Wizard' }] },
      { id: 'cantrips', label: 'Two cantrips', type: 'spell', n: 2, spellLvl: 0, listFrom: 'cls' },
      { id: 'spell1', label: 'One 1st-level spell (1/long rest)', type: 'spell', n: 1, spellLvl: 1, listFrom: 'cls' }
    ], text: 'Learn two cantrips and one 1st-level spell from one class list; cast the spell once per long rest.' },
    { id: 'martialadept', name: 'Martial Adept', choices: [{ id: 'man', label: 'Two maneuvers', type: 'list', n: 2, opts: 'maneuver' }], text: 'Learn two Battle Master maneuvers and gain one d6 superiority die (short rest).' },
    { id: 'mediumarmormaster', name: 'Medium Armor Master', prereq: { armor: 'Medium armor' }, fx: { mediumDexCap: 3 }, text: 'Medium armor doesn\'t hurt Stealth; DEX bonus to AC in medium armor up to +3.' },
    { id: 'mobile', name: 'Mobile', fx: { speed: 10 }, text: '+10 ft speed; Dash ignores difficult terrain; no opportunity attacks from creatures you attack in melee.' },
    { id: 'moderatelyarmored', name: 'Moderately Armored', prereq: { armor: 'Light armor' }, asiChoice: ['STR', 'DEX'], fx: { armor: ['Medium armor', 'Shields'] }, text: '+1 STR or DEX. Proficiency with medium armor and shields.' },
    { id: 'mountedcombatant', name: 'Mounted Combatant', text: 'While mounted: advantage on melee vs smaller unmounted creatures; redirect attacks to you; mount gets evasion.' },
    { id: 'observant', name: 'Observant', asiChoice: ['INT', 'WIS'], fx: { passiveBonus: 5 }, text: '+1 INT or WIS. Read lips; +5 passive Perception and Investigation.' },
    { id: 'polearmmaster', name: 'Polearm Master', text: 'Bonus action butt-end attack (1d4) with glaive, halberd or quarterstaff; opportunity attacks when creatures enter your reach.' },
    { id: 'resilient', name: 'Resilient', asiChoice: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'], saveFromAsi: true, text: '+1 to one ability and proficiency in saves of that ability.' },
    { id: 'ritualcaster', name: 'Ritual Caster', prereq: { abilAny: { INT: 13, WIS: 13 } }, text: 'Ritual book with two 1st-level rituals from a chosen class; add more you find.' },
    { id: 'savageattacker', name: 'Savage Attacker', text: 'Once per turn, reroll melee weapon damage dice and use either total.' },
    { id: 'sentinel', name: 'Sentinel', text: 'Opportunity attack hits stop movement; Disengage doesn\'t prevent them; reaction attack when an adjacent enemy attacks someone else.' },
    { id: 'sharpshooter', name: 'Sharpshooter', text: 'No disadvantage at long range; ignore half/three-quarters cover; -5 to hit for +10 damage with ranged weapons.' },
    { id: 'shieldmaster', name: 'Shield Master', text: 'Bonus action shove after attacking; add shield AC to DEX saves vs single-target effects; evasion-like reaction.' },
    { id: 'skilled', name: 'Skilled', choices: [{ id: 'skills', label: 'Three skills', type: 'skill', n: 3, from: 'any' }], text: 'Proficiency in any combination of three skills or tools (this builder picks skills; note tools in Notes).' },
    { id: 'skulker', name: 'Skulker', prereq: { abil: { DEX: 13 } }, text: 'Hide when lightly obscured; missing a ranged attack doesn\'t reveal you; dim light doesn\'t hurt Perception.' },
    { id: 'spellsniper', name: 'Spell Sniper', prereq: { caster: true }, choices: [{ id: 'cantrip', label: 'Attack-roll cantrip (any class)', type: 'spell', n: 1, spellLvl: 0, list: 'any' }], text: 'Double range of attack-roll spells; ignore half/three-quarters cover; learn one attack-roll cantrip.' },
    { id: 'tavernbrawler', name: 'Tavern Brawler', asiChoice: ['STR', 'CON'], text: '+1 STR or CON. Proficient with improvised weapons; unarmed strike 1d4; bonus action grapple after a hit.' },
    { id: 'tough', name: 'Tough', fx: { hpPerLevel: 2 }, text: 'HP max increases by 2 per level.' },
    { id: 'warcaster', name: 'War Caster', prereq: { caster: true }, text: 'Advantage on concentration saves; somatic components with full hands; cast a spell as an opportunity attack.' },
    { id: 'weaponmaster', name: 'Weapon Master', asiChoice: ['STR', 'DEX'], choices: [{ id: 'weapons', label: 'Four weapons', type: 'weapon', n: 4 }], text: '+1 STR or DEX. Proficiency with four weapons.' },
    // KibblesTasty (Warlord PDF)
    { id: 'kt_tactical', name: 'Tactical Combatant (KT)', src: 'HB', asiChoice: ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'], text: '+1 to one ability. Once per turn, replace an attack with Help; Help works at 10 ft and can aid an extra creature.' },
    { id: 'kt_synchronized', name: 'Synchronized Combatant (KT)', src: 'HB', prereq: { cls: { warlord: 4 } }, asiChoice: ['DEX', 'WIS', 'CHA'], text: '+1 DEX, WIS or CHA. Allies can move through and attack from your space (not end there); it isn\'t difficult terrain for them.' }
  ];

  // ---------------- BACKGROUNDS ----------------
  DB.BACKGROUNDS = [
    { id: 'acolyte', name: 'Acolyte', skills: ['Insight', 'Religion'], langs: 2, feature: ['Shelter of the Faithful', 'You and companions get free healing and care at temples of your faith; you have ties to a temple.'], equip: ['Holy symbol', 'Prayer book', 'Incense (5 sticks)', 'Vestments', 'Common clothes'], gp: 15 },
    { id: 'charlatan', name: 'Charlatan', skills: ['Deception', 'Sleight of Hand'], tools: ['Disguise kit', 'Forgery kit'], feature: ['False Identity', 'A second identity with documents and contacts; you can forge documents you have seen.'], equip: ['Fine clothes', 'Disguise kit', 'Con tools'], gp: 15 },
    { id: 'criminal', name: 'Criminal / Spy', skills: ['Deception', 'Stealth'], tools: ["Thieves' tools"], toolChoice: { n: 1, from: 'GAMING_SETS' }, feature: ['Criminal Contact', 'A reliable contact who passes messages through a criminal network.'], equip: ['Crowbar', 'Dark common clothes with hood'], gp: 15 },
    { id: 'entertainer', name: 'Entertainer / Gladiator', skills: ['Acrobatics', 'Performance'], tools: ['Disguise kit'], toolChoice: { n: 1, from: 'INSTRUMENTS' }, feature: ['By Popular Demand', 'You can always find a place to perform and get free modest lodging and food.'], equip: ['Musical instrument', "Admirer's favor", 'Costume'], gp: 15 },
    { id: 'folkhero', name: 'Folk Hero', skills: ['Animal Handling', 'Survival'], tools: ['Vehicles (land)'], toolChoice: { n: 1, from: 'ARTISAN_TOOLS' }, feature: ['Rustic Hospitality', 'Common folk will shelter and hide you if it doesn\'t endanger them.'], equip: ["Artisan's tools", 'Shovel', 'Iron pot', 'Common clothes'], gp: 10 },
    { id: 'guildartisan', name: 'Guild Artisan / Merchant', skills: ['Insight', 'Persuasion'], toolChoice: { n: 1, from: 'ARTISAN_TOOLS' }, langs: 1, feature: ['Guild Membership', 'Guild support: lodging, legal help and access to powerful contacts, for dues.'], equip: ["Artisan's tools", 'Letter of introduction', "Traveler's clothes"], gp: 15 },
    { id: 'hermit', name: 'Hermit', skills: ['Medicine', 'Religion'], tools: ['Herbalism kit'], langs: 1, feature: ['Discovery', 'Your seclusion revealed a unique and powerful discovery (work it out with your DM).'], equip: ['Scroll case of notes', 'Winter blanket', 'Common clothes', 'Herbalism kit'], gp: 5 },
    { id: 'noble', name: 'Noble / Knight', skills: ['History', 'Persuasion'], toolChoice: { n: 1, from: 'GAMING_SETS' }, langs: 1, feature: ['Position of Privilege', 'Welcome in high society; commoners accommodate you. (Knight variant: Retainers.)'], equip: ['Fine clothes', 'Signet ring', 'Scroll of pedigree'], gp: 25 },
    { id: 'outlander', name: 'Outlander', skills: ['Athletics', 'Survival'], toolChoice: { n: 1, from: 'INSTRUMENTS' }, langs: 1, feature: ['Wanderer', 'Excellent memory for geography; can forage food and water for up to six people.'], equip: ['Staff', 'Hunting trap', 'Animal trophy', "Traveler's clothes"], gp: 10 },
    { id: 'sage', name: 'Sage', skills: ['Arcana', 'History'], langs: 2, feature: ['Researcher', 'You know where and from whom to obtain information you don\'t know.'], equip: ['Bottle of ink', 'Quill', 'Small knife', 'Letter from a colleague', 'Common clothes'], gp: 10 },
    { id: 'sailor', name: 'Sailor / Pirate', skills: ['Athletics', 'Perception'], tools: ["Navigator's tools", 'Vehicles (water)'], feature: ["Ship's Passage", 'Free passage on a sailing ship for you and companions. (Pirate variant: Bad Reputation.)'], equip: ['Belaying pin (club)', 'Silk rope (50 ft)', 'Lucky charm', 'Common clothes'], gp: 10 },
    { id: 'soldier', name: 'Soldier', skills: ['Athletics', 'Intimidation'], tools: ['Vehicles (land)'], toolChoice: { n: 1, from: 'GAMING_SETS' }, feature: ['Military Rank', 'Soldiers loyal to your former organization recognize your authority.'], equip: ['Insignia of rank', 'Trophy from a fallen enemy', 'Gaming set', 'Common clothes'], gp: 10 },
    { id: 'urchin', name: 'Urchin', skills: ['Sleight of Hand', 'Stealth'], tools: ['Disguise kit', "Thieves' tools"], feature: ['City Secrets', 'Travel through a city twice as fast by secret paths.'], equip: ['Small knife', 'Map of your home city', 'Pet mouse', 'Token from your parents', 'Common clothes'], gp: 10 },
    { id: 'custom', name: 'Custom Background', custom: true, skillChoice: 2, langs: 0, feature: ['Custom Feature', 'Agree a feature with your DM (write it in Notes).'], equip: [], gp: 10,
      choices: [{ id: 'tl', label: 'Two tools or languages: pick tools here (any)', type: 'tool', n: 2, from: 'ALL_TOOLS' }] }
  ];

  // ---------------- WEAPONS ----------------
  // [name, category, cost, damage, type, weight, properties]
  var W = [
    ['Club', 'simple-melee', '1 sp', '1d4', 'bludgeoning', 2, 'light'],
    ['Dagger', 'simple-melee', '2 gp', '1d4', 'piercing', 1, 'finesse, light, thrown (20/60)'],
    ['Greatclub', 'simple-melee', '2 sp', '1d8', 'bludgeoning', 10, 'two-handed'],
    ['Handaxe', 'simple-melee', '5 gp', '1d6', 'slashing', 2, 'light, thrown (20/60)'],
    ['Javelin', 'simple-melee', '5 sp', '1d6', 'piercing', 2, 'thrown (30/120)'],
    ['Light hammer', 'simple-melee', '2 gp', '1d4', 'bludgeoning', 2, 'light, thrown (20/60)'],
    ['Mace', 'simple-melee', '5 gp', '1d6', 'bludgeoning', 4, ''],
    ['Quarterstaff', 'simple-melee', '2 sp', '1d6', 'bludgeoning', 4, 'versatile (1d8)'],
    ['Sickle', 'simple-melee', '1 gp', '1d4', 'slashing', 2, 'light'],
    ['Spear', 'simple-melee', '1 gp', '1d6', 'piercing', 3, 'thrown (20/60), versatile (1d8)'],
    ['Light crossbow', 'simple-ranged', '25 gp', '1d8', 'piercing', 5, 'ammunition (80/320), loading, two-handed'],
    ['Dart', 'simple-ranged', '5 cp', '1d4', 'piercing', 0.25, 'finesse, thrown (20/60)'],
    ['Shortbow', 'simple-ranged', '25 gp', '1d6', 'piercing', 2, 'ammunition (80/320), two-handed'],
    ['Sling', 'simple-ranged', '1 sp', '1d4', 'bludgeoning', 0, 'ammunition (30/120)'],
    ['Battleaxe', 'martial-melee', '10 gp', '1d8', 'slashing', 4, 'versatile (1d10)'],
    ['Flail', 'martial-melee', '10 gp', '1d8', 'bludgeoning', 2, ''],
    ['Glaive', 'martial-melee', '20 gp', '1d10', 'slashing', 6, 'heavy, reach, two-handed'],
    ['Greataxe', 'martial-melee', '30 gp', '1d12', 'slashing', 7, 'heavy, two-handed'],
    ['Greatsword', 'martial-melee', '50 gp', '2d6', 'slashing', 6, 'heavy, two-handed'],
    ['Halberd', 'martial-melee', '20 gp', '1d10', 'slashing', 6, 'heavy, reach, two-handed'],
    ['Lance', 'martial-melee', '10 gp', '1d12', 'piercing', 6, 'reach, special'],
    ['Longsword', 'martial-melee', '15 gp', '1d8', 'slashing', 3, 'versatile (1d10)'],
    ['Maul', 'martial-melee', '10 gp', '2d6', 'bludgeoning', 10, 'heavy, two-handed'],
    ['Morningstar', 'martial-melee', '15 gp', '1d8', 'piercing', 4, ''],
    ['Pike', 'martial-melee', '5 gp', '1d10', 'piercing', 18, 'heavy, reach, two-handed'],
    ['Rapier', 'martial-melee', '25 gp', '1d8', 'piercing', 2, 'finesse'],
    ['Scimitar', 'martial-melee', '25 gp', '1d6', 'slashing', 3, 'finesse, light'],
    ['Shortsword', 'martial-melee', '10 gp', '1d6', 'piercing', 2, 'finesse, light'],
    ['Trident', 'martial-melee', '5 gp', '1d6', 'piercing', 4, 'thrown (20/60), versatile (1d8)'],
    ['War pick', 'martial-melee', '5 gp', '1d8', 'piercing', 2, ''],
    ['Warhammer', 'martial-melee', '15 gp', '1d8', 'bludgeoning', 2, 'versatile (1d10)'],
    ['Whip', 'martial-melee', '2 gp', '1d4', 'slashing', 3, 'finesse, reach'],
    ['Blowgun', 'martial-ranged', '10 gp', '1', 'piercing', 1, 'ammunition (25/100), loading'],
    ['Hand crossbow', 'martial-ranged', '75 gp', '1d6', 'piercing', 3, 'ammunition (30/120), light, loading'],
    ['Heavy crossbow', 'martial-ranged', '50 gp', '1d10', 'piercing', 18, 'ammunition (100/400), heavy, loading, two-handed'],
    ['Longbow', 'martial-ranged', '50 gp', '1d8', 'piercing', 2, 'ammunition (150/600), heavy, two-handed'],
    ['Net', 'martial-ranged', '1 gp', '—', '', 3, 'special, thrown (5/15)'],
    // Shinobi (KibblesTasty) optional weapons
    ['Kunai (KT)', 'simple-melee', '2 gp', '1d4', 'piercing', 0.5, 'finesse, light, thrown (20/60)'],
    ['Shuriken (KT)', 'simple-ranged', '1 sp', '1d4', 'slashing', 0.25, 'finesse, thrown (20/60)']
  ];
  DB.WEAPONS = W.map(function (w) { return { name: w[0], cat: w[1], cost: w[2], dmg: w[3], type: w[4], weight: w[5], props: w[6], kind: 'weapon' }; });

  // ---------------- ARMOR ----------------
  // [name, type, cost, baseAC, dexCap (null = no cap, 0 = no DEX), strReq, stealthDis, weight]
  var A = [
    ['Padded armor', 'light', '5 gp', 11, null, 0, true, 8],
    ['Leather armor', 'light', '10 gp', 11, null, 0, false, 10],
    ['Studded leather armor', 'light', '45 gp', 12, null, 0, false, 13],
    ['Hide armor', 'medium', '10 gp', 12, 2, 0, false, 12],
    ['Chain shirt', 'medium', '50 gp', 13, 2, 0, false, 20],
    ['Scale mail', 'medium', '50 gp', 14, 2, 0, true, 45],
    ['Breastplate', 'medium', '400 gp', 14, 2, 0, false, 20],
    ['Half plate', 'medium', '750 gp', 15, 2, 0, true, 40],
    ['Ring mail', 'heavy', '30 gp', 14, 0, 0, true, 40],
    ['Chain mail', 'heavy', '75 gp', 16, 0, 13, true, 55],
    ['Splint armor', 'heavy', '200 gp', 17, 0, 15, true, 60],
    ['Plate armor', 'heavy', '1,500 gp', 18, 0, 15, true, 65],
    ['Shield', 'shield', '10 gp', 2, 0, 0, false, 6]
  ];
  DB.ARMOR = A.map(function (a) { return { name: a[0], type: a[1], cost: a[2], ac: a[3], dexCap: a[4], str: a[5], stealthDis: a[6], weight: a[7], kind: 'armor' }; });

  // ---------------- GEAR ----------------
  DB.PACKS = {
    "Burglar's pack": 'Backpack, 1,000 ball bearings, 10 ft string, bell, 5 candles, crowbar, hammer, 10 pitons, hooded lantern, 2 flasks of oil, 5 days rations, tinderbox, waterskin, 50 ft hempen rope',
    "Diplomat's pack": 'Chest, 2 map/scroll cases, fine clothes, bottle of ink, ink pen, lamp, 2 flasks of oil, 5 sheets of paper, vial of perfume, sealing wax, soap',
    "Dungeoneer's pack": 'Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days rations, waterskin, 50 ft hempen rope',
    "Entertainer's pack": 'Backpack, bedroll, 2 costumes, 5 candles, 5 days rations, waterskin, disguise kit',
    "Explorer's pack": 'Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days rations, waterskin, 50 ft hempen rope',
    "Priest's pack": 'Backpack, blanket, 10 candles, tinderbox, alms box, 2 blocks of incense, censer, vestments, 2 days rations, waterskin',
    "Scholar's pack": 'Backpack, book of lore, bottle of ink, ink pen, 10 sheets of parchment, little bag of sand, small knife'
  };
  DB.GEAR = [
    ['Arrows (20)', '1 gp'], ['Crossbow bolts (20)', '1 gp'], ['Sling bullets (20)', '4 cp'], ['Blowgun needles (50)', '1 gp'], ['Quiver', '1 gp'],
    ['Arcane focus', '10 gp'], ['Component pouch', '25 gp'], ['Druidic focus', '1 gp'], ['Holy symbol', '5 gp'], ['Spellbook', '50 gp'],
    ['Backpack', '2 gp'], ['Bedroll', '1 gp'], ['Blanket', '5 sp'], ['Rope, hempen (50 ft)', '1 gp'], ['Rope, silk (50 ft)', '10 gp'],
    ['Torch', '1 cp'], ['Rations (1 day)', '5 sp'], ['Waterskin', '2 sp'], ['Tinderbox', '5 sp'], ['Mess kit', '2 sp'],
    ["Healer's kit", '5 gp'], ['Potion of healing', '50 gp'], ['Crowbar', '2 gp'], ['Hammer', '1 gp'], ['Piton', '5 cp'],
    ['Lantern, hooded', '5 gp'], ['Oil (flask)', '1 sp'], ['Grappling hook', '2 gp'], ['Caltrops (bag of 20)', '1 gp'], ['Ball bearings (bag of 1,000)', '1 gp'],
    ['Chain (10 ft)', '5 gp'], ['Manacles', '2 gp'], ['Mirror, steel', '5 gp'], ["Climber's kit", '25 gp'], ['Shovel', '2 gp'],
    ['Common clothes', '5 sp'], ['Fine clothes', '15 gp'], ["Traveler's clothes", '2 gp'], ['Costume', '5 gp'], ['Ink (1 ounce bottle)', '10 gp'],
    ['Ink pen', '2 cp'], ['Paper (one sheet)', '2 sp'], ['Parchment (one sheet)', '1 sp'], ['Candle', '1 cp'], ['Pouch', '5 sp'],
    ['Sack', '1 cp'], ['Chest', '5 gp'], ['Hunting trap', '5 gp'], ['Lock', '10 gp'], ['Spyglass', '1,000 gp']
  ].map(function (g) { return { name: g[0], cost: g[1], kind: 'gear' }; });
  Object.keys(DB.PACKS).forEach(function (p) { DB.GEAR.push({ name: p, cost: '', kind: 'gear', contents: DB.PACKS[p] }); });
  DB.ALL_TOOLS.forEach(function (t) { DB.GEAR.push({ name: t, cost: '', kind: 'gear' }); });

  DB.findItem = function (name) {
    var n = name.toLowerCase();
    var lists = [DB.WEAPONS, DB.ARMOR, DB.GEAR];
    for (var i = 0; i < lists.length; i++) for (var j = 0; j < lists[i].length; j++) if (lists[i][j].name.toLowerCase() === n) return lists[i][j];
    return null;
  };
})(window.DB);
