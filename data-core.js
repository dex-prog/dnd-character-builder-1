// Core 2014 5e rules data. Descriptions are short summaries, not book text.
window.DB = window.DB || {};
(function (DB) {
  DB.ABILS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  DB.ABIL_NAMES = { STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution', INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma' };

  DB.SKILLS = {
    'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 'Athletics': 'STR',
    'Deception': 'CHA', 'History': 'INT', 'Insight': 'WIS', 'Intimidation': 'CHA',
    'Investigation': 'INT', 'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS',
    'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 'Sleight of Hand': 'DEX',
    'Stealth': 'DEX', 'Survival': 'WIS'
  };
  // Homebrew skill used by the KibblesTasty Psion. Only shown when proficient.
  DB.EXTRA_SKILLS = { 'Psionics': 'INT' };
  DB.ALL_SKILLS = Object.keys(DB.SKILLS);

  DB.LANGUAGES = ['Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin', 'Halfling', 'Orc',
    'Abyssal', 'Celestial', 'Draconic', 'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'];

  DB.ARTISAN_TOOLS = ["Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools",
    "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools", "Jeweler's tools",
    "Leatherworker's tools", "Mason's tools", "Painter's supplies", "Potter's tools", "Smith's tools",
    "Tinker's tools", "Weaver's tools", "Woodcarver's tools"];
  DB.INSTRUMENTS = ['Bagpipes', 'Drum', 'Dulcimer', 'Flute', 'Lute', 'Lyre', 'Horn', 'Pan flute', 'Shawm', 'Viol'];
  DB.GAMING_SETS = ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'];
  DB.OTHER_TOOLS = ['Disguise kit', 'Forgery kit', 'Herbalism kit', "Navigator's tools", "Poisoner's kit",
    "Thieves' tools", 'Vehicles (land)', 'Vehicles (water)'];
  DB.ALL_TOOLS = [].concat(DB.ARTISAN_TOOLS, DB.INSTRUMENTS, DB.GAMING_SETS, DB.OTHER_TOOLS);

  DB.ALIGNMENTS = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral',
    'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil', 'Unaligned'];

  DB.POINT_BUY_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
  DB.STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

  // Spell slots by caster level (multiclass table). Index 0 = caster level 1.
  DB.FULL_SLOTS = [
    [2], [3], [4, 2], [4, 3], [4, 3, 2], [4, 3, 3], [4, 3, 3, 1], [4, 3, 3, 2], [4, 3, 3, 3, 1], [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1], [4, 3, 3, 3, 2, 1, 1, 1, 1], [4, 3, 3, 3, 3, 1, 1, 1, 1], [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1]
  ];
  // Warlock pact magic: [slots, slot level] by warlock level
  DB.PACT_SLOTS = [[1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5],
    [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [3, 5], [4, 5], [4, 5], [4, 5], [4, 5]];

  DB.SPELL_CLASS_CODES = { B: 'Bard', C: 'Cleric', D: 'Druid', P: 'Paladin', R: 'Ranger', S: 'Sorcerer', K: 'Warlock', W: 'Wizard', L: 'Spellblade' };
  DB.SCHOOLS = { Abj: 'Abjuration', Con: 'Conjuration', Div: 'Divination', Enc: 'Enchantment', Evo: 'Evocation', Ill: 'Illusion', Nec: 'Necromancy', Tra: 'Transmutation' };

  DB.DRAGON_TYPES = {
    Black: { dmg: 'acid', area: '5 by 30 ft line', save: 'DEX' },
    Blue: { dmg: 'lightning', area: '5 by 30 ft line', save: 'DEX' },
    Brass: { dmg: 'fire', area: '5 by 30 ft line', save: 'DEX' },
    Bronze: { dmg: 'lightning', area: '5 by 30 ft line', save: 'DEX' },
    Copper: { dmg: 'acid', area: '5 by 30 ft line', save: 'DEX' },
    Gold: { dmg: 'fire', area: '15 ft cone', save: 'DEX' },
    Green: { dmg: 'poison', area: '15 ft cone', save: 'CON' },
    Red: { dmg: 'fire', area: '15 ft cone', save: 'DEX' },
    Silver: { dmg: 'cold', area: '15 ft cone', save: 'CON' },
    White: { dmg: 'cold', area: '15 ft cone', save: 'CON' }
  };

  // ---------- Option lists used by class choices ----------
  // Each option: {id, name, text, fx?, req?}  req: {lvl: n (class level), pact: 'blade'} etc.
  DB.OPTS = {};
  DB.OPTS.fightingStyle = [
    { id: 'archery', name: 'Archery', text: '+2 to attack rolls with ranged weapons.' },
    { id: 'defense', name: 'Defense', text: '+1 AC while wearing armor.' },
    { id: 'dueling', name: 'Dueling', text: '+2 damage with a melee weapon held in one hand when you hold no other weapon.' },
    { id: 'gwf', name: 'Great Weapon Fighting', text: 'Reroll 1s and 2s on damage dice for two-handed/versatile melee weapons used two-handed.' },
    { id: 'protection', name: 'Protection', text: 'With a shield, use your reaction to give disadvantage to an attack against an adjacent ally.' },
    { id: 'twf', name: 'Two-Weapon Fighting', text: 'Add your ability modifier to the damage of your off-hand attack.' }
  ];
  DB.OPTS.fightingStylePaladin = DB.OPTS.fightingStyle.filter(function (o) { return ['defense', 'dueling', 'gwf', 'protection'].indexOf(o.id) >= 0; });
  DB.OPTS.fightingStyleRanger = DB.OPTS.fightingStyle.filter(function (o) { return ['archery', 'defense', 'dueling', 'twf'].indexOf(o.id) >= 0; });
  DB.OPTS.fightingStyleWarlord = DB.OPTS.fightingStyle.filter(function (o) { return ['defense', 'dueling', 'gwf', 'twf'].indexOf(o.id) >= 0; });

  DB.OPTS.metamagic = [
    { id: 'careful', name: 'Careful Spell', text: '1 SP: chosen creatures (up to CHA mod) auto-succeed on the spell\'s save.' },
    { id: 'distant', name: 'Distant Spell', text: '1 SP: double the range, or touch becomes 30 ft.' },
    { id: 'empowered', name: 'Empowered Spell', text: '1 SP: reroll up to CHA mod damage dice. Can combine with other metamagic.' },
    { id: 'extended', name: 'Extended Spell', text: '1 SP: double a duration of 1 minute or longer (max 24 h).' },
    { id: 'heightened', name: 'Heightened Spell', text: '3 SP: one target has disadvantage on its first save against the spell.' },
    { id: 'quickened', name: 'Quickened Spell', text: '2 SP: cast a 1-action spell as a bonus action.' },
    { id: 'subtle', name: 'Subtle Spell', text: '1 SP: cast without verbal or somatic components.' },
    { id: 'twinned', name: 'Twinned Spell', text: 'SP = spell level (1 for cantrips): target a second creature with a single-target spell.' }
  ];

  DB.OPTS.invocation = [
    { id: 'agonizing', name: 'Agonizing Blast', text: 'Add CHA mod to eldritch blast damage. Requires eldritch blast cantrip.' },
    { id: 'armorshadows', name: 'Armor of Shadows', text: 'Cast mage armor on yourself at will without a slot.', fx: { acFormula: { name: 'Mage Armor', base: 13, add: ['DEX'], shield: true } } },
    { id: 'ascendant', name: 'Ascendant Step (lvl 9)', text: 'Cast levitate on yourself at will.', req: { lvl: 9 } },
    { id: 'beastspeech', name: 'Beast Speech', text: 'Cast speak with animals at will.' },
    { id: 'beguiling', name: 'Beguiling Influence', text: 'Proficiency in Deception and Persuasion.', fx: { skills: ['Deception', 'Persuasion'] } },
    { id: 'bewitching', name: 'Bewitching Whispers (lvl 7)', text: 'Cast compulsion once per long rest with a pact slot.', req: { lvl: 7 } },
    { id: 'tome_secrets', name: 'Book of Ancient Secrets (Tome)', text: 'Inscribe rituals in your Book of Shadows; start with two 1st-level rituals.', req: { pact: 'tome' } },
    { id: 'carceri', name: 'Chains of Carceri (lvl 15, Chain)', text: 'Cast hold monster at will on celestials, fiends or elementals.', req: { lvl: 15, pact: 'chain' } },
    { id: 'devilsight', name: "Devil's Sight", text: 'See normally in darkness, magical or not, to 120 ft.' },
    { id: 'dreadword', name: 'Dreadful Word (lvl 7)', text: 'Cast confusion once per long rest with a pact slot.', req: { lvl: 7 } },
    { id: 'eldritchsight', name: 'Eldritch Sight', text: 'Cast detect magic at will.' },
    { id: 'eldritchspear', name: 'Eldritch Spear', text: 'Eldritch blast range becomes 300 ft.' },
    { id: 'runekeeper', name: 'Eyes of the Rune Keeper', text: 'Read all writing.' },
    { id: 'fiendishvigor', name: 'Fiendish Vigor', text: 'Cast false life on yourself at will as a 1st-level spell.' },
    { id: 'gazetwominds', name: 'Gaze of Two Minds', text: 'Touch a willing humanoid to perceive through its senses.' },
    { id: 'lifedrinker', name: 'Lifedrinker (lvl 12, Blade)', text: 'Pact weapon hits deal extra necrotic damage equal to CHA mod.', req: { lvl: 12, pact: 'blade' } },
    { id: 'maskfaces', name: 'Mask of Many Faces', text: 'Cast disguise self at will.' },
    { id: 'myriadforms', name: 'Master of Myriad Forms (lvl 15)', text: 'Cast alter self at will.', req: { lvl: 15 } },
    { id: 'minionschaos', name: 'Minions of Chaos (lvl 9)', text: 'Cast conjure elemental once per long rest with a pact slot.', req: { lvl: 9 } },
    { id: 'miremind', name: 'Mire the Mind (lvl 5)', text: 'Cast slow once per long rest with a pact slot.', req: { lvl: 5 } },
    { id: 'mistyvisions', name: 'Misty Visions', text: 'Cast silent image at will.' },
    { id: 'oneshadows', name: 'One with Shadows (lvl 5)', text: 'In dim light or darkness, action to become invisible until you move or act.', req: { lvl: 5 } },
    { id: 'otherleap', name: 'Otherworldly Leap (lvl 9)', text: 'Cast jump on yourself at will.', req: { lvl: 9 } },
    { id: 'repelling', name: 'Repelling Blast', text: 'Eldritch blast hits push the target up to 10 ft away.' },
    { id: 'sculptor', name: 'Sculptor of Flesh (lvl 7)', text: 'Cast polymorph once per long rest with a pact slot.', req: { lvl: 7 } },
    { id: 'illomen', name: 'Sign of Ill Omen (lvl 5)', text: 'Cast bestow curse once per long rest with a pact slot.', req: { lvl: 5 } },
    { id: 'thieffates', name: 'Thief of Five Fates', text: 'Cast bane once per long rest with a pact slot.' },
    { id: 'thirstingblade', name: 'Thirsting Blade (lvl 5, Blade)', text: 'Attack twice with your pact weapon when you take the Attack action.', req: { lvl: 5, pact: 'blade' } },
    { id: 'distantrealms', name: 'Visions of Distant Realms (lvl 15)', text: 'Cast arcane eye at will.', req: { lvl: 15 } },
    { id: 'chainmaster', name: 'Voice of the Chain Master (Chain)', text: 'Talk through and perceive through your familiar at any distance on the same plane.', req: { pact: 'chain' } },
    { id: 'whispersgrave', name: 'Whispers of the Grave (lvl 9)', text: 'Cast speak with dead at will.', req: { lvl: 9 } },
    { id: 'witchsight', name: 'Witch Sight (lvl 15)', text: 'See the true form of shapechangers and illusions within 30 ft.', req: { lvl: 15 } },
    // KibblesTasty Overseer invocations
    { id: 'kt_controlledchaos', name: 'Controlled Chaos (Overseer, KT)', text: 'Roll twice on Eye Ray Effects and choose; doubles let you pick any effect.', req: { sub: 'kt_overseer' } },
    { id: 'kt_overseersight', name: "Overseer's Sight (Overseer, KT)", text: 'Truesight 30 ft (60 ft while a Lingering Gaze eye is out).', req: { sub: 'kt_overseer' } }
  ];

  DB.OPTS.pactBoon = [
    { id: 'chain', name: 'Pact of the Chain', text: 'Learn find familiar; can choose imp, pseudodragon, quasit or sprite. Familiar can attack with its reaction when you forgo one attack.' },
    { id: 'blade', name: 'Pact of the Blade', text: 'Action: create a pact weapon in your hand (you are proficient). Can bind a magic weapon to it.' },
    { id: 'tome', name: 'Pact of the Tome', text: 'Book of Shadows with three cantrips from any class list (pick them in the Spells tab, they don\'t count toward cantrips known).' }
  ];

  DB.OPTS.maneuver = [
    { id: 'commanders', name: "Commander's Strike", text: 'Forgo an attack and use a bonus action so an ally can attack with its reaction, adding the die to damage.' },
    { id: 'disarming', name: 'Disarming Attack', text: 'Add die to damage; target makes STR save or drops an item.' },
    { id: 'distracting', name: 'Distracting Strike', text: 'Add die to damage; next ally attack on target has advantage.' },
    { id: 'evasive', name: 'Evasive Footwork', text: 'When moving, add the die to AC until you stop.' },
    { id: 'feinting', name: 'Feinting Attack', text: 'Bonus action: advantage on next attack vs adjacent creature, add die to damage.' },
    { id: 'goading', name: 'Goading Attack', text: 'Add die to damage; WIS save or target has disadvantage attacking others.' },
    { id: 'lunging', name: 'Lunging Attack', text: '+5 ft reach for one melee attack, add die to damage.' },
    { id: 'maneuvering', name: 'Maneuvering Attack', text: 'Add die to damage; an ally may move half speed without provoking from the target.' },
    { id: 'menacing', name: 'Menacing Attack', text: 'Add die to damage; WIS save or frightened until end of your next turn.' },
    { id: 'parry', name: 'Parry', text: 'Reaction when hit in melee: reduce damage by die + DEX mod.' },
    { id: 'precision', name: 'Precision Attack', text: 'Add die to an attack roll (before or after rolling).' },
    { id: 'pushing', name: 'Pushing Attack', text: 'Add die to damage; STR save or pushed up to 15 ft (Large or smaller).' },
    { id: 'rally', name: 'Rally', text: 'Bonus action: ally gains temp HP = die + CHA mod.' },
    { id: 'riposte', name: 'Riposte', text: 'Reaction when missed in melee: attack back, add die to damage.' },
    { id: 'sweeping', name: 'Sweeping Attack', text: 'On a hit, a second adjacent creature takes damage equal to the die.' },
    { id: 'trip', name: 'Trip Attack', text: 'Add die to damage; STR save or prone (Large or smaller).' }
  ];

  DB.OPTS.favoredEnemy = ['Aberrations', 'Beasts', 'Celestials', 'Constructs', 'Dragons', 'Elementals', 'Fey', 'Fiends', 'Giants',
    'Monstrosities', 'Oozes', 'Plants', 'Undead', 'Two humanoid races'].map(function (n) { return { id: n, name: n, text: 'Advantage on Survival to track and INT checks to recall info about them; learn one of their languages.' }; });
  DB.OPTS.terrain = ['Arctic', 'Coast', 'Desert', 'Forest', 'Grassland', 'Mountain', 'Swamp', 'Underdark'].map(function (n) { return { id: n, name: n, text: 'Doubled proficiency on INT/WIS checks about it; travel benefits.' }; });
  DB.OPTS.landTerrain = DB.OPTS.terrain.map(function (o) { return { id: o.id, name: o.name, text: 'Circle spells of the ' + o.name.toLowerCase() + '.' }; });

  DB.OPTS.huntersPrey = [
    { id: 'colossus', name: 'Colossus Slayer', text: '+1d8 once per turn vs a creature below its HP max.' },
    { id: 'giantkiller', name: 'Giant Killer', text: 'Reaction: attack a Large+ creature within 5 ft that attacks you.' },
    { id: 'hordebreaker', name: 'Horde Breaker', text: 'Once per turn, attack a second creature within 5 ft of the first.' }
  ];
  DB.OPTS.defensiveTactics = [
    { id: 'escapehorde', name: 'Escape the Horde', text: 'Opportunity attacks against you have disadvantage.' },
    { id: 'multiattackdef', name: 'Multiattack Defense', text: '+4 AC vs later attacks from a creature that hit you this turn.' },
    { id: 'steelwill', name: 'Steel Will', text: 'Advantage on saves against being frightened.' }
  ];
  DB.OPTS.multiattack = [
    { id: 'volley', name: 'Volley', text: 'Action: ranged attack against any number of creatures within 10 ft of a point.' },
    { id: 'whirlwind', name: 'Whirlwind Attack', text: 'Action: melee attack against any number of creatures within 5 ft.' }
  ];
  DB.OPTS.superiorDefense = [
    { id: 'evasion', name: 'Evasion', text: 'DEX saves for half: no damage on success, half on fail.' },
    { id: 'standtide', name: 'Stand Against the Tide', text: 'When a melee attack misses you, redirect it at another creature.' },
    { id: 'uncanny', name: 'Uncanny Dodge', text: 'Reaction: halve an attack\'s damage.' }
  ];
  DB.OPTS.totem3 = [
    { id: 'bear', name: 'Bear', text: 'While raging, resistance to all damage except psychic.' },
    { id: 'eagle', name: 'Eagle', text: 'While raging (no heavy armor), opportunity attacks against you have disadvantage and you can Dash as a bonus action.' },
    { id: 'wolf', name: 'Wolf', text: 'While raging, friends have advantage on melee attacks against hostiles within 5 ft of you.' }
  ];
  DB.OPTS.totem6 = [
    { id: 'bear', name: 'Bear', text: 'Double carrying capacity; advantage on STR checks to push, pull, lift or break.' },
    { id: 'eagle', name: 'Eagle', text: 'See up to 1 mile clearly; dim light doesn\'t hurt Perception.' },
    { id: 'wolf', name: 'Wolf', text: 'Track at a fast pace; move stealthily at a normal pace.' }
  ];
  DB.OPTS.totem14 = [
    { id: 'bear', name: 'Bear', text: 'While raging, hostiles within 5 ft have disadvantage attacking anyone but you.' },
    { id: 'eagle', name: 'Eagle', text: 'While raging, fly speed equal to walking speed (you fall if in the air at the end of your turn).' },
    { id: 'wolf', name: 'Wolf', text: 'While raging, bonus action to knock a Large or smaller creature prone after a melee hit.' }
  ];
  DB.OPTS.dragonColor = Object.keys(DB.DRAGON_TYPES).map(function (k) { var d = DB.DRAGON_TYPES[k]; return { id: k, name: k + ' (' + d.dmg + ')', text: d.dmg + ' damage', fx: {} }; });
  DB.OPTS.chromaticColor = ['Black', 'Blue', 'Green', 'Red', 'White'].map(function (k) { var d = DB.DRAGON_TYPES[k]; return { id: k, name: k + ' (' + d.dmg + ')', text: 'Element: ' + d.dmg }; });

  DB.OPTS.elementalDiscipline = [
    { id: 'breathwinter', name: 'Breath of Winter (lvl 17)', text: '6 ki: cast cone of cold.', req: { lvl: 17 } },
    { id: 'clench', name: 'Clench of the North Wind (lvl 6)', text: '3 ki: cast hold person.', req: { lvl: 6 } },
    { id: 'eternalmountain', name: 'Eternal Mountain Defense (lvl 17)', text: '5 ki: cast stoneskin on yourself.', req: { lvl: 17 } },
    { id: 'fangsfire', name: 'Fangs of the Fire Snake', text: '1 ki: unarmed reach +10 ft, deal fire; +1 ki for +1d10 fire.' },
    { id: 'fourthunders', name: 'Fist of Four Thunders', text: '2 ki: cast thunderwave.' },
    { id: 'unbrokenair', name: 'Fist of Unbroken Air', text: '2 ki: STR save, 3d10 bludgeoning (+1d10/extra ki), push 20 ft, prone.' },
    { id: 'phoenix', name: 'Flames of the Phoenix (lvl 11)', text: '4 ki: cast fireball.', req: { lvl: 11 } },
    { id: 'gong', name: 'Gong of the Summit (lvl 6)', text: '3 ki: cast shatter.', req: { lvl: 6 } },
    { id: 'miststance', name: 'Mist Stance (lvl 11)', text: '4 ki: cast gaseous form on yourself.', req: { lvl: 11 } },
    { id: 'ridewind', name: 'Ride the Wind (lvl 11)', text: '4 ki: cast fly on yourself.', req: { lvl: 11 } },
    { id: 'riverflame', name: 'River of Hungry Flame (lvl 17)', text: '5 ki: cast wall of fire.', req: { lvl: 17 } },
    { id: 'galespirits', name: 'Rush of the Gale Spirits', text: '2 ki: cast gust of wind.' },
    { id: 'flowingriver', name: 'Shape the Flowing River', text: '1 ki: reshape ice and water in a 30 ft cube within 120 ft.' },
    { id: 'cinder', name: 'Sweeping Cinder Strike', text: '2 ki: cast burning hands.' },
    { id: 'waterwhip', name: 'Water Whip', text: '2 ki: DEX save, 3d10 bludgeoning (+1d10/extra ki), pull or knock prone.' },
    { id: 'rollingearth', name: 'Wave of Rolling Earth (lvl 17)', text: '6 ki: cast wall of stone.', req: { lvl: 17 } }
  ];

  // Multiclass prerequisites and proficiencies gained (PHB p.163). Homebrew entries marked assumed.
  DB.MULTICLASS = {
    barbarian: { req: [{ STR: 13 }], armor: ['Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
    bard: { req: [{ CHA: 13 }], armor: ['Light armor'], skills: 1, tools: 1, toolFrom: 'INSTRUMENTS' },
    cleric: { req: [{ WIS: 13 }], armor: ['Light armor', 'Medium armor', 'Shields'] },
    druid: { req: [{ WIS: 13 }], armor: ['Light armor', 'Medium armor', 'Shields'] },
    fighter: { req: [{ STR: 13 }, { DEX: 13 }], anyOf: true, armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
    monk: { req: [{ DEX: 13, WIS: 13 }], weapons: ['Simple weapons', 'Shortswords'] },
    paladin: { req: [{ STR: 13, CHA: 13 }], armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
    ranger: { req: [{ DEX: 13, WIS: 13 }], armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'], skills: 1 },
    rogue: { req: [{ DEX: 13 }], armor: ['Light armor'], tools: ["Thieves' tools"], skills: 1 },
    sorcerer: { req: [{ CHA: 13 }] },
    warlock: { req: [{ CHA: 13 }], armor: ['Light armor'], weapons: ['Simple weapons'] },
    wizard: { req: [{ INT: 13 }] },
    // KibblesTasty classes: their PDFs don't list multiclass rules; these are reasonable assumptions.
    spellblade: { req: [{ INT: 13 }], armor: ['Light armor'], weapons: ['Simple weapons', 'Martial weapons'], assumed: true },
    psion: { req: [{ INT: 13 }], assumed: true },
    warlord: { req: [{ WIS: 13 }, { CHA: 13 }], anyOf: true, armor: ['Light armor'], weapons: ['Simple weapons'], assumed: true }
  };
})(window.DB);
