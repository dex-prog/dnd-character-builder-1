// PHB 2014 classes and subclasses. Feature text is summarized in our own words.
// feature: [classLevel, name, text, fx?]
// choice: {lvl, id, label, type, n, opts|from}
(function (DB) {
  function rep(arr) { return arr; }
  var ASI = [4, 8, 12, 16, 19];
  function fill(pairs) { // pairs: [[fromLevel, value], ...] -> 20 values
    var out = [], v = '-';
    for (var l = 1; l <= 20; l++) { for (var i = 0; i < pairs.length; i++) if (pairs[i][0] === l) v = pairs[i][1]; out.push(v); }
    return out;
  }
  DB.fill = fill;
  var CANT_2_3_4 = fill([[1, 2], [4, 3], [10, 4]]);
  var CANT_3_4_5 = fill([[1, 3], [4, 4], [10, 5]]);
  var CANT_4_5_6 = fill([[1, 4], [4, 5], [10, 6]]);
  var THIRD_CANT = fill([[1, 0], [3, 2], [10, 3]]);
  var THIRD_KNOWN = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];
  DB.THIRD_CANT = THIRD_CANT; DB.THIRD_KNOWN = THIRD_KNOWN;

  DB.CLASSES = [];

  // ======================= BARBARIAN =======================
  DB.CLASSES.push({
    id: 'barbarian', name: 'Barbarian', src: 'PHB', hd: 12, saves: ['STR', 'CON'],
    armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'],
    skills: { n: 2, from: ['Animal Handling', 'Athletics', 'Intimidation', 'Nature', 'Perception', 'Survival'] },
    subLevel: 3, subName: 'Primal Path', asi: ASI,
    cols: { 'Rages': fill([[1, 2], [3, 3], [6, 4], [12, 5], [17, 6], [20, 'Unlimited']]), 'Rage Damage': fill([[1, '+2'], [9, '+3'], [16, '+4']]) },
    features: [
      [1, 'Rage', 'Bonus action, lasts 1 minute (ends early if you neither attack nor take damage in a turn). Advantage on STR checks/saves, bonus damage on STR melee weapon attacks (Rage Damage), resistance to bludgeoning, piercing and slashing. No spellcasting or concentration; not in heavy armor. Uses per long rest = Rages.'],
      [1, 'Unarmored Defense', 'Without armor, AC = 10 + DEX + CON (shield allowed).', { acFormula: { name: 'Unarmored Defense (Barbarian)', base: 10, add: ['DEX', 'CON'], shield: true } }],
      [2, 'Reckless Attack', 'On your first attack of the turn, gain advantage on STR melee attacks this turn; attacks against you have advantage until your next turn.'],
      [2, 'Danger Sense', 'Advantage on DEX saves against effects you can see (not blinded, deafened or incapacitated).'],
      [3, 'Primal Path', 'Choose your path.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [5, 'Fast Movement', '+10 ft speed while not wearing heavy armor.', { speed: 10 }],
      [7, 'Feral Instinct', 'Advantage on initiative. If surprised, you can act normally on your first turn if you rage first.'],
      [9, 'Brutal Critical', 'Roll one extra weapon damage die on a melee crit (2 dice at 13th, 3 at 17th).'],
      [11, 'Relentless Rage', 'While raging, dropping to 0 HP: DC 10 CON save to drop to 1 HP instead. DC +5 each use, resets on a rest.'],
      [15, 'Persistent Rage', 'Rage only ends early if you fall unconscious or choose to end it.'],
      [18, 'Indomitable Might', 'If a STR check total is less than your STR score, use the score instead.'],
      [20, 'Primal Champion', 'STR and CON increase by 4 (max 24).', { primalChampion: true }]
    ],
    start: [['Greataxe', '{martial-melee}'], ['Handaxe x2', '{simple}'], ["Explorer's pack + Javelin x4"]],
    subclasses: [
      {
        id: 'berserker', name: 'Path of the Berserker', src: 'PHB', features: [
          [3, 'Frenzy', 'When you rage you can frenzy: one melee weapon attack as a bonus action each turn. When the rage ends, gain one level of exhaustion.'],
          [6, 'Mindless Rage', 'Can\'t be charmed or frightened while raging; such effects are suspended.'],
          [10, 'Intimidating Presence', 'Action: frighten one creature within 30 ft (WIS save DC 8 + prof + CHA). Extend each turn with your action.'],
          [14, 'Retaliation', 'When a creature within 5 ft damages you, use your reaction to make a melee weapon attack against it.']
        ]
      },
      {
        id: 'totem', name: 'Path of the Totem Warrior', src: 'PHB',
        choices: [
          { lvl: 3, id: 'totem3', label: 'Totem Spirit', type: 'list', n: 1, opts: 'totem3' },
          { lvl: 6, id: 'totem6', label: 'Aspect of the Beast', type: 'list', n: 1, opts: 'totem6' },
          { lvl: 14, id: 'totem14', label: 'Totemic Attunement', type: 'list', n: 1, opts: 'totem14' }
        ],
        features: [
          [3, 'Spirit Seeker', 'Cast beast sense and speak with animals as rituals.'],
          [3, 'Totem Spirit', 'Choose bear, eagle or wolf (benefit while raging).'],
          [6, 'Aspect of the Beast', 'Choose bear, eagle or wolf (always-on benefit).'],
          [10, 'Spirit Walker', 'Cast commune with nature as a ritual.'],
          [14, 'Totemic Attunement', 'Choose bear, eagle or wolf (benefit while raging).']
        ]
      }
    ]
  });

  // ======================= BARD =======================
  DB.CLASSES.push({
    id: 'bard', name: 'Bard', src: 'PHB', hd: 8, saves: ['DEX', 'CHA'],
    armor: ['Light armor'], weapons: ['Simple weapons', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    toolChoice: { n: 3, from: 'INSTRUMENTS', label: 'Three musical instruments' },
    skills: { n: 3, from: 'any' }, subLevel: 3, subName: 'Bard College', asi: ASI,
    caster: { type: 'full', abil: 'CHA', list: 'B', mode: 'known', cantrips: CANT_2_3_4, known: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22] },
    cols: { 'Bardic Inspiration': fill([[1, 'd6'], [5, 'd8'], [10, 'd10'], [15, 'd12']]), 'Song of Rest': fill([[2, 'd6'], [9, 'd8'], [13, 'd10'], [17, 'd12']]) },
    choices: [
      { lvl: 3, id: 'expertise3', label: 'Expertise (2 skills)', type: 'expertise', n: 2 },
      { lvl: 10, id: 'expertise10', label: 'Expertise (2 more skills)', type: 'expertise', n: 2 }
    ],
    features: [
      [1, 'Spellcasting', 'Bard spells use CHA. You know a set number of spells; you can swap one when you level up. Musical instrument as focus.'],
      [1, 'Bardic Inspiration', 'Bonus action: give a creature within 60 ft an inspiration die to add to one attack, check or save within 10 minutes. Uses = CHA mod (min 1) per long rest.'],
      [2, 'Jack of All Trades', 'Add half proficiency (rounded down) to ability checks that don\'t already include proficiency.', { jackOfAllTrades: true }],
      [2, 'Song of Rest', 'Allies who spend Hit Dice during your short rest regain extra HP (Song of Rest die).'],
      [3, 'Bard College', 'Choose your college.'],
      [3, 'Expertise', 'Double proficiency for two skills (two more at 10th).'],
      [5, 'Font of Inspiration', 'Regain Bardic Inspiration on a short or long rest.'],
      [6, 'Countercharm', 'Action: you and friends within 30 ft get advantage vs frightened/charmed while you perform.'],
      [10, 'Magical Secrets', 'Learn two spells from any class list (they count as bard spells). Again at 14th and 18th. Use the "any class" filter in Spells.'],
      [14, 'Magical Secrets (14th)', 'Two more spells from any class.'],
      [18, 'Magical Secrets (18th)', 'Two more spells from any class.'],
      [20, 'Superior Inspiration', 'Regain one Bardic Inspiration use if you have none when rolling initiative.']
    ],
    start: [['Rapier', 'Longsword', '{simple}'], ["Diplomat's pack", "Entertainer's pack"], ['Lute', '{instrument}'], ['Leather armor + Dagger']],
    subclasses: [
      {
        id: 'lore', name: 'College of Lore', src: 'PHB', knownBonus: { 6: 2 },
        choices: [{ lvl: 3, id: 'loreskills', label: 'Bonus Proficiencies (3 skills)', type: 'skill', n: 3, from: 'any' }],
        features: [
          [3, 'Bonus Proficiencies', 'Three skills of your choice.'],
          [3, 'Cutting Words', 'Reaction: spend Bardic Inspiration to subtract the die from a creature\'s attack, check or damage roll within 60 ft.'],
          [6, 'Additional Magical Secrets', 'Learn two spells from any class (counted in your spells known).'],
          [14, 'Peerless Skill', 'Spend Bardic Inspiration to add the die to your own ability check.']
        ]
      },
      {
        id: 'valor', name: 'College of Valor', src: 'PHB', armor: ['Medium armor', 'Shields'], weapons: ['Martial weapons'],
        features: [
          [3, 'Bonus Proficiencies', 'Medium armor, shields, martial weapons.'],
          [3, 'Combat Inspiration', 'Inspired creatures can add the die to weapon damage, or to AC against one attack (reaction).'],
          [6, 'Extra Attack', 'Attack twice when you take the Attack action.'],
          [14, 'Battle Magic', 'After casting a bard spell with your action, make one weapon attack as a bonus action.']
        ]
      }
    ]
  });

  // ======================= CLERIC =======================
  function domain(id, name, spells, feats, extra) {
    var o = { id: id, name: name, src: 'PHB', spells: spells, features: feats };
    for (var k in extra || {}) o[k] = extra[k];
    return o;
  }
  DB.CLASSES.push({
    id: 'cleric', name: 'Cleric', src: 'PHB', hd: 8, saves: ['WIS', 'CHA'],
    armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons'],
    skills: { n: 2, from: ['History', 'Insight', 'Medicine', 'Persuasion', 'Religion'] },
    subLevel: 1, subName: 'Divine Domain', asi: ASI,
    caster: { type: 'full', abil: 'WIS', list: 'C', mode: 'prepared', cantrips: CANT_3_4_5 },
    cols: { 'Channel Divinity': fill([[2, 1], [6, 2], [18, 3]]), 'Destroy Undead': fill([[5, 'CR 1/2'], [8, 'CR 1'], [11, 'CR 2'], [14, 'CR 3'], [17, 'CR 4']]) },
    features: [
      [1, 'Spellcasting', 'Cleric spells use WIS. Prepare WIS mod + cleric level spells each long rest from the whole cleric list. Holy symbol as focus; rituals allowed.'],
      [1, 'Divine Domain', 'Choose your domain; domain spells are always prepared.'],
      [2, 'Channel Divinity', 'Channel divine energy (uses per short/long rest in the table). Turn Undead: undead within 30 ft make a WIS save or are turned for 1 minute.'],
      [5, 'Destroy Undead', 'Undead of the listed CR or lower that fail against Turn Undead are destroyed.'],
      [10, 'Divine Intervention', 'Action: roll d100; if ≤ cleric level your deity helps. Once per 7 days on success, otherwise after a long rest.'],
      [20, 'Divine Intervention Improvement', 'Divine Intervention succeeds automatically.']
    ],
    start: [['Mace', 'Warhammer'], ['Scale mail', 'Leather armor', 'Chain mail'], ['Light crossbow + Crossbow bolts (20)', '{simple}'], ["Priest's pack", "Explorer's pack"], ['Shield + Holy symbol']],
    subclasses: [
      domain('knowledge', 'Knowledge Domain', { 1: ['Command', 'Identify'], 3: ['Augury', 'Suggestion'], 5: ['Nondetection', 'Speak with Dead'], 7: ['Arcane Eye', 'Confusion'], 9: ['Legend Lore', 'Scrying'] }, [
        [1, 'Blessings of Knowledge', 'Learn two languages; proficiency and expertise in two of Arcana, History, Nature, Religion.'],
        [2, 'Channel Divinity: Knowledge of the Ages', 'Action: proficiency with one skill or tool for 10 minutes.'],
        [6, 'Channel Divinity: Read Thoughts', 'Read a creature\'s surface thoughts (WIS save), and can cast suggestion on it without a slot.'],
        [8, 'Potent Spellcasting', 'Add WIS mod to cleric cantrip damage.'],
        [17, 'Visions of the Past', 'Meditate to see recent past events tied to an object or area.']
      ], { choices: [{ lvl: 1, id: 'kskills', label: 'Blessings of Knowledge: 2 skills (with expertise)', type: 'skill', n: 2, from: ['Arcana', 'History', 'Nature', 'Religion'], expertise: true }, { lvl: 1, id: 'klang', label: 'Two languages', type: 'language', n: 2 }] }),
      domain('life', 'Life Domain', { 1: ['Bless', 'Cure Wounds'], 3: ['Lesser Restoration', 'Spiritual Weapon'], 5: ['Beacon of Hope', 'Revivify'], 7: ['Death Ward', 'Guardian of Faith'], 9: ['Mass Cure Wounds', 'Raise Dead'] }, [
        [1, 'Bonus Proficiency', 'Heavy armor.'],
        [1, 'Disciple of Life', 'Healing spells of 1st level+ restore extra HP = 2 + spell level.'],
        [2, 'Channel Divinity: Preserve Life', 'Action: distribute HP = 5 × cleric level among creatures within 30 ft (up to half their max).'],
        [6, 'Blessed Healer', 'When you heal another with a 1st+ level spell, you regain 2 + spell level HP.'],
        [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 radiant (2d8 at 14th).'],
        [17, 'Supreme Healing', 'Healing spell dice are maximized.']
      ], { armor: ['Heavy armor'] }),
      domain('light', 'Light Domain', { 1: ['Burning Hands', 'Faerie Fire'], 3: ['Flaming Sphere', 'Scorching Ray'], 5: ['Daylight', 'Fireball'], 7: ['Guardian of Faith', 'Wall of Fire'], 9: ['Flame Strike', 'Scrying'] }, [
        [1, 'Bonus Cantrip', 'Learn the light cantrip.'],
        [1, 'Warding Flare', 'Reaction: impose disadvantage on an attack against you from a creature within 30 ft. WIS mod uses per long rest.'],
        [2, 'Channel Divinity: Radiance of the Dawn', 'Action: dispel magical darkness within 30 ft; hostiles take 2d10 + cleric level radiant (CON half).'],
        [6, 'Improved Flare', 'Use Warding Flare to protect others.'],
        [8, 'Potent Spellcasting', 'Add WIS mod to cleric cantrip damage.'],
        [17, 'Corona of Light', 'Action: emit sunlight for 1 minute; enemies have disadvantage on saves vs fire/radiant spells.']
      ], { grantedSpells: [{ name: 'Light', at: 1 }] }),
      domain('nature', 'Nature Domain', { 1: ['Animal Friendship', 'Speak with Animals'], 3: ['Barkskin', 'Spike Growth'], 5: ['Plant Growth', 'Wind Wall'], 7: ['Dominate Beast', 'Grasping Vine'], 9: ['Insect Plague', 'Tree Stride'] }, [
        [1, 'Acolyte of Nature', 'One druid cantrip; one skill from Animal Handling, Nature, Survival.'],
        [1, 'Bonus Proficiency', 'Heavy armor.'],
        [2, 'Channel Divinity: Charm Animals and Plants', 'Action: beasts and plants within 30 ft (WIS save) are charmed for 1 minute.'],
        [6, 'Dampen Elements', 'Reaction: give resistance to acid, cold, fire, lightning or thunder damage to a creature within 30 ft.'],
        [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 cold, fire or lightning (2d8 at 14th).'],
        [17, 'Master of Nature', 'Command charmed animals and plants as a bonus action.']
      ], { armor: ['Heavy armor'], choices: [{ lvl: 1, id: 'ncantrip', label: 'Druid cantrip', type: 'spell', n: 1, spellLvl: 0, list: 'D' }, { lvl: 1, id: 'nskill', label: 'Skill', type: 'skill', n: 1, from: ['Animal Handling', 'Nature', 'Survival'] }] }),
      domain('tempest', 'Tempest Domain', { 1: ['Fog Cloud', 'Thunderwave'], 3: ['Gust of Wind', 'Shatter'], 5: ['Call Lightning', 'Sleet Storm'], 7: ['Control Water', 'Ice Storm'], 9: ['Destructive Wave', 'Insect Plague'] }, [
        [1, 'Bonus Proficiencies', 'Martial weapons and heavy armor.'],
        [1, 'Wrath of the Storm', 'Reaction when hit by a creature within 5 ft: 2d8 lightning or thunder (DEX half). WIS mod uses per long rest.'],
        [2, 'Channel Divinity: Destructive Wrath', 'Maximize lightning or thunder damage of one roll.'],
        [6, 'Thunderbolt Strike', 'Your lightning damage can push Large or smaller creatures 10 ft.'],
        [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 thunder (2d8 at 14th).'],
        [17, 'Stormborn', 'Flying speed equal to walking speed outdoors and not underground.']
      ], { armor: ['Heavy armor'], weapons: ['Martial weapons'] }),
      domain('trickery', 'Trickery Domain', { 1: ['Charm Person', 'Disguise Self'], 3: ['Mirror Image', 'Pass without Trace'], 5: ['Blink', 'Dispel Magic'], 7: ['Dimension Door', 'Polymorph'], 9: ['Dominate Person', 'Modify Memory'] }, [
        [1, 'Blessing of the Trickster', 'Action: a willing creature gets advantage on Stealth for 1 hour.'],
        [2, 'Channel Divinity: Invoke Duplicity', 'Create an illusory duplicate for 1 minute (concentration); cast spells from its space; advantage on attacks when both are near a target.'],
        [6, 'Channel Divinity: Cloak of Shadows', 'Action: become invisible until the end of your next turn.'],
        [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 poison (2d8 at 14th).'],
        [17, 'Improved Duplicity', 'Invoke Duplicity makes up to four duplicates.']
      ]),
      domain('war', 'War Domain', { 1: ['Divine Favor', 'Shield of Faith'], 3: ['Magic Weapon', 'Spiritual Weapon'], 5: ["Crusader's Mantle", 'Spirit Guardians'], 7: ['Freedom of Movement', 'Stoneskin'], 9: ['Flame Strike', 'Hold Monster'] }, [
        [1, 'Bonus Proficiencies', 'Martial weapons and heavy armor.'],
        [1, 'War Priest', 'After taking the Attack action, make one weapon attack as a bonus action. WIS mod uses per long rest.'],
        [2, 'Channel Divinity: Guided Strike', '+10 to one attack roll.'],
        [6, "Channel Divinity: War God's Blessing", 'Reaction: give +10 to an ally\'s attack roll within 30 ft.'],
        [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 of the weapon\'s damage type (2d8 at 14th).'],
        [17, 'Avatar of Battle', 'Resistance to nonmagical bludgeoning, piercing and slashing damage.']
      ], { armor: ['Heavy armor'], weapons: ['Martial weapons'] })
    ]
  });

  // ======================= DRUID =======================
  var LAND = {
    Arctic: { 3: ['Hold Person', 'Spike Growth'], 5: ['Sleet Storm', 'Slow'], 7: ['Freedom of Movement', 'Ice Storm'], 9: ['Commune with Nature', 'Cone of Cold'] },
    Coast: { 3: ['Mirror Image', 'Misty Step'], 5: ['Water Breathing', 'Water Walk'], 7: ['Control Water', 'Freedom of Movement'], 9: ['Conjure Elemental', 'Scrying'] },
    Desert: { 3: ['Blur', 'Silence'], 5: ['Create Food and Water', 'Protection from Energy'], 7: ['Blight', 'Hallucinatory Terrain'], 9: ['Insect Plague', 'Wall of Stone'] },
    Forest: { 3: ['Barkskin', 'Spider Climb'], 5: ['Call Lightning', 'Plant Growth'], 7: ['Divination', 'Freedom of Movement'], 9: ['Commune with Nature', 'Tree Stride'] },
    Grassland: { 3: ['Invisibility', 'Pass without Trace'], 5: ['Daylight', 'Haste'], 7: ['Divination', 'Freedom of Movement'], 9: ['Dream', 'Insect Plague'] },
    Mountain: { 3: ['Spider Climb', 'Spike Growth'], 5: ['Lightning Bolt', 'Meld into Stone'], 7: ['Stone Shape', 'Stoneskin'], 9: ['Passwall', 'Wall of Stone'] },
    Swamp: { 3: ['Darkness', "Melf's Acid Arrow"], 5: ['Water Walk', 'Stinking Cloud'], 7: ['Freedom of Movement', 'Locate Creature'], 9: ['Insect Plague', 'Scrying'] },
    Underdark: { 3: ['Spider Climb', 'Web'], 5: ['Gaseous Form', 'Stinking Cloud'], 7: ['Greater Invisibility', 'Stone Shape'], 9: ['Cloudkill', 'Insect Plague'] }
  };
  DB.LAND_SPELLS = LAND;
  DB.CLASSES.push({
    id: 'druid', name: 'Druid', src: 'PHB', hd: 8, saves: ['INT', 'WIS'],
    armor: ['Light armor', 'Medium armor', 'Shields'], armorNote: 'Druids won\'t wear metal armor or shields.',
    weapons: ['Club', 'Dagger', 'Dart', 'Javelin', 'Mace', 'Quarterstaff', 'Scimitar', 'Sickle', 'Sling', 'Spear'],
    tools: ['Herbalism kit'], languages: ['Druidic'],
    skills: { n: 2, from: ['Arcana', 'Animal Handling', 'Insight', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'] },
    subLevel: 2, subName: 'Druid Circle', asi: ASI,
    caster: { type: 'full', abil: 'WIS', list: 'D', mode: 'prepared', cantrips: CANT_2_3_4 },
    cols: { 'Wild Shape (max CR)': fill([[2, '1/4, no fly/swim'], [4, '1/2, no fly'], [8, '1']]) },
    features: [
      [1, 'Druidic', 'You know Druidic, the secret druid language.'],
      [1, 'Spellcasting', 'Druid spells use WIS. Prepare WIS mod + druid level spells each long rest. Druidic focus; rituals allowed.'],
      [2, 'Wild Shape', 'Action: turn into a beast you have seen (CR limit per table) for half your druid level in hours. Twice per short/long rest. Keep mental scores; drop to normal form at 0 beast HP.'],
      [2, 'Druid Circle', 'Choose your circle.'],
      [18, 'Timeless Body', 'Age 1 year for every 10 that pass.'],
      [18, 'Beast Spells', 'Cast spells in Wild Shape (verbal and somatic components only).'],
      [20, 'Archdruid', 'Unlimited Wild Shape; ignore V/S and non-costly M components of druid spells.']
    ],
    start: [['Shield', '{simple}'], ['Scimitar', '{simple-melee}'], ["Leather armor + Explorer's pack + Druidic focus"]],
    subclasses: [
      {
        id: 'land', name: 'Circle of the Land', src: 'PHB', cantripBonus: 1,
        choices: [{ lvl: 2, id: 'terrain', label: 'Land (circle spells at 3rd)', type: 'list', n: 1, opts: 'landTerrain' }],
        landSpells: true,
        features: [
          [2, 'Bonus Cantrip', 'One extra druid cantrip.'],
          [2, 'Natural Recovery', 'Once per day on a short rest, recover slots totaling half your druid level (rounded up), none 6th+.'],
          [3, 'Circle Spells', 'Always-prepared spells based on your land at 3rd, 5th, 7th and 9th.'],
          [6, "Land's Stride", 'Nonmagical difficult terrain costs no extra movement; advantage vs magical plants.'],
          [10, "Nature's Ward", 'Can\'t be charmed or frightened by fey/elementals; immune to poison and disease.'],
          [14, "Nature's Sanctuary", 'Beasts and plants must make a WIS save to attack you.']
        ]
      },
      {
        id: 'moon', name: 'Circle of the Moon', src: 'PHB', features: [
          [2, 'Combat Wild Shape', 'Wild Shape as a bonus action; while transformed, spend a slot as a bonus action to heal 1d8 per slot level.'],
          [2, 'Circle Forms', 'Wild Shape into CR 1 beasts; from 6th, CR = druid level ÷ 3 (rounded down).'],
          [6, 'Primal Strike', 'Beast-form attacks count as magical.'],
          [10, 'Elemental Wild Shape', 'Spend two Wild Shape uses to become an air, earth, fire or water elemental.'],
          [14, 'Thousand Forms', 'Cast alter self at will.']
        ]
      }
    ]
  });

  // ======================= FIGHTER =======================
  DB.CLASSES.push({
    id: 'fighter', name: 'Fighter', src: 'PHB', hd: 10, saves: ['STR', 'CON'],
    armor: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'],
    skills: { n: 2, from: ['Acrobatics', 'Animal Handling', 'Athletics', 'History', 'Insight', 'Intimidation', 'Perception', 'Survival'] },
    subLevel: 3, subName: 'Martial Archetype', asi: [4, 6, 8, 12, 14, 16, 19],
    cols: { 'Action Surge': fill([[2, 1], [17, 2]]), 'Indomitable': fill([[9, 1], [13, 2], [17, 3]]), 'Attacks': fill([[1, 1], [5, 2], [11, 3], [20, 4]]) },
    choices: [{ lvl: 1, id: 'style', label: 'Fighting Style', type: 'list', n: 1, opts: 'fightingStyle' }],
    features: [
      [1, 'Fighting Style', 'Choose a fighting style.'],
      [1, 'Second Wind', 'Bonus action: regain 1d10 + fighter level HP. Once per short/long rest.'],
      [2, 'Action Surge', 'Take one additional action on your turn. Once per short/long rest (twice at 17th, one per turn).'],
      [3, 'Martial Archetype', 'Choose your archetype.'],
      [5, 'Extra Attack', 'Attack twice per Attack action (three at 11th, four at 20th).'],
      [9, 'Indomitable', 'Reroll a failed save. Uses per long rest in the table.']
    ],
    start: [['Chain mail', 'Leather armor + Longbow + Arrows (20)'], ['{martial} + Shield', '{martial} + {martial}'], ['Light crossbow + Crossbow bolts (20)', 'Handaxe x2'], ["Dungeoneer's pack", "Explorer's pack"]],
    subclasses: [
      {
        id: 'champion', name: 'Champion', src: 'PHB',
        choices: [{ lvl: 10, id: 'style2', label: 'Additional Fighting Style', type: 'list', n: 1, opts: 'fightingStyle' }],
        features: [
          [3, 'Improved Critical', 'Weapon attacks crit on 19–20.'],
          [7, 'Remarkable Athlete', 'Add half proficiency (rounded up) to STR, DEX and CON checks that don\'t use proficiency; running long jump +STR mod ft.', { remarkableAthlete: true }],
          [10, 'Additional Fighting Style', 'Choose a second fighting style.'],
          [15, 'Superior Critical', 'Weapon attacks crit on 18–20.'],
          [18, 'Survivor', 'At the start of your turn, regain 5 + CON mod HP if at or below half HP (and above 0).']
        ]
      },
      {
        id: 'battlemaster', name: 'Battle Master', src: 'PHB',
        cols: { 'Superiority Dice': fill([[3, '4d8'], [7, '5d8'], [10, '5d10'], [15, '6d10'], [18, '6d12']]) },
        choices: [
          { lvl: 3, id: 'man3', label: 'Maneuvers (3)', type: 'list', n: 3, opts: 'maneuver' },
          { lvl: 3, id: 'tool', label: "Student of War (artisan's tool)", type: 'tool', n: 1, from: 'ARTISAN_TOOLS' },
          { lvl: 7, id: 'man7', label: 'Maneuvers (+2)', type: 'list', n: 2, opts: 'maneuver' },
          { lvl: 10, id: 'man10', label: 'Maneuvers (+2)', type: 'list', n: 2, opts: 'maneuver' },
          { lvl: 15, id: 'man15', label: 'Maneuvers (+2)', type: 'list', n: 2, opts: 'maneuver' }
        ],
        features: [
          [3, 'Combat Superiority', 'Superiority dice fuel maneuvers (one per attack). Regain on short/long rest. Maneuver save DC = 8 + prof + STR or DEX mod.'],
          [3, 'Student of War', "Proficiency with one artisan's tool."],
          [7, 'Know Your Enemy', 'Study a creature for 1 minute to learn how it compares to you in two characteristics.'],
          [10, 'Improved Combat Superiority', 'Superiority dice become d10s (d12s at 18th).'],
          [15, 'Relentless', 'Regain one superiority die when you roll initiative with none left.']
        ]
      },
      {
        id: 'eldritchknight', name: 'Eldritch Knight', src: 'PHB',
        caster: { type: 'third', abil: 'INT', list: 'W', mode: 'known', cantrips: THIRD_CANT, known: THIRD_KNOWN, note: 'Mostly abjuration and evocation; at 3rd, 8th, 14th and 20th you may pick from any school.' },
        features: [
          [3, 'Spellcasting', 'Wizard spells using INT (mostly abjuration/evocation). Third-caster slots.'],
          [3, 'Weapon Bond', 'Bond with up to two weapons: can\'t be disarmed, summon to hand as a bonus action.'],
          [7, 'War Magic', 'After casting a cantrip with your action, make one weapon attack as a bonus action.'],
          [10, 'Eldritch Strike', 'A creature you hit with a weapon has disadvantage on its next save against your spell before the end of your next turn.'],
          [15, 'Arcane Charge', 'Teleport up to 30 ft when you use Action Surge.'],
          [18, 'Improved War Magic', 'After casting a spell with your action, make one weapon attack as a bonus action.']
        ]
      }
    ]
  });

  // ======================= MONK =======================
  DB.CLASSES.push({
    id: 'monk', name: 'Monk', src: 'PHB', hd: 8, saves: ['STR', 'DEX'],
    armor: [], weapons: ['Simple weapons', 'Shortswords'],
    toolChoice: { n: 1, from: 'ARTISAN_OR_INSTRUMENT', label: "One artisan's tool or musical instrument" },
    skills: { n: 2, from: ['Acrobatics', 'Athletics', 'History', 'Insight', 'Religion', 'Stealth'] },
    subLevel: 3, subName: 'Monastic Tradition', asi: ASI,
    cols: {
      'Martial Arts': fill([[1, '1d4'], [5, '1d6'], [11, '1d8'], [17, '1d10']]),
      'Ki Points': fill([[2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20]]),
      'Unarmored Movement': fill([[2, '+10 ft'], [6, '+15 ft'], [10, '+20 ft'], [14, '+25 ft'], [18, '+30 ft']])
    },
    features: [
      [1, 'Unarmored Defense', 'Without armor or shield, AC = 10 + DEX + WIS.', { acFormula: { name: 'Unarmored Defense (Monk)', base: 10, add: ['DEX', 'WIS'], shield: false } }],
      [1, 'Martial Arts', 'With unarmed strikes or monk weapons (and no armor/shield): use DEX instead of STR, damage uses the Martial Arts die, and make an unarmed strike as a bonus action after the Attack action.', { martialArts: true }],
      [2, 'Ki', 'Ki points (= monk level) per short/long rest. Flurry of Blows (1 ki: two unarmed strikes as a bonus action), Patient Defense (1 ki: Dodge as bonus action), Step of the Wind (1 ki: Disengage or Dash as bonus action, jump doubled). Ki save DC = 8 + prof + WIS.'],
      [2, 'Unarmored Movement', 'Speed bonus without armor or shield (see table). At 9th, move along walls and across liquids.', { unarmoredMovement: true }],
      [3, 'Monastic Tradition', 'Choose your tradition.'],
      [3, 'Deflect Missiles', 'Reaction: reduce ranged weapon damage by 1d10 + DEX + monk level; if reduced to 0, spend 1 ki to throw it back.'],
      [4, 'Slow Fall', 'Reaction: reduce falling damage by 5 × monk level.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [5, 'Stunning Strike', 'On a melee weapon hit, spend 1 ki: CON save or stunned until the end of your next turn.'],
      [6, 'Ki-Empowered Strikes', 'Unarmed strikes count as magical.'],
      [7, 'Evasion', 'DEX saves for half: no damage on success, half on failure.'],
      [7, 'Stillness of Mind', 'Action: end one charmed or frightened effect on yourself.'],
      [10, 'Purity of Body', 'Immune to disease and poison.'],
      [13, 'Tongue of the Sun and Moon', 'Understand all spoken languages; anyone with a language understands you.'],
      [14, 'Diamond Soul', 'Proficiency in all saving throws; spend 1 ki to reroll a failed save.', { saveProf: 'all' }],
      [15, 'Timeless Body', 'No frailty of age; no need for food or water.'],
      [18, 'Empty Body', '4 ki: invisible and resistant to all damage but force for 1 minute. 8 ki: cast astral projection on yourself.'],
      [20, 'Perfect Self', 'Regain 4 ki when you roll initiative with none.']
    ],
    start: [['Shortsword', '{simple}'], ["Dungeoneer's pack", "Explorer's pack"], ['Dart x10']],
    subclasses: [
      {
        id: 'openhand', name: 'Way of the Open Hand', src: 'PHB', features: [
          [3, 'Open Hand Technique', 'Flurry of Blows hits can knock prone (DEX save), push 15 ft (STR save), or deny reactions.'],
          [6, 'Wholeness of Body', 'Action: regain HP = 3 × monk level, once per long rest.'],
          [11, 'Tranquility', 'Sanctuary effect after each long rest until you attack or cast.'],
          [17, 'Quivering Palm', '3 ki on a hit: later, action to force a CON save (0 HP on fail, 10d10 necrotic on success).']
        ]
      },
      {
        id: 'shadow', name: 'Way of Shadow', src: 'PHB', features: [
          [3, 'Shadow Arts', '2 ki: cast darkness, darkvision, pass without trace or silence. Learn minor illusion.'],
          [6, 'Shadow Step', 'Bonus action: teleport 60 ft between dim light/darkness; advantage on next melee attack.'],
          [11, 'Cloak of Shadows', 'Action: become invisible in dim light or darkness.'],
          [17, 'Opportunist', 'Reaction: attack a creature within 5 ft that was just hit by someone else.']
        ], grantedSpells: [{ name: 'Minor Illusion', at: 3 }]
      },
      {
        id: 'fourelements', name: 'Way of the Four Elements', src: 'PHB',
        choices: [
          { lvl: 3, id: 'disc3', label: 'Elemental Discipline (plus Elemental Attunement)', type: 'list', n: 1, opts: 'elementalDiscipline' },
          { lvl: 6, id: 'disc6', label: 'Elemental Discipline', type: 'list', n: 1, opts: 'elementalDiscipline' },
          { lvl: 11, id: 'disc11', label: 'Elemental Discipline', type: 'list', n: 1, opts: 'elementalDiscipline' },
          { lvl: 17, id: 'disc17', label: 'Elemental Discipline', type: 'list', n: 1, opts: 'elementalDiscipline' }
        ],
        cols: { 'Max ki per spell': fill([[3, 2], [5, 3], [9, 4], [13, 5], [17, 6]]) },
        features: [
          [3, 'Disciple of the Elements', 'Learn Elemental Attunement plus one discipline; more at 6th, 11th, 17th. Can swap one when you learn a new one.'],
          [3, 'Elemental Attunement', 'Action: minor elemental effects (sense, light/snuff, shape, move earth/water).']
        ]
      }
    ]
  });

  // ======================= PALADIN =======================
  DB.CLASSES.push({
    id: 'paladin', name: 'Paladin', src: 'PHB', hd: 10, saves: ['WIS', 'CHA'],
    armor: ['Light armor', 'Medium armor', 'Heavy armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'],
    skills: { n: 2, from: ['Athletics', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    subLevel: 3, subName: 'Sacred Oath', asi: ASI,
    caster: { type: 'half', abil: 'CHA', list: 'P', mode: 'prepared', prepHalf: true, start: 2 },
    cols: { 'Lay on Hands pool': fill([[1, 5], [2, 10], [3, 15], [4, 20], [5, 25], [6, 30], [7, 35], [8, 40], [9, 45], [10, 50], [11, 55], [12, 60], [13, 65], [14, 70], [15, 75], [16, 80], [17, 85], [18, 90], [19, 95], [20, 100]]), 'Channel Divinity': fill([[3, 1]]), 'Aura range': fill([[6, '10 ft'], [18, '30 ft']]) },
    choices: [{ lvl: 2, id: 'style', label: 'Fighting Style', type: 'list', n: 1, opts: 'fightingStylePaladin' }],
    features: [
      [1, 'Divine Sense', 'Action: sense celestials, fiends and undead within 60 ft until your next turn. 1 + CHA mod uses per long rest.'],
      [1, 'Lay on Hands', 'Pool of 5 × paladin level HP per long rest. Action: touch to restore HP, or spend 5 to cure a disease/poison.'],
      [2, 'Fighting Style', 'Choose a fighting style.'],
      [2, 'Spellcasting', 'Paladin spells use CHA. Prepare CHA mod + half paladin level (min 1) spells each long rest. Holy symbol as focus.'],
      [2, 'Divine Smite', 'On a melee weapon hit, spend a slot: +2d8 radiant, +1d8 per slot level above 1st (max 5d8), +1d8 vs undead or fiends.'],
      [3, 'Divine Health', 'Immune to disease.'],
      [3, 'Sacred Oath', 'Swear your oath; oath spells are always prepared. Channel Divinity once per short/long rest.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [6, 'Aura of Protection', 'You and friendly creatures within 10 ft add your CHA mod (min +1) to saves while you are conscious (30 ft at 18th).', { saveBonusAbil: 'CHA' }],
      [10, 'Aura of Courage', 'You and friends within 10 ft can\'t be frightened while you are conscious (30 ft at 18th).'],
      [11, 'Improved Divine Smite', 'All melee weapon hits deal an extra 1d8 radiant.'],
      [14, 'Cleansing Touch', 'Action: end one spell on yourself or a willing creature. CHA mod uses per long rest.'],
      [18, 'Aura Improvements', 'Your auras extend to 30 ft.']
    ],
    start: [['{martial} + Shield', '{martial} + {martial}'], ['Javelin x5', '{simple-melee}'], ["Priest's pack", "Explorer's pack"], ['Chain mail + Holy symbol']],
    subclasses: [
      {
        id: 'devotion', name: 'Oath of Devotion', src: 'PHB', tenets: 'Honesty, Courage, Compassion, Honor, Duty',
        spells: { 3: ['Protection from Evil and Good', 'Sanctuary'], 5: ['Lesser Restoration', 'Zone of Truth'], 9: ['Beacon of Hope', 'Dispel Magic'], 13: ['Freedom of Movement', 'Guardian of Faith'], 17: ['Commune', 'Flame Strike'] },
        features: [
          [3, 'Channel Divinity: Sacred Weapon', 'Action: add CHA mod to attack rolls with a weapon for 1 minute; it sheds light and counts as magical.'],
          [3, 'Channel Divinity: Turn the Unholy', 'Fiends and undead within 30 ft make a WIS save or are turned for 1 minute.'],
          [7, 'Aura of Devotion', 'You and friends in your aura can\'t be charmed.'],
          [15, 'Purity of Spirit', 'Always under protection from evil and good.'],
          [20, 'Holy Nimbus', 'Action: radiate sunlight for 1 minute; enemies starting in it take 10 radiant; advantage on saves vs fiend/undead spells. Once per long rest.']
        ]
      },
      {
        id: 'ancients', name: 'Oath of the Ancients', src: 'PHB', tenets: 'Kindle the Light, Shelter the Light, Preserve Your Own Light, Be the Light',
        spells: { 3: ['Ensnaring Strike', 'Speak with Animals'], 5: ['Misty Step', 'Moonbeam'], 9: ['Plant Growth', 'Protection from Energy'], 13: ['Ice Storm', 'Stoneskin'], 17: ['Commune with Nature', 'Tree Stride'] },
        features: [
          [3, "Channel Divinity: Nature's Wrath", 'Spectral vines restrain a creature within 10 ft (STR or DEX save, repeats each turn).'],
          [3, 'Channel Divinity: Turn the Faithless', 'Fey and fiends within 30 ft make a WIS save or are turned for 1 minute.'],
          [7, 'Aura of Warding', 'You and friends in your aura have resistance to spell damage.'],
          [15, 'Undying Sentinel', 'Drop to 1 HP instead of 0 once per long rest; you don\'t suffer age drawbacks.'],
          [20, 'Elder Champion', 'Action: 1 minute transformation: regain 10 HP each turn, cast paladin spells as bonus actions, enemies in aura have disadvantage on saves vs your spells and Channel Divinity. Once per long rest.']
        ]
      },
      {
        id: 'vengeance', name: 'Oath of Vengeance', src: 'PHB', tenets: 'Fight the Greater Evil, No Mercy for the Wicked, By Any Means Necessary, Restitution',
        spells: { 3: ['Bane', "Hunter's Mark"], 5: ['Hold Person', 'Misty Step'], 9: ['Haste', 'Protection from Energy'], 13: ['Banishment', 'Dimension Door'], 17: ['Hold Monster', 'Scrying'] },
        features: [
          [3, 'Channel Divinity: Abjure Enemy', 'Action: one creature within 60 ft makes a WIS save (fiends/undead at disadvantage) or is frightened for 1 minute with speed 0; on a success its speed is halved.'],
          [3, 'Channel Divinity: Vow of Enmity', 'Bonus action: gain advantage on attack rolls against one creature within 10 ft for 1 minute.'],
          [7, 'Relentless Avenger', 'When you hit with an opportunity attack, move up to half your speed right after without provoking.'],
          [15, 'Soul of Vengeance', 'When the target of your Vow of Enmity attacks, use your reaction to make a melee weapon attack against it.'],
          [20, 'Avenging Angel', 'Action: 1 hour transformation: 60 ft fly speed and a 30 ft aura that frightens enemies (WIS save) entering or starting in it. Once per long rest.']
        ]
      }
    ]
  });

  // ======================= RANGER =======================
  DB.CLASSES.push({
    id: 'ranger', name: 'Ranger', src: 'PHB', hd: 10, saves: ['STR', 'DEX'],
    armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'],
    skills: { n: 3, from: ['Animal Handling', 'Athletics', 'Insight', 'Investigation', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    subLevel: 3, subName: 'Ranger Archetype', asi: ASI,
    caster: { type: 'half', abil: 'WIS', list: 'R', mode: 'known', start: 2, known: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11] },
    choices: [
      { lvl: 1, id: 'enemy1', label: 'Favored Enemy', type: 'list', n: 1, opts: 'favoredEnemy' },
      { lvl: 1, id: 'terrain1', label: 'Natural Explorer: favored terrain', type: 'list', n: 1, opts: 'terrain' },
      { lvl: 2, id: 'style', label: 'Fighting Style', type: 'list', n: 1, opts: 'fightingStyleRanger' },
      { lvl: 6, id: 'enemy6', label: 'Favored Enemy (2nd)', type: 'list', n: 1, opts: 'favoredEnemy' },
      { lvl: 6, id: 'terrain6', label: 'Favored terrain (2nd)', type: 'list', n: 1, opts: 'terrain' },
      { lvl: 10, id: 'terrain10', label: 'Favored terrain (3rd)', type: 'list', n: 1, opts: 'terrain' },
      { lvl: 14, id: 'enemy14', label: 'Favored Enemy (3rd)', type: 'list', n: 1, opts: 'favoredEnemy' }
    ],
    features: [
      [1, 'Favored Enemy', 'Advantage on Survival checks to track and INT checks to recall info about favored enemies; learn one of their languages. More at 6th and 14th.'],
      [1, 'Natural Explorer', 'Benefits in favored terrain: doubled proficiency on INT/WIS checks, difficult terrain doesn\'t slow your group, can\'t get lost, and more. More terrains at 6th and 10th.'],
      [2, 'Fighting Style', 'Choose a fighting style.'],
      [2, 'Spellcasting', 'Ranger spells use WIS. You know a set number; swap one on level up.'],
      [3, 'Ranger Archetype', 'Choose your archetype.'],
      [3, 'Primeval Awareness', 'Spend a slot to sense certain creature types within 1 mile (6 in favored terrain) for 1 minute per slot level.'],
      [5, 'Extra Attack', 'Attack twice when you take the Attack action.'],
      [8, "Land's Stride", 'Nonmagical difficult terrain costs no extra movement; advantage vs magical plants.'],
      [10, 'Hide in Plain Sight', 'Spend 1 minute camouflaging: +10 Stealth while you stay still.'],
      [14, 'Vanish', 'Hide as a bonus action; can\'t be tracked by nonmagical means.'],
      [18, 'Feral Senses', 'No disadvantage attacking creatures you can\'t see; aware of invisible creatures within 30 ft.'],
      [20, 'Foe Slayer', 'Once per turn add WIS mod to an attack or damage roll against a favored enemy.']
    ],
    start: [['Scale mail', 'Leather armor'], ['Shortsword x2', '{simple-melee} + {simple-melee}'], ["Dungeoneer's pack", "Explorer's pack"], ['Longbow + Arrows (20) + Quiver']],
    subclasses: [
      {
        id: 'hunter', name: 'Hunter', src: 'PHB',
        choices: [
          { lvl: 3, id: 'prey', label: "Hunter's Prey", type: 'list', n: 1, opts: 'huntersPrey' },
          { lvl: 7, id: 'tactics', label: 'Defensive Tactics', type: 'list', n: 1, opts: 'defensiveTactics' },
          { lvl: 11, id: 'multi', label: 'Multiattack', type: 'list', n: 1, opts: 'multiattack' },
          { lvl: 15, id: 'superior', label: "Superior Hunter's Defense", type: 'list', n: 1, opts: 'superiorDefense' }
        ],
        features: [[3, "Hunter's Prey", 'Choose an option.'], [7, 'Defensive Tactics', 'Choose an option.'], [11, 'Multiattack', 'Choose an option.'], [15, "Superior Hunter's Defense", 'Choose an option.']]
      },
      {
        id: 'beastmaster', name: 'Beast Master', src: 'PHB', features: [
          [3, "Ranger's Companion", 'Gain a Medium or smaller beast companion (CR 1/4 or lower). Add your proficiency to its AC, attacks, damage, saves and skills; HP max = 4 × ranger level or its normal max. It attacks when you use your action to command it.'],
          [7, 'Exceptional Training', 'Bonus action to have it Dash, Disengage, Dodge or Help; its attacks count as magical (from 7th).'],
          [11, 'Bestial Fury', 'Your companion makes two attacks when commanded to Attack.'],
          [15, 'Share Spells', 'Self-targeting spells can also affect your companion within 30 ft.']
        ]
      }
    ]
  });

  // ======================= ROGUE =======================
  DB.CLASSES.push({
    id: 'rogue', name: 'Rogue', src: 'PHB', hd: 8, saves: ['DEX', 'INT'],
    armor: ['Light armor'], weapons: ['Simple weapons', 'Hand crossbow', 'Longsword', 'Rapier', 'Shortsword'],
    tools: ["Thieves' tools"], languages: ["Thieves' Cant"],
    skills: { n: 4, from: ['Acrobatics', 'Athletics', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Perception', 'Performance', 'Persuasion', 'Sleight of Hand', 'Stealth'] },
    subLevel: 3, subName: 'Roguish Archetype', asi: [4, 8, 10, 12, 16, 19],
    cols: { 'Sneak Attack': fill([[1, '1d6'], [3, '2d6'], [5, '3d6'], [7, '4d6'], [9, '5d6'], [11, '6d6'], [13, '7d6'], [15, '8d6'], [17, '9d6'], [19, '10d6']]) },
    choices: [
      { lvl: 1, id: 'expertise1', label: "Expertise (2 skills or thieves' tools)", type: 'expertise', n: 2, allowThieves: true },
      { lvl: 6, id: 'expertise6', label: 'Expertise (2 more)', type: 'expertise', n: 2, allowThieves: true }
    ],
    features: [
      [1, 'Expertise', "Double proficiency for two skills (or thieves' tools). Two more at 6th."],
      [1, 'Sneak Attack', 'Once per turn, extra damage with a finesse or ranged weapon if you have advantage, or an ally is within 5 ft of the target and you don\'t have disadvantage.'],
      [1, "Thieves' Cant", 'Secret mix of dialect, jargon and code.'],
      [2, 'Cunning Action', 'Bonus action: Dash, Disengage or Hide.'],
      [3, 'Roguish Archetype', 'Choose your archetype.'],
      [5, 'Uncanny Dodge', 'Reaction: halve the damage of an attack from an attacker you can see.'],
      [7, 'Evasion', 'DEX saves for half: no damage on success, half on failure.'],
      [11, 'Reliable Talent', 'Treat d20 rolls of 9 or lower as 10 on checks you are proficient in.'],
      [14, 'Blindsense', 'Aware of hidden or invisible creatures within 10 ft if you can hear.'],
      [15, 'Slippery Mind', 'Proficiency in WIS saves.', { saveProf: ['WIS'] }],
      [18, 'Elusive', 'No attack roll has advantage against you while you aren\'t incapacitated.'],
      [20, 'Stroke of Luck', 'Turn a miss into a hit or a failed check into a 20. Once per short/long rest.']
    ],
    start: [['Rapier', 'Shortsword'], ['Shortbow + Arrows (20) + Quiver', 'Shortsword'], ["Burglar's pack", "Dungeoneer's pack", "Explorer's pack"], ["Leather armor + Dagger x2 + Thieves' tools"]],
    subclasses: [
      {
        id: 'thief', name: 'Thief', src: 'PHB', features: [
          [3, 'Fast Hands', 'Cunning Action can also make a Sleight of Hand check, use thieves\' tools, or Use an Object.'],
          [3, 'Second-Story Work', 'Climbing costs no extra movement; running jump +DEX mod ft.'],
          [9, 'Supreme Sneak', 'Advantage on Stealth if you move no more than half speed.'],
          [13, 'Use Magic Device', 'Ignore class, race and level requirements on magic items.'],
          [17, "Thief's Reflexes", 'Take two turns in the first round of combat (second at initiative − 10).']
        ]
      },
      {
        id: 'assassin', name: 'Assassin', src: 'PHB', tools: ['Disguise kit', "Poisoner's kit"], features: [
          [3, 'Bonus Proficiencies', "Disguise kit and poisoner's kit."],
          [3, 'Assassinate', 'Advantage vs creatures that haven\'t acted yet; hits against surprised creatures are crits.'],
          [9, 'Infiltration Expertise', 'Spend 7 days and 25 gp to create a false identity.'],
          [13, 'Impostor', 'Mimic a person\'s speech, writing and behavior after 3 hours of study.'],
          [17, 'Death Strike', 'Hit a surprised creature: CON save or damage is doubled.']
        ]
      },
      {
        id: 'arcanetrickster', name: 'Arcane Trickster', src: 'PHB', grantedSpells: [{ name: 'Mage Hand', at: 3 }],
        caster: { type: 'third', abil: 'INT', list: 'W', mode: 'known', cantrips: THIRD_CANT, known: THIRD_KNOWN, note: 'Mostly enchantment and illusion; at 3rd, 8th, 14th and 20th you may pick from any school. Mage Hand is granted on top of these cantrips.' },
        features: [
          [3, 'Spellcasting', 'Wizard spells using INT (mostly enchantment/illusion). Know mage hand. Third-caster slots.'],
          [3, 'Mage Hand Legerdemain', 'Invisible mage hand that can stow/retrieve objects, pick locks and disarm traps; control it with Cunning Action.'],
          [9, 'Magical Ambush', 'If hidden when you cast, the target has disadvantage on its save.'],
          [13, 'Versatile Trickster', 'Bonus action: mage hand distracts a creature within 5 ft of it, giving you advantage on attacks.'],
          [17, 'Spell Thief', 'Reaction when a spell targets you: steal it (save) and know it for 8 hours. Once per long rest.']
        ]
      }
    ]
  });

  // ======================= SORCERER =======================
  DB.CLASSES.push({
    id: 'sorcerer', name: 'Sorcerer', src: 'PHB', hd: 6, saves: ['CON', 'CHA'],
    armor: [], weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    skills: { n: 2, from: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Persuasion', 'Religion'] },
    subLevel: 1, subName: 'Sorcerous Origin', asi: ASI,
    caster: { type: 'full', abil: 'CHA', list: 'S', mode: 'known', cantrips: CANT_4_5_6, known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15] },
    cols: { 'Sorcery Points': fill([[2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20]]) },
    choices: [
      { lvl: 3, id: 'meta3', label: 'Metamagic (2)', type: 'list', n: 2, opts: 'metamagic' },
      { lvl: 10, id: 'meta10', label: 'Metamagic (+1)', type: 'list', n: 1, opts: 'metamagic' },
      { lvl: 17, id: 'meta17', label: 'Metamagic (+1)', type: 'list', n: 1, opts: 'metamagic' }
    ],
    features: [
      [1, 'Spellcasting', 'Sorcerer spells use CHA. You know a set number; swap one on level up. Arcane focus.'],
      [1, 'Sorcerous Origin', 'Choose your origin.'],
      [2, 'Font of Magic', 'Sorcery points (= sorcerer level) per long rest. Convert slots to points (points = slot level) or points to slots (1st: 2, 2nd: 3, 3rd: 5, 4th: 6, 5th: 7) as a bonus action.'],
      [3, 'Metamagic', 'Learn two Metamagic options (one more at 10th and 17th). One per spell unless stated.'],
      [20, 'Sorcerous Restoration', 'Regain 4 sorcery points on a short rest.']
    ],
    start: [['Light crossbow + Crossbow bolts (20)', '{simple}'], ['Component pouch', 'Arcane focus'], ["Dungeoneer's pack", "Explorer's pack"], ['Dagger x2']],
    subclasses: [
      {
        id: 'draconic', name: 'Draconic Bloodline', src: 'PHB', languages: ['Draconic'],
        choices: [{ lvl: 1, id: 'ancestor', label: 'Dragon Ancestor', type: 'list', n: 1, opts: 'dragonColor' }],
        features: [
          [1, 'Dragon Ancestor', 'Choose a dragon type. Speak Draconic; double proficiency on CHA checks with dragons.'],
          [1, 'Draconic Resilience', '+1 HP per sorcerer level. Without armor, AC = 13 + DEX.', { hpPerClassLevel: 1, acFormula: { name: 'Draconic Resilience', base: 13, add: ['DEX'], shield: true } }],
          [6, 'Elemental Affinity', 'Add CHA mod to one damage roll of spells matching your ancestry element; 1 SP for resistance to it for 1 hour.'],
          [14, 'Dragon Wings', 'Bonus action: sprout wings, flying speed equal to your speed (not in armor that lacks room).'],
          [18, 'Draconic Presence', '5 SP: 60 ft aura of awe or fear for 1 minute (WIS save).']
        ]
      },
      {
        id: 'wildmagic', name: 'Wild Magic', src: 'PHB', features: [
          [1, 'Wild Magic Surge', 'After casting a 1st+ level sorcerer spell, the DM can have you roll a d20; on a 1, roll on the Wild Magic Surge table.'],
          [1, 'Tides of Chaos', 'Gain advantage on one attack, check or save. Regain after a long rest or when the DM triggers a surge.'],
          [6, 'Bend Luck', 'Reaction: 2 SP to add or subtract 1d4 from another creature\'s attack, check or save.'],
          [14, 'Controlled Chaos', 'Roll twice on the surge table and choose.'],
          [18, 'Spell Bombardment', 'When you roll max on a spell damage die, roll it again and add it (once per turn).']
        ]
      }
    ]
  });

  // ======================= WARLOCK =======================
  DB.CLASSES.push({
    id: 'warlock', name: 'Warlock', src: 'PHB', hd: 8, saves: ['WIS', 'CHA'],
    armor: ['Light armor'], weapons: ['Simple weapons'],
    skills: { n: 2, from: ['Arcana', 'Deception', 'History', 'Intimidation', 'Investigation', 'Nature', 'Religion'] },
    subLevel: 1, subName: 'Otherworldly Patron', asi: ASI,
    caster: { type: 'pact', abil: 'CHA', list: 'K', mode: 'known', cantrips: CANT_2_3_4, known: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15] },
    cols: { 'Invocations Known': fill([[2, 2], [5, 3], [7, 4], [9, 5], [12, 6], [15, 7], [18, 8]]) },
    choices: [
      { lvl: 2, id: 'inv2', label: 'Eldritch Invocations (2)', type: 'list', n: 2, opts: 'invocation' },
      { lvl: 3, id: 'pact', label: 'Pact Boon', type: 'list', n: 1, opts: 'pactBoon' },
      { lvl: 5, id: 'inv5', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' },
      { lvl: 7, id: 'inv7', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' },
      { lvl: 9, id: 'inv9', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' },
      { lvl: 11, id: 'arc6', label: 'Mystic Arcanum (6th-level spell)', type: 'spell', n: 1, spellLvl: 6, list: 'K' },
      { lvl: 12, id: 'inv12', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' },
      { lvl: 13, id: 'arc7', label: 'Mystic Arcanum (7th-level spell)', type: 'spell', n: 1, spellLvl: 7, list: 'K' },
      { lvl: 15, id: 'inv15', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' },
      { lvl: 15, id: 'arc8', label: 'Mystic Arcanum (8th-level spell)', type: 'spell', n: 1, spellLvl: 8, list: 'K' },
      { lvl: 17, id: 'arc9', label: 'Mystic Arcanum (9th-level spell)', type: 'spell', n: 1, spellLvl: 9, list: 'K' },
      { lvl: 18, id: 'inv18', label: 'Eldritch Invocation (+1)', type: 'list', n: 1, opts: 'invocation' }
    ],
    features: [
      [1, 'Otherworldly Patron', 'Choose your patron; it expands your spell list.'],
      [1, 'Pact Magic', 'Warlock spells use CHA. Few slots, all at the same level, regained on a short or long rest. Arcane focus.'],
      [2, 'Eldritch Invocations', 'Learn invocations (count in the table). Swap one on level up.'],
      [3, 'Pact Boon', 'Choose Chain, Blade or Tome.'],
      [11, 'Mystic Arcanum', 'Choose one 6th-level spell, castable once per long rest without a slot. 7th at 13th, 8th at 15th, 9th at 17th.'],
      [20, 'Eldritch Master', 'Spend 1 minute entreating your patron to regain all pact slots. Once per long rest.']
    ],
    start: [['Light crossbow + Crossbow bolts (20)', '{simple}'], ['Component pouch', 'Arcane focus'], ["Scholar's pack", "Dungeoneer's pack"], ['Leather armor + {simple} + Dagger x2']],
    subclasses: [
      {
        id: 'archfey', name: 'The Archfey', src: 'PHB',
        expanded: { 1: ['Faerie Fire', 'Sleep'], 2: ['Calm Emotions', 'Phantasmal Force'], 3: ['Blink', 'Plant Growth'], 4: ['Dominate Beast', 'Greater Invisibility'], 5: ['Dominate Person', 'Seeming'] },
        features: [
          [1, 'Fey Presence', 'Action: creatures in a 10 ft cube make a WIS save or are charmed/frightened until the end of your next turn. Once per short/long rest.'],
          [6, 'Misty Escape', 'Reaction when damaged: turn invisible and teleport 60 ft. Once per short/long rest.'],
          [10, 'Beguiling Defenses', 'Immune to charm; reaction to turn a charm back on the caster.'],
          [14, 'Dark Delirium', 'Action: a creature within 60 ft makes a WIS save or is charmed/frightened in an illusory realm for 1 minute. Once per short/long rest.']
        ]
      },
      {
        id: 'fiend', name: 'The Fiend', src: 'PHB',
        expanded: { 1: ['Burning Hands', 'Command'], 2: ['Blindness/Deafness', 'Scorching Ray'], 3: ['Fireball', 'Stinking Cloud'], 4: ['Fire Shield', 'Wall of Fire'], 5: ['Flame Strike', 'Hallow'] },
        features: [
          [1, "Dark One's Blessing", 'When you drop a hostile creature to 0 HP, gain temp HP = CHA mod + warlock level.'],
          [6, "Dark One's Own Luck", 'Add 1d10 to a check or save. Once per short/long rest.'],
          [10, 'Fiendish Resilience', 'After a rest, choose a damage type to resist (not from magic or silvered weapons).'],
          [14, 'Hurl Through Hell', 'On a hit, banish the target through the lower planes: 10d10 psychic if not a fiend. Once per long rest.']
        ]
      },
      {
        id: 'greatoldone', name: 'The Great Old One', src: 'PHB',
        expanded: { 1: ['Dissonant Whispers', "Tasha's Hideous Laughter"], 2: ['Detect Thoughts', 'Phantasmal Force'], 3: ['Clairvoyance', 'Sending'], 4: ['Dominate Beast', "Evard's Black Tentacles"], 5: ['Dominate Person', 'Telekinesis'] },
        features: [
          [1, 'Awakened Mind', 'Telepathy with any creature within 30 ft that has a language.'],
          [6, 'Entropic Ward', 'Reaction: impose disadvantage on an attack; if it misses, gain advantage on your next attack against it. Once per short/long rest.'],
          [10, 'Thought Shield', 'Your thoughts can\'t be read; resistance to psychic damage and reflect it back.', { resist: ['psychic'] }],
          [14, 'Create Thrall', 'Touch an incapacitated humanoid to charm it indefinitely.']
        ]
      }
    ]
  });

  // ======================= WIZARD =======================
  function school(id, name, feats) { return { id: id, name: name, src: 'PHB', features: feats }; }
  DB.CLASSES.push({
    id: 'wizard', name: 'Wizard', src: 'PHB', hd: 6, saves: ['INT', 'WIS'],
    armor: [], weapons: ['Dagger', 'Dart', 'Sling', 'Quarterstaff', 'Light crossbow'],
    skills: { n: 2, from: ['Arcana', 'History', 'Insight', 'Investigation', 'Medicine', 'Religion'] },
    subLevel: 2, subName: 'Arcane Tradition', asi: ASI,
    caster: { type: 'full', abil: 'INT', list: 'W', mode: 'spellbook', cantrips: CANT_3_4_5 },
    features: [
      [1, 'Spellcasting', 'Wizard spells use INT. Spellbook starts with six 1st-level spells and gains two per level (copy more from scrolls/books). Prepare INT mod + wizard level spells from your spellbook. Rituals from the book.'],
      [1, 'Arcane Recovery', 'Once per day on a short rest, recover slots with total level up to half your wizard level (rounded up), none 6th+.'],
      [2, 'Arcane Tradition', 'Choose your school.'],
      [18, 'Spell Mastery', 'Pick a 1st- and a 2nd-level spell to cast at their lowest level without slots.'],
      [20, 'Signature Spells', 'Two 3rd-level spells always prepared; cast each once at 3rd level per short rest without a slot.']
    ],
    start: [['Quarterstaff', 'Dagger'], ['Component pouch', 'Arcane focus'], ["Scholar's pack", "Explorer's pack"], ['Spellbook']],
    subclasses: [
      school('abjuration', 'School of Abjuration', [[2, 'Abjuration Savant', 'Copy abjuration spells for half gold and time.'], [2, 'Arcane Ward', 'Casting a 1st+ abjuration spell creates a ward with HP = 2 × wizard level + INT mod; it absorbs damage and recharges by 2 × spell level when you cast abjuration.'], [6, 'Projected Ward', 'Reaction: your ward absorbs damage for a creature within 30 ft.'], [10, 'Improved Abjuration', 'Add proficiency to checks made by abjuration spells (e.g. counterspell, dispel magic).'], [14, 'Spell Resistance', 'Advantage on saves vs spells and resistance to spell damage.']]),
      school('conjuration', 'School of Conjuration', [[2, 'Conjuration Savant', 'Copy conjuration spells for half gold and time.'], [2, 'Minor Conjuration', 'Action: conjure a nonmagical object up to 3 ft / 10 lb for 1 hour.'], [6, 'Benign Transposition', 'Action: teleport 30 ft or swap with a willing Small/Medium creature.'], [10, 'Focused Conjuration', 'Damage can\'t break concentration on conjuration spells.'], [14, 'Durable Summons', 'Creatures you summon or create with conjuration gain 30 temp HP.']]),
      school('divination', 'School of Divination', [[2, 'Divination Savant', 'Copy divination spells for half gold and time.'], [2, 'Portent', 'After a long rest roll two d20s; replace any attack, save or check you can see with one. Three at 14th.'], [6, 'Expert Divination', 'Casting a 2nd+ divination spell recovers a lower-level slot (max 5th).'], [10, 'The Third Eye', 'Action: gain darkvision 60 ft, ethereal sight, read any language, or see invisible within 10 ft until rest.'], [14, 'Greater Portent', 'Roll three d20s for Portent.']]),
      school('enchantment', 'School of Enchantment', [[2, 'Enchantment Savant', 'Copy enchantment spells for half gold and time.'], [2, 'Hypnotic Gaze', 'Action: charm a creature within 5 ft (WIS save), incapacitated and speed 0 while you maintain it.'], [6, 'Instinctive Charm', 'Reaction: redirect an attack against you to another creature (WIS save).'], [10, 'Split Enchantment', 'Single-target enchantment spells can target a second creature.'], [14, 'Alter Memories', 'Charmed creatures can be made unaware they were charmed and forget time spent.']]),
      school('evocation', 'School of Evocation', [[2, 'Evocation Savant', 'Copy evocation spells for half gold and time.'], [2, 'Sculpt Spells', 'Protect 1 + spell level creatures from your evocation spells (auto-save, no damage on half).'], [6, 'Potent Cantrip', 'Creatures that save against your cantrips still take half damage.'], [10, 'Empowered Evocation', 'Add INT mod to one damage roll of wizard evocation spells.'], [14, 'Overchannel', 'Max damage on a 5th-or-lower spell; repeat use deals necrotic damage to you.']]),
      school('illusion', 'School of Illusion', [[2, 'Illusion Savant', 'Copy illusion spells for half gold and time.'], [2, 'Improved Minor Illusion', 'Learn minor illusion; it creates both a sound and an image.'], [6, 'Malleable Illusions', 'Action: change an illusion of 1 minute or longer that you are maintaining.'], [10, 'Illusory Self', 'Reaction: an attack against you automatically misses. Once per short rest.'], [14, 'Illusory Reality', 'Bonus action: make one inanimate object in your illusion real for 1 minute.']]),
      school('necromancy', 'School of Necromancy', [[2, 'Necromancy Savant', 'Copy necromancy spells for half gold and time.'], [2, 'Grim Harvest', 'Once per turn, killing with a spell heals you 2 × spell level (3 × for necromancy).'], [6, 'Undead Thralls', 'Animate dead affects an extra corpse; your undead get extra HP (wizard level) and add prof to damage.'], [10, 'Inured to Undeath', 'Resistance to necrotic; HP max can\'t be reduced.', { resist: ['necrotic'] }], [14, 'Command Undead', 'Action: an undead (CHA save) obeys you indefinitely.']]),
      school('transmutation', 'School of Transmutation', [[2, 'Transmutation Savant', 'Copy transmutation spells for half gold and time.'], [2, 'Minor Alchemy', 'Temporarily change an object\'s material (wood, stone, iron, copper, silver).'], [6, "Transmuter's Stone", 'Create a stone that grants darkvision, +10 speed, a save proficiency, or a resistance.'], [10, 'Shapechanger', 'Polymorph yourself into a CR 1 or lower beast without a slot once per short rest.'], [14, 'Master Transmuter', 'Destroy your stone to transmute an object, cure, revive or restore youth.']])
    ]
  });
})(window.DB);
