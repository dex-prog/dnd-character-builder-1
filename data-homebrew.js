// Homebrew content from the KibblesTasty list (kthomebrew.com/thelist). Summarized from the free PDFs.
// Spells that aren't in the PHB are added as stubs (name + level) so they can be shown and tracked.
(function (DB) {
  var KT = 'KibblesTasty';
  function cls(id) { for (var i = 0; i < DB.CLASSES.length; i++) if (DB.CLASSES[i].id === id) return DB.CLASSES[i]; }
  function sub(clsId, o) { o.src = 'HB'; o.srcNote = o.srcNote || KT; cls(clsId).subclasses.push(o); }
  function stub(name, lvl, src, desc, extra) { var o = extra || {}; o.src = src || 'KT'; if (desc) o.desc = desc; return DB.ensureSpell(name, lvl, o); }

  // ---- Non-PHB spells from other official books that the homebrew refers to (short summaries) ----
  stub('Frostbite', 0, 'XGE', 'CON save or 1d6 cold and disadvantage on its next weapon attack. Scales.');
  stub('Create Bonfire', 0, 'XGE', '5 ft bonfire: DEX save or 1d8 fire. Concentration. Scales.', { conc: true });
  stub('Magic Stone', 0, 'XGE', 'Imbue up to three pebbles; spell attack 1d6 + spellcasting mod bludgeoning.');
  stub('Mold Earth', 0, 'XGE', 'Shape, move or loosen earth in a 5 ft cube.');
  stub('Ice Knife', 1, 'XGE', 'Ranged spell attack 1d10 piercing, then 2d6 cold burst (DEX save) within 5 ft.');
  stub('Earth Tremor', 1, 'XGE', '10 ft around you: DEX save or 1d6 bludgeoning and prone; loose ground becomes difficult terrain.');
  stub("Aganazzar's Scorcher", 2, 'XGE', '30 ft line: DEX save, 3d8 fire, half on save.');
  stub('Erupting Earth', 3, 'XGE', '20 ft cube: DEX save, 3d12 bludgeoning; difficult terrain.');
  stub('Tidal Wave', 3, 'XGE', '30 ft line wave: DEX save, 4d8 bludgeoning and prone.');
  stub('Watery Sphere', 4, 'XGE', 'Sphere of water traps creatures (STR save) and can be moved.', { conc: true });
  stub('Sickening Radiance', 4, 'XGE', '30 ft sphere: CON save or 4d10 radiant and exhaustion; emits light.', { conc: true });
  stub('Guardian of Nature', 4, 'XGE', 'Become a Primal Beast or Great Tree for 1 minute.', { conc: true });
  stub('Immolation', 5, 'XGE', 'DEX save, 7d6 fire and burns each turn (concentration).', { conc: true });
  stub('Wrath of Nature', 5, 'XGE', 'Nature attacks creatures in a 60 ft cube (concentration).', { conc: true });

  // =================== SUBCLASSES (2 per PHB class) ===================
  sub('barbarian', {
    id: 'kt_instinct', name: 'Path of Instinct (KT)',
    choices: [{ lvl: 3, id: 'variant', label: 'Optional variant features (DM permission)', type: 'list', n: 2, optional: true, opts: [
      { id: 'monkud', name: 'Unarmored Defense (Monk)', text: 'Replaces barbarian Unarmored Defense: AC = 10 + DEX + WIS with no armor or shield.', fx: { acFormula: { name: 'Unarmored Defense (Instinct variant)', base: 10, add: ['DEX', 'WIS'], shield: false } } },
      { id: 'unarmed', name: 'Unarmed Fighting', text: 'Replaces martial weapon proficiency: unarmed strikes 1d6 + STR (d8 with no weapon or shield); 1d4 to a grappled creature each turn.' }
    ] }],
    features: [
      [3, 'Focused Rage', 'On entering a rage gain d8 focus dice equal to your proficiency bonus. Spend one for: Perfect Dodge (add to DEX save/check), Perfect Intuition (add to WIS save/check; Search as bonus action), Perfect Parry (reaction: reduce weapon damage by die + STR or DEX), Perfect Strike (add to attack roll), Perfect Focus (keep rage until next turn).'],
      [3, 'Instinctive Insight', 'Proficiency in Insight, or expertise if already proficient.', { skills: ['Insight'] }],
      [6, 'Blind Fighting', 'While raging, blindsight 10 ft (20 ft at 10th, 30 ft at 14th).'],
      [10, 'Evasion', 'DEX saves for half: no damage on success, half on failure.'],
      [14, 'Instinctive Strike', 'Reaction, 1 focus die: when a creature ends its turn in your blindsight, move up to your speed toward it (no opportunity attacks) and make one weapon attack.']
    ]
  });
  sub('barbarian', {
    id: 'kt_dragon', name: 'Path of the Dragon (KT)',
    choices: [{ lvl: 3, id: 'color', label: 'Dragon color', type: 'list', n: 1, opts: 'chromaticColor' }],
    features: [
      [3, 'Draconic Wrath', 'Rage damage can become your color\'s element (+1 rage damage if you also skip natural weapons). While raging you may grow claws (1d4 slashing), fangs (1d8 piercing) or a tail (1d6 bludgeoning, reach); with no weapon or shield, bonus action claw strike after attacking with a natural weapon. Resistance to your element while raging.'],
      [6, 'Unleashed Savagery', 'Once per rage, replace an attack with a breath weapon: DEX save, DC 8 + prof + STR. 6d6 in a 15 ft cone (8d6/30 ft at 10th, 10d6/60 ft at 14th; twice per rage at 18th).'],
      [6, 'Primal Weapons', 'Natural weapons count as magical.'],
      [10, 'Dragonhide', 'Resistance to nonmagical bludgeoning, piercing and slashing, and to your element, even when not raging.', { resist: ['nonmagical B/P/S'] }],
      [14, 'Tyrant of the Skies', 'When you rage, grow wings: fly speed equal to your speed (no heavy armor). With natural weapons and wings, you can become a Large dragon while raging.']
    ]
  });

  sub('bard', {
    id: 'kt_fools', name: 'College of Fools (KT)', features: [
      [3, "Jester's Juggling", 'Proficiency in Performance (or another skill if you have it). Draw/stow any number of items on your turn and hold more than you have hands, with a DEX (Performance) check DC 5 per extra hand at the end of your turn.', { skills: ['Performance'] }],
      [3, "Fool's Fumble", 'When you fail a check or attack roll, spend a Bardic Inspiration to reroll and add the die.'],
      [6, 'Acrobatic Antics', 'Proficiency in Acrobatics (or another skill). Climb speed 20 ft; no damage from falls of 20 ft or less; advantage to avoid falling. Bonus action Leap and Tumble: move 10 ft ignoring difficult terrain, opportunity attacks and creatures\' spaces.', { skills: ['Acrobatics'] }],
      [6, 'Fatal Flourish', 'When you use your action for an ability check, vicious mockery, or a light melee weapon attack, make a melee weapon or dart attack as a bonus action.'],
      [14, 'Energetic Encore', 'Reaction: attack a target that another creature crits within 30 ft; or Help an ally when you crit or a creature fails your spell save by 5+. Spend Bardic Inspiration to use either without the trigger being a crit.']
    ]
  });
  sub('bard', {
    id: 'kt_myth', name: 'College of Myth (KT)', features: [
      [3, 'Careful Historian', 'Proficiency in History (or another skill) and double proficiency on History checks.', { skills: ['History'], expertise: ['History'] }],
      [3, 'Mythic Tales', 'When you give Bardic Inspiration, you can attach a prepared tale; the creature spends the die as a bonus action for the tale\'s 1-minute benefit. Prepare two of six tales per long rest (each usable once): Clever Fool, Indomitable Warrior, Cursed King, Peerless Huntress, Savage Beast, Pious Lord.'],
      [6, 'Teller of Tales', 'When an ally within 30 ft calls on a tale, gain temp HP = bard level and recover a slot of level ≤ your proficiency bonus.'],
      [14, 'Mythic Might', 'Prepare three tales. Calling a tale forces chosen creatures within 15 ft to make a WIS save or be charmed/frightened of the ally; allies near a tale-bearer get advantage on their first attack.']
    ]
  });

  // Cleric
  ['Create Pit', 1, 'Shadow Bind', 1, 'Crushing Singularity', 3, 'Hungering Void', 3, 'Spatial Swap', 4].forEach(function (v, i, a) { if (i % 2 === 0) stub(v, a[i + 1]); });
  sub('cleric', {
    id: 'kt_void', name: 'Void Domain (KT)',
    spells: { 1: ['Create Pit', 'Shadow Bind'], 3: ['Misty Step', 'Silence'], 5: ['Crushing Singularity', 'Hungering Void'], 7: ['Dimension Door', 'Spatial Swap'], 9: ['Passwall', 'Teleportation Circle'] },
    features: [
      [1, 'Void Step', 'Bonus action: teleport up to 5 × cleric level ft to a space you can see (blocked by things in the path). WIS mod uses (min 1) per long rest.'],
      [1, 'Void Storage', 'Action: store one Large or smaller object in the void; action to retrieve it within 5 ft.'],
      [2, 'Channel Divinity: Void Capture', 'Action: Large or smaller creature/object within 60 ft makes a DEX save or is pulled into the void for 1 minute (incapacitated; CHA save each turn to return).'],
      [6, 'Void Negation', 'Reaction: a ranged attack against a creature within 30 ft automatically misses. Once per short/long rest.'],
      [6, 'Unimpeded Steps', 'Void Step is no longer blocked by creatures or objects.'],
      [8, 'Potent Spellcasting', 'Add WIS mod to cleric cantrip damage.'],
      [17, 'Void Obliteration', 'Always have blackhole prepared; cast it once per long rest without a slot (5 ft radius, 60 ft pull).'],
      [17, 'Unlocked Steps', 'Void Step no longer needs sight of the destination (4d6 force and fails if occupied).']
    ]
  });
  stub('Touch of Filth', 2, 'KT', 'Melee spell attack: 1d6 poison and poisoned (CON save ends). Concentration; repeat attack as an action. +1d6/slot.', { conc: true });
  stub('Poison Puff', 4, 'KT', '30 ft cone: CON save, 4d12 poison and poisoned; half on save. Lightly obscured; 2d4 to those ending turns in it.');
  stub('Inflict Disease', 5, 'KT', 'Touch: on a hit, inflict a disease of your choice (three failed CON saves make it last 7 days).');
  sub('cleric', {
    id: 'kt_plague', name: 'Plague Domain (KT)',
    spells: { 1: ['Bane', 'Ray of Sickness'], 3: ['Ray of Enfeeblement', 'Touch of Filth'], 5: ['Bestow Curse', 'Stinking Cloud'], 7: ['Poison Puff', 'Sickening Radiance'], 9: ['Inflict Disease', 'Cloudkill'] },
    features: [
      [1, 'Miraculous Healer', 'Medicine proficiency; advantage on Medicine checks to diagnose disease; no ill effects from nonmagical disease. 1-minute prayer to transfer a nonmagical disease to another creature.', { skills: ['Medicine'] }],
      [1, 'Awful Transmutation', 'Bonus action when casting a poison damage spell: make it necrotic instead.'],
      [2, 'Channel Divinity: Vile Contagion', 'Reaction: when a creature within 60 ft gets a disease or is poisoned, another creature within 60 ft makes a WIS save or gets the same affliction.'],
      [6, 'Plaguebearer', 'Resistance to poison. Reaction when hit in melee: attacker makes a CON save or the damage is halved and it gets a disease (Bonewrack Fever, Muddlemind or Crowpox). WIS mod uses per long rest.', { resist: ['poison'] }],
      [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 poison or necrotic (2d8 at 14th).'],
      [8, 'Improved Awful Transmutation', 'Awful Transmutation no longer needs a bonus action.'],
      [17, 'Malignant Aura', 'Bonus action: creatures within 15 ft make a CON save or are poisoned until the end of their next turn. Immune to poison and necrotic damage and the poisoned condition.']
    ]
  });

  // Druid
  var ELEM = {
    0: ['Create Bonfire', 'Fire Bolt', 'Frostbite', 'Ray of Frost', 'Shocking Grasp', 'Produce Flame', 'Magic Stone'],
    1: ['Arctic Breath', 'Burning Hands', 'Create Pit', 'Crashing Wave', 'Entomb', 'Earth Tremor', 'Gale Bolt', 'Ice Knife', 'Lightning Tendril', 'Stone Fist', 'Water Blast'],
    2: ["Aganazzar's Scorcher", 'Cold Snap', 'Crackle', 'Dancing Wave', 'Dust Cyclone', 'Earth Ripple', 'Flaming Sphere', 'Hurricane Slash', 'Lightning Charged', 'Become Fire', 'Become Stone', 'Become Water', 'Become Wind', 'Scorching Ray'],
    3: ['Call Lightning', 'Electrocute', 'Erupting Earth', 'Fireball', 'Fire Cyclone', 'Flash Freeze', 'Lightning Bolt', 'Tidal Wave', 'Quicksand', 'Vortex Blast'],
    4: ['Aero Barrage', 'Geyser', 'Fire Shield', 'Jumping Jolt', 'Ice Spike', 'Ice Storm', 'Orbital Stones', 'Stone Coffin', 'Suffocate', 'Wall of Fire', 'Watery Sphere'],
    5: ['Cone of Cold', 'Fissure', 'Immolation', 'Sky Burst', 'Tornado', 'Pressure Cutter']
  };
  Object.keys(ELEM).forEach(function (l) { ELEM[l].forEach(function (n) { stub(n, +l); }); });
  sub('druid', {
    id: 'kt_elements', name: 'Circle of Elements (KT)', expanded: ELEM, prepBonus: { 2: 1, 3: 1, 5: 1, 7: 1, 9: 1 },
    features: [
      [2, 'Invoke Element', 'Alternate Wild Shape use. Bonus action: manifest an element at a point within 60 ft for 1 minute. Air: DEX save or 1d6 + WIS lightning (bonus action again later). Earth: stone pillar (AC 16, HP WIS mod + druid level, three-quarters cover). Fire: 5 ft blaze, 1d4 fire at turn start. Water: 5 ft sleet, difficult terrain. Bonus action to move it 20 ft or grow blaze/sleet radius 5 ft (up to prof times).'],
      [2, 'Elemental Spells', 'Choose druid spells from the expanded elemental list too; prepared spells +1 at 2nd, 3rd, 5th, 7th and 9th.'],
      [6, 'Primal Sculpting', 'When Invoke Element or a druid spell deals bludgeoning, cold, fire or lightning, up to prof-bonus creatures auto-succeed and take no damage.'],
      [10, 'Paraelemental Manifestations', 'Spend 2 Wild Shape uses to invoke two elements together for a combined effect (dust, smoke, fog, magma, mud or steam).'],
      [10, 'Empowered Manifestations', 'Coalesced Lightning becomes 2d8 + WIS; Fiery Blaze becomes 2d4.'],
      [14, 'Elemental Adaptation', 'After a rest, resistance to cold, fire or lightning until your next rest, plus sight through related obscurement.']
    ]
  });
  stub('Bramble Binding', 1, 'KT', 'DEX save or 4d4 piercing and entangled (can\'t move); half on save. +1d4/slot.');
  stub('Sprout Tree', 2, 'KT', 'Grow a 20 ft tree in a 5 ft square within 30 ft; a creature there may be lifted into its branches (DEX save).');
  sub('druid', {
    id: 'kt_growth', name: 'Circle of Growth (KT)',
    spells: { 2: ['Bramble Binding', 'Entangle'], 3: ['Barkskin', 'Sprout Tree'], 5: ['Plant Growth', 'Speak with Plants'], 7: ['Grasping Vine', 'Guardian of Nature'], 9: ['Tree Stride', 'Wrath of Nature'] },
    features: [
      [2, 'Sprout Sapling', 'Bonus action, 1 Wild Shape use: summon a friendly Sapling within 30 ft for 10 minutes. It acts after you (Dodge unless you command it with a bonus action); your spells can originate from it. Sapling: Medium plant, AC 12 + PB, HP 10 + 5 × druid level, speed 0, resists bludgeoning; Slam (reach 10 ft, 1d8 + PB) or Lashing Vines (reach 30 ft, 1d4 + PB, pull 15 ft on failed STR save); difficult terrain around it for enemies; half cover to adjacent allies.'],
      [6, 'Verdant Power', 'While the Sapling is out and you spend a 1st+ slot: it makes extra attacks (slot ÷ 2), or allies near it gain 2 × slot level temp HP, or it moves 5 + 5 × slot level ft leaving difficult terrain.'],
      [10, 'Entangling Roots', 'Creatures ending their turn in the Sapling\'s roots make a DEX save or are grappled by it.'],
      [10, 'Grasp of Nature', 'Creatures grappled or restrained by you, your spells, their creations or the Sapling take WIS mod damage at the start of their turns.'],
      [14, 'Nourishing Magic', 'Verdant Power also heals the Sapling 1d10 per slot level and can grow it one size (max Huge, +5 ft reach per size).']
    ]
  });

  // Fighter
  stub('Revive Beast', 3, 'KT', 'Touch a beast that died within 1 minute; it returns with half HP (25 gp gems).');
  sub('fighter', {
    id: 'kt_houndmaster', name: 'Houndmaster (KT)',
    cols: { 'War Hounds': DB.fill([[3, 1], [7, 2], [10, 3]]), 'Commanded Attack': DB.fill([[3, '1 + WIS mod']]) },
    grantedSpells: [{ name: 'Revive Beast', at: 3, note: '1/long rest (WIS)' }],
    features: [
      [3, 'Friend to Beasts', 'Proficiency in Animal Handling (or another skill) with double proficiency. Cast revive beast once per long rest (WIS).', { skills: ['Animal Handling'], expertise: ['Animal Handling'] }],
      [3, 'Leader of the Pack', 'Gain War Hounds (1, 2 at 7th, 3 at 10th) that act after you and Dodge unless commanded. Replace attacks in your Attack action to command a hound (each once per turn). Spend your Hit Dice to heal them. War Hound: Small beast, AC 11 + PB, HP 5 + 3 × fighter level, speed 35, Bite +3 + PB to hit, 1d6 + 3 + PB piercing, advantage when a packmate or you are adjacent to the target.'],
      [3, 'Commanded Attack', 'After you hit, bonus action: a hound within 5 ft of the target attacks. 1 + WIS mod uses per long rest.'],
      [7, 'Sniffing Trouble', 'Hounds add your WIS mod to Perception and Survival.'],
      [7, 'Dogs of War', 'Hounds gain Evasion, magical bites, and add your WIS mod to attack and damage.'],
      [10, 'Masterful Hounds', 'Each hound gains Crippling Fangs, Overpowering Jaws or Savage Rush.'],
      [15, 'Unleash the Pack', 'Commanded Attack can command all hounds at once.'],
      [18, 'Pack Savagery', 'When a hound damages a target, your next attack on it deals +1d4 (stacks to 3).']
    ]
  });
  sub('fighter', {
    id: 'kt_crusader', name: 'Crusader (KT)', srcNote: 'KibblesTasty (GM Binder)',
    caster: { type: 'third', abil: 'WIS', list: 'C', mode: 'known', cantrips: DB.THIRD_CANT, known: DB.THIRD_KNOWN, note: 'Uses the standard third-caster table (like Eldritch Knight); the source table was unclear.' },
    features: [
      [3, 'Spellcasting', 'Cleric spells using WIS; third-caster slots. Two cleric cantrips (three at 10th). Swap one known spell on level up.'],
      [3, 'Devout Doctrine', 'Proficiency in Religion (or another skill); holy symbol as focus.', { skills: ['Religion'] }],
      [7, 'Fervent Zeal', 'When you cast a spell that targets yourself, make one weapon attack as a bonus action.'],
      [10, 'Strength of Faith', 'Add half your STR or DEX mod (rounded down) to your cleric spell DC and attack bonus.'],
      [15, 'Purifying Powers', 'While concentrating on a cleric spell, advantage on saves against spells.'],
      [18, 'Unbreakable Conviction', 'Damage can\'t break concentration on a cleric spell that affects you.']
    ]
  });

  // Monk
  sub('monk', {
    id: 'kt_demon', name: 'Way of the Demon (KT)', features: [
      [3, 'Demonic Techniques', 'Action: Demon Burst (creatures within 5 ft DEX save or necrotic = Martial Arts die), Demon Punch (unarmed strike becomes necrotic, knock back 5 ft per damage die), or Demon Flare (30 ft ranged attack, fire = unarmed strike). 1 ki: add a Martial Arts die.'],
      [5, 'Quick or Charged Techniques', 'Use a technique as part of the Attack action, or spend your action to charge it (+2 Martial Arts dice, +3 if empowered).'],
      [6, 'Abyssal Passage', 'With Step of the Wind, take shadow form until turn end or you attack: resistance to all damage, fly at half speed, pass through creatures (they DEX save or take a Martial Arts die).'],
      [11, 'Asura Unleashed', '2 ki (on initiative or bonus action): four extra arms for 1 minute; Flurry of Blows costs no ki and doesn\'t need the Attack action.'],
      [17, 'Ultimate Rage', 'Action: strike through a shadow at a creature within 20 ft; on hit, 4 ki to teleport adjacent and make three unarmed strikes with advantage (all hit: prone and dazed). Two more strikes if you are bloodied.']
    ]
  });
  sub('monk', {
    id: 'kt_predation', name: 'Way of Predation (KT)',
    choices: [
      { lvl: 3, id: 'bhskill', label: 'Blood Hunt: proficiency', type: 'skill', n: 1, from: ['Athletics', 'Acrobatics', 'Survival'] },
      { lvl: 3, id: 'bhexp', label: 'Blood Hunt: expertise (one of those three you know)', type: 'expertise', n: 1, from: ['Athletics', 'Acrobatics', 'Survival'] }
    ],
    features: [
      [3, 'Blood Hunt', 'Darkvision 60 ft (or +30 ft); proficiency in Athletics, Acrobatics or Survival; expertise in one of them.', { darkvisionPlus: 60 }],
      [3, 'Bloodthirsty Strike', 'When your unarmed strike damages a CR 1/4+ creature, 1 ki: gain temp HP = damage (or heal it if below half HP).'],
      [3, 'Life Leech', 'Reaction when a creature within 5 ft dies: regain 1 ki. Prof-bonus uses per long rest (not constructs/undead).'],
      [6, 'Monstrous Might', 'After Bloodthirsty Strike: advantage on Athletics vs it, max damage die on next unarmed hit, or free Step of the Wind.'],
      [11, 'Sapping Spirits', 'Replace an attack: up to WIS mod creatures within 20 ft take 3 Martial Arts dice necrotic (DEX half); 1 ki each to leech temp HP. 1 free use per long rest, then 3 ki.'],
      [17, 'Unrivaled Predator', 'After Bloodthirsty Strike or Sapping Spirits, 1 minute: regain 1 ki on your first damage each turn, immune to frightened/restrained/grappled, frighten enemies you damage (WIS save). 1 free use per long rest, then 8 ki.']
    ]
  });

  // Paladin
  sub('paladin', {
    id: 'kt_silence', name: 'Oath of Silence (KT)', tenets: 'Temperance, Precision, Sanctuary, Purpose, Sacred',
    spells: { 3: ['Sanctuary', 'Sleep'], 5: ['Blindness/Deafness', 'Silence'], 9: ['Counterspell', 'Dispel Magic'], 13: ['Aura of Purity', 'Banishment'], 17: ['Hallow', 'Mislead'] },
    features: [
      [3, 'Channel Divinity: Shroud of Silence', 'Bonus action: a creature makes no noise and can\'t speak (no verbal components) for 10 minutes; advantage on Stealth. Unwilling targets get WIS saves.'],
      [3, 'Channel Divinity: Sanctuary of the Sacrosanct', 'Action: chosen creatures within 30 ft gain temp HP = paladin level + CHA mod and immediately repeat saves against ongoing effects.'],
      [7, 'Aura of Serenity', '10 ft aura dampens sound; you and allies resist thunder; medium/heavy armor doesn\'t impose Stealth disadvantage in it.', { resist: ['thunder'] }],
      [15, 'Rebuke', 'Reaction when a creature in your aura speaks, attacks or casts: CHA mod radiant and WIS save or the attempt fails and it\'s silenced until its next turn.'],
      [18, 'Expanded Aura', 'Aura range increases to 30 ft.'],
      [20, 'Ordered World', 'Action, 1 minute: aura doubles; Rebuke without your reaction CHA mod times per round; chosen creatures get advantage on saves vs charm, fear and spells.'],
      [3, 'Optional: Vow of Silence', 'Optional. One-way telepathy 60 ft; verbal components become somatic. Speaking breaks the vow.']
    ]
  });
  ['Minor Drain', 1, 'Unholy Wave', 2, 'Summon Grave Spirit', 3, 'Reanimating Smite', 4, 'Corpse Puppets', 5, 'Necromantic Storm', 5, 'Frighten', 1, 'False Death', 3].forEach(function (v, i, a) { if (i % 2 === 0) stub(v, a[i + 1]); });
  sub('paladin', {
    id: 'kt_restlessness', name: 'Oath of Restlessness (KT)', tenets: 'Necromancy is a necessary power; the living\'s needs outweigh the dead\'s; an ignored corpse is a wasted tool',
    spells: { 3: ['False Life', 'Minor Drain'], 5: ['Ray of Enfeeblement', 'Unholy Wave'], 9: ['Animate Dead', 'Summon Grave Spirit'], 13: ['Death Ward', 'Reanimating Smite'], 17: ['Corpse Puppets', 'Necromantic Storm'] },
    choices: [{ lvl: 1, id: 'optional', label: 'Optional replacement features (DM permission)', type: 'list', n: 3, optional: true, opts: [
      { id: 'profane', name: 'Profane Touch (replaces Lay on Hands)', text: 'Pool of 5 × paladin level necrotic points; action touch grants temp HP (max 5 × PB per creature), or heals undead.' },
      { id: 'deathly', name: 'Deathly Smite (replaces Divine Smite)', text: 'Extra necrotic: 2d6 + 1d6 per slot above 1st (max 5d6), +1d6 vs celestials and humanoids.' },
      { id: 'impdeathly', name: 'Improved Deathly Smite (replaces Improved Divine Smite)', text: 'Every melee weapon hit deals +1d8 necrotic.' }
    ] }],
    features: [
      [3, 'Channel Divinity: Gravecalled Grasp', 'Action: chosen creatures within 30 ft make a STR save or have speed 0 and can\'t regain HP (save each turn).'],
      [3, 'Channel Divinity: Unhallowed Ground', '1 minute: desecrate a 30 ft radius for 1 hour; undead entering it make a WIS save or treat your party as friendly.'],
      [7, 'Aura of Undeath', '10 ft aura (30 ft at 18th): allies resist necrotic; hostiles take CHA mod necrotic when they start in or enter it; your undead get advantage on saves.'],
      [15, 'Armor of Bones', 'Creatures given temp HP by Profane Touch get a bone shell: AC at least 15, melee attackers take CHA mod necrotic.'],
      [20, 'Avatar of Undeath', 'Action, 1 minute: resistance to all damage while undead are in your aura; your necrotic damage is maximized; creatures that die in the aura rise as your zombies.']
    ]
  });

  // Ranger
  sub('ranger', {
    id: 'kt_abyssal', name: 'Abyssal Roamer (KT)',
    spells: { 3: ['Protection from Evil and Good'], 5: ["Aganazzar's Scorcher"], 9: ['Fear'], 13: ['Banishment'], 17: ['Dispel Evil and Good'] },
    choices: [
      { lvl: 3, id: 'skill', label: 'Planar Patroller: skill', type: 'skill', n: 1, from: ['Nature', 'Arcana', 'History', 'Religion'] },
      { lvl: 3, id: 'essence', label: 'Companion: Fiendish Essence', type: 'list', n: 1, opts: [{ id: 'acid', name: 'Acid' }, { id: 'cold', name: 'Cold' }, { id: 'fire', name: 'Fire' }, { id: 'lightning', name: 'Lightning' }] },
      { lvl: 3, id: 'trait1', label: 'Companion trait', type: 'list', n: 1, opts: [{ id: 'ambush', name: 'Ambush Attacker' }, { id: 'brutal', name: 'Brutal Charge' }, { id: 'agility', name: 'Unnatural Agility' }] },
      { lvl: 3, id: 'trait2', label: 'Companion ability', type: 'list', n: 1, opts: [{ id: 'breath', name: 'Breath Weapon' }, { id: 'aura', name: 'Hellish Aura' }, { id: 'teleport', name: 'Fiendish Teleport' }] }
    ],
    features: [
      [3, 'Planar Patroller', 'One skill from Nature, Arcana, History, Religion; the lower planes count as favored terrain; add WIS mod to INT checks about fiends and lower planes.'],
      [3, 'Infernal Companion', 'Gain a Fiendish Beast that acts after you (Dodge unless you command it with a bonus action). Medium/Small fiend, AC 12 + PB, HP 5 + 5 × ranger level, speed 35, Strike +3 + PB to hit, 1d6 + PB. Resists poison and its essence. Revive with a 1-hour ritual.'],
      [7, 'Bonded Sacrifice', 'Resistance to your companion\'s essence type. Reaction when either of you takes damage: swap places (up to 60 ft) and both gain resistance to all damage until your next turn. Once per short rest.'],
      [7, 'Fiendish Strikes', 'Companion attacks count as magical.'],
      [11, 'Abyssal Ally', 'Companion actions deal one extra damage die; when it damages a creature you get advantage on your next attack against it.'],
      [15, 'Planar Sanctum', 'Companion can plane shift itself and one other creature to its home plane (6d6 elemental damage each round there).']
    ]
  });
  sub('ranger', {
    id: 'kt_gravekeeper', name: 'Gravekeeper (KT)', srcNote: 'KibblesTasty / Spectre Creations',
    spells: { 3: ['Detect Evil and Good'], 5: ['Gentle Repose'], 9: ['Speak with Dead'], 13: ['Death Ward'], 17: ['Reincarnate'] },
    features: [
      [3, 'Grim Undertaking', 'Medicine proficiency; double proficiency to determine cause of death or what made something undead.', { skills: ['Medicine'] }],
      [3, 'Reap and Sow', 'Mark a creature you damage or that attacks/damages you (one at a time). Your next hit on it deals +1d6 force (1d10 vs undead), once per turn. 1d8/1d12 at 11th.'],
      [7, "Death's Door", 'Immune to disease and being raised as undead; add prof to death saves. Reaction: an ally within 60 ft dropping to 0 HP gains temp HP = ranger level + WIS mod and advantage on death saves.'],
      [11, 'Cradle to the Grave', 'Crit on 19–20 against creatures below max HP (18–20 vs undead).'],
      [15, 'Unending Nightwatch', 'Can\'t be surprised; reaction to turn a crit against you into a normal hit; death ward on yourself after each long rest.']
    ]
  });

  // Rogue
  DB.OPTS.ninjaTrick = [
    { id: 'plainsight', name: 'Hide In Plain Sight', text: 'Cunning Action: minor illusion on your own space; ends if you attack, cast or move.' },
    { id: 'infiltration', name: 'Infiltration Training', text: 'Climb walls/ceilings without handholds; hold breath 5× as long.' },
    { id: 'shroud', name: 'Shadow Shroud', text: 'In black clothing, hide in dim light or darkness without heavy obscurement.' },
    { id: 'shuriken', name: 'Shuriken Volley', text: 'Throw up to three light thrown weapons at different targets; Sneak Attack at half damage on each eligible target.' },
    { id: 'smoke', name: 'Smoke Bomb', text: 'Action: 5 ft radius heavily obscuring smoke until the start of your next turn.' }
  ];
  sub('rogue', {
    id: 'kt_shinobi', name: 'Shinobi (KT)',
    choices: [
      { lvl: 3, id: 'tricks3', label: 'Ninja Tricks (2)', type: 'list', n: 2, opts: 'ninjaTrick' },
      { lvl: 3, id: 'tool', label: 'Ninja Tools', type: 'tool', n: 1, from: ['Disguise kit', "Poisoner's kit", "Alchemist's supplies", "Tinker's tools"] },
      { lvl: 6, id: 'tricks6', label: 'Ninja Trick (+1)', type: 'list', n: 1, opts: 'ninjaTrick' },
      { lvl: 9, id: 'tricks9', label: 'Ninja Trick (+1)', type: 'list', n: 1, opts: 'ninjaTrick' },
      { lvl: 12, id: 'tricks12', label: 'Ninja Trick (+1)', type: 'list', n: 1, opts: 'ninjaTrick' }
    ],
    features: [
      [3, 'Ninja Tricks', 'Learn two tricks (more at 6th, 9th, 12th).'],
      [3, 'Ninja Tools', 'Proficiency with one of: disguise kit, poisoner\'s kit, alchemist\'s supplies, tinker\'s tools.'],
      [5, 'Shadow Decoy (optional)', 'With Uncanny Dodge, instead teleport 30 ft and leave a decoy that takes the attack. Once per short/long rest. (Optional 5e++ feature.)'],
      [9, 'Ninja Run', 'Run up walls and across liquids during your move; Dash doubles jump distance and ignores difficult terrain.'],
      [13, 'Shadow Counter', 'After Shadow Decoy, make one melee or thrown attack with advantage against the attacker. One extra Shadow Decoy use per rest.'],
      [17, 'Cloning Technique', 'Cunning Action: create a shadow clone for 1 minute (ends if hit or 60 ft away). Control it with Cunning Action; it can take any action you could and count for Sneak Attack once per turn.']
    ]
  });
  sub('rogue', {
    id: 'kt_firestarter', name: 'Firestarter (KT)',
    dc: { label: 'Pyrotechnics DC', abil: 'INT' },
    choices: [{ lvl: 3, id: 'tool', label: 'Alchemical Dabbler tool', type: 'tool', n: 1, from: ["Alchemist's supplies", "Tinker's tools"] }],
    features: [
      [3, 'Alchemical Dabbler', 'Alchemist\'s supplies or tinker\'s tools; double proficiency to make or identify explosives and oils.'],
      [3, 'Pyrotechnics', 'DC = 8 + prof + INT mod. Flaming Grease (bonus action: coat a weapon/ammo for 10 min; damaged creatures become greased and ignite on fire damage for 1d6/turn; you can Sneak Attack burning targets). Grease Spray (action: INT mod 5 ft spaces within 30 ft, DEX save). Spark Shower (bonus action: 15 ft cone ignites grease).'],
      [9, 'Firebombs', 'Action: throw at a point within 30 ft; 10 ft radius DEX save, fire = one Sneak Attack roll (half on save), failures greased and burning. One bomb per short/long rest (hold one at a time). Can be set as a trap.'],
      [9, 'High Heat', 'Burning grease deals 2d6.'],
      [13, 'Nimble Escape', 'Reduce fire damage by your prof bonus; after a DEX save with Evasion, move half speed.'],
      [17, 'Master Bomber', 'Make INT mod firebombs; radius 15 ft.'],
      [17, 'Inferno', 'Burning grease deals 3d6.']
    ]
  });

  // Sorcerer
  stub('Arcane Conduit', 2, 'KT', 'Concentration: resist non-force magic damage but vulnerable to force; you and creatures within 5 ft take growing force damage each turn.', { conc: true });
  stub('Star Dust', 2, 'KT', '30 ft cone: 3d4 force; next attack against each has advantage.');
  stub('Aether Lance', 3, 'KT', '30 ft by 5 ft line: 8d4 force. +1d4/slot.');
  stub('Force Blade', 4, 'KT', 'Bonus action: blade of force (concentration); action to sweep it through a creature for 2d12 force.', { conc: true });
  stub('Aether Storm', 5, 'KT', '10 ft radius storm (concentration): 8d4 force on creation and to those ending turns inside; move it 10 ft as a bonus action.', { conc: true });
  stub('Forcebolt', 0, 'KT', 'Ranged spell attack, 120 ft, 2d4 force. Scales.');
  sub('sorcerer', {
    id: 'kt_aetherheart', name: 'Aether Heart Origin (KT)',
    choices: [
      { lvl: 1, id: 'fm1', label: 'Force Magic (1st)', type: 'spell', n: 1, fixed: ['Mage Armor', 'Magic Missile'] },
      { lvl: 3, id: 'fm3', label: 'Force Magic (3rd)', type: 'spell', n: 1, fixed: ['Arcane Conduit', 'Star Dust'] },
      { lvl: 5, id: 'fm5', label: 'Force Magic (5th)', type: 'spell', n: 1, fixed: ['Aether Lance', 'Dispel Magic'] },
      { lvl: 7, id: 'fm7', label: 'Force Magic (7th)', type: 'spell', n: 1, fixed: ['Dimension Door', 'Force Blade'] },
      { lvl: 9, id: 'fm9', label: 'Force Magic (9th)', type: 'spell', n: 1, fixed: ['Aether Storm', 'Wall of Force'] }
    ],
    grantedSpells: [{ name: 'Dispel Magic', at: 14, note: 'Arcane Fuel' }],
    features: [
      [1, 'Force Magic', 'At 1st, 3rd, 5th, 7th and 9th, learn one of two listed spells (doesn\'t count against spells known).'],
      [1, 'Aetherborn', 'Resistance to force damage; you are your own arcane focus.', { resist: ['force'] }],
      [3, 'Empowered Spell', 'Gain the Empowered Spell metamagic; use it free prof-bonus times per long rest.'],
      [6, 'Overcharged Metamagic', 'When you use metamagic on a damage spell, add CHA mod to one damage roll.'],
      [14, 'Arcane Fuel', 'Immune to force; heal half the force damage you would take (up to sorcerer level per rest). Learn dispel magic; successful dispel/counterspell restores 1 sorcery point.'],
      [18, 'Tap Power', 'Bonus action: spend a Hit Die to regain sorcery points = roll + CHA mod. Once per short/long rest.']
    ]
  });
  sub('sorcerer', {
    id: 'kt_ghost', name: 'Ghost-Touched (KT)',
    spells: { 1: ['Frighten', 'False Life'], 3: ['Gentle Repose', 'Invisibility'], 5: ['False Death', 'Summon Grave Spirit'], 7: ['Death Ward', 'Phantasmal Killer'], 9: ['Antilife Shell', 'Necromantic Storm'] },
    grantedSpells: [{ name: 'Spare the Dying', at: 1 }],
    features: [
      [1, 'On the Boundary', 'Learn spare the dying (bonus cantrip). Use CHA for Medicine checks on cause of death (advantage after a 1-minute ritual).'],
      [1, 'Sorcerous Possession', 'When you cast a 1st+ level spell, a creature within 30 ft delivers it with its reaction (unwilling: CHA save). Once per long rest; more uses cost sorcery points = spell level.'],
      [6, 'Fade Away', 'Reaction before taking damage, 2 SP (+1 each extra use): become ethereal until the end of your next turn — move through things, resist nonmagical B/P/S.'],
      [6, "Death's Face", 'Immune to frightened and possession.'],
      [14, 'Thinning the Boundary', 'Reaction, 4 SP: a creature within 30 ft about to make a death save rolls a 20 and gains temp HP = sorcerer level.'],
      [18, 'Ethereal Essence', 'Fade Away costs 1 SP flat; immune to nonmagical B/P/S while ethereal.']
    ]
  });

  // Warlock
  sub('warlock', {
    id: 'kt_overseer', name: 'The Overseer (KT)',
    expanded: { 1: ['Ray of Sickness', 'Sleep'], 2: ['Blindness/Deafness', 'See Invisibility'], 3: ['Clairvoyance', 'Slow'], 4: ['Arcane Eye', 'Fabricate'], 5: ['Creation', 'Telekinesis'] },
    features: [
      [1, "Overseer's Gaze", 'Bonus action: a spectral eye fires a random ray (d6) at a creature: Fear (WIS save, frightened), Telekinetic (STR save, moved 10 ft), Slowing (speed halved), Petrification (CON save, slowed), Enervation (CON save, 1d8 + CHA necrotic), Disintegration (CON save, 1d10 + CHA force). Prof-bonus uses per long rest.'],
      [6, 'Lingering Gaze', 'The eye stays 1 minute; bonus action to fire again each turn; pick the ray once per eye. Advantage on Perception and bonus-action Search while it\'s out.'],
      [10, "Patron's Paranoia", 'Can\'t be surprised; add CHA mod to initiative.', { initAbil: 'CHA' }],
      [14, "Suppressor's Sight", 'Action: antimagic field in a 150 ft cone until your next turn. Once per long rest.']
    ]
  });
  stub('Oakenhide', 2, 'KT', 'Touch: 6 temp HP at the start of each turn; AC 15 + DEX (max 2) while they last.');
  stub('Summon Plant', 3, 'KT', 'Summon a Plant Spirit (Dryad, Shambling Mound or Treant) that fights for you.', { conc: true });
  stub('Carnivorous Garden', 4, 'KT', 'Four biting plants (2d8 piercing) in difficult terrain.', { conc: true });
  sub('warlock', {
    id: 'kt_greattree', name: 'The Great Tree (KT)',
    expanded: { 1: ['Bramble Binding', 'Entangle'], 2: ['Sprout Tree', 'Oakenhide'], 3: ['Summon Plant', 'Speak with Plants'], 4: ['Carnivorous Garden', 'Guardian of Nature'], 5: ['Commune with Nature', 'Tree Stride'] },
    choices: [{ lvl: 10, id: 'oaken', label: 'Oaken Might (2, change on long rest)', type: 'list', n: 2, opts: [
      { id: 'conc', name: 'Steady roots', text: 'Auto-succeed on concentration saves while at full HP or with temp HP.' },
      { id: 'large', name: 'Large', text: 'Become Large with +10 ft reach.' },
      { id: 'terrain', name: 'Roots and vines', text: '15 ft difficult terrain around you for creatures you choose.' },
      { id: 'temp', name: 'Shared growth', text: 'Gain temp HP equal to healing from Verdant Growth.' }
    ] }],
    features: [
      [1, 'Verdant Growth', 'Bonus action: bless a creature within 60 ft that was damaged in the last minute; it regains prof-bonus HP at the start of each turn for 1 minute (ends on 0 HP or fire damage). CHA mod uses per long rest.'],
      [6, 'Deep Roots', 'Reaction: ignore being knocked prone or moved; or root a restrained enemy within 60 ft (half warlock level bludgeoning each turn).'],
      [10, 'Oaken Might', 'Choose two options; change after a long rest.'],
      [14, 'Mystic Shade', 'Action: spectral tree with 30 ft shade for 1 minute: chosen creatures heal like Verdant Growth, resist the next B/P/S hit, advantage vs forced movement/prone, half cover vs ranged. Once per long rest.']
    ]
  });

  // Wizard
  stub('Preservation', 0, 'KT', 'Slow time on an object (half pace; 1/3 at 5th, 1/4 at 11th, 1/5 at 17th).');
  sub('wizard', {
    id: 'kt_chronomancy', name: 'Order of Chronomancy (KT)', grantedSpells: [{ name: 'Preservation', at: 2 }],
    features: [
      [2, 'Accelerate Self', 'INT mod charges per long rest. Spend one to use a bonus action for Dash, Dodge, Disengage, Help, Hide, Search, Use an Object, or a self-only 1-action spell (cantrip at 2nd, 1st level at 5th, 2nd at 11th, 3rd at 17th).'],
      [2, 'Stretched Time', 'Learn Preservation. Once per spell, double a non-instantaneous duration (damage halved).'],
      [6, 'Frozen Moment', 'Action: stop time in a 10 ft radius; if all fail WIS saves they are paralyzed until your next turn or damage. Once per short/long rest.'],
      [10, 'Delayed Effect', 'Reaction: delay an area effect within 60 ft until the end of your next turn (spellcasting check vs its DC). Once per short/long rest.'],
      [14, 'Temporal Force', 'Spend slots to boost: Complete Preservation, Expanded Moment (larger Frozen Moment), Suspended Effect (longer delay), Minor Time Stop (time stop with a 5th-level slot, 1 round, once per long rest).']
    ]
  });
  sub('wizard', {
    id: 'kt_geomancy', name: 'Order of Geomancy (KT)', tools: ["Navigator's tools"],
    features: [
      [2, 'Geomantic Lore', "Navigator's tools; use INT (Arcana) instead of WIS (Survival) to navigate or find landmarks."],
      [2, 'Find Leyline', 'Action or on initiative: mark a point within 30 ft; the DM marks a second within 60 ft; the line between is a leyline. INT mod uses per long rest.'],
      [2, 'Leyline Tap', 'Pool of extra spell levels = prof bonus per long rest. On a leyline, spend them to upcast spells (up to your max slot) or add a die to a cantrip.'],
      [6, 'Redirect Power', 'Reaction: let another caster on a leyline use your Leyline Tap; +2 pool levels only for others.'],
      [10, 'Geomantic Flare', 'Action: creatures on a leyline either gain 1d4 to their next save (up to INT mod chosen) or take 8d6 force (DEX half). Once per long rest.'],
      [10, 'Improved Enchanting', '1 hour at a leyline gives advantage on enchanting/brewing checks for 2 hours. Once per long rest.'],
      [14, 'Mana Flood', 'Mark three intersecting leylines; at the intersection your spells are one level higher; 1d4 force to you each turn; resist other force damage. Once per long rest.']
    ]
  });

  // =================== NEW CLASS: SPELLBLADE ===================
  var SB = {
    0: { phb: ['Acid Splash', 'Chill Touch', 'Dancing Lights', 'Fire Bolt', 'Light', 'Mage Hand', 'Message', 'Minor Illusion', 'Poison Spray', 'Prestidigitation', 'Produce Flame', 'Ray of Frost', 'Resistance', 'Shocking Grasp', 'True Strike'], kt: ['Decaying Touch', 'Electric Arc', 'Force Bolt', 'Freeze', 'Illusionary Dart', 'Preservation', 'Water Bullet'] },
    1: { phb: ['Alarm', 'Bane', 'Burning Hands', 'Faerie Fire', 'Feather Fall', 'Fog Cloud', 'Grease', 'Inflict Wounds', 'Longstrider', 'Mage Armor', 'Magic Missile', 'Shield', "Tasha's Hideous Laughter", 'Thunderwave', 'Unseen Servant'], kt: ['Acid Bubble', "Aldricor's Elemental Rebuke", 'Arcane Ablation', 'Arcane Weapon', 'Arctic Breath', 'Bad Blood', 'Blade Mirage', 'Crashing Wave', 'Crippling Agony', 'Electrify', 'Elemental Orb', 'Entomb', 'Eyes of Immolation', 'Gale Bolt', 'Grip of the Dead', 'Ice Arrow', 'Lightning Tendril', 'Melting Glob', 'Prismatic Flash', 'Shadow Bind', 'Thunder Punch', 'Tranquil Moment', 'Violent Updraft', 'Water Blast', 'Multishot'] },
    2: { phb: ['Blindness/Deafness', 'Blur', 'Darkness', 'Darkvision', 'Enhance Ability', 'Enlarge/Reduce', 'Hold Person', 'Invisibility', 'Mirror Image', 'Misty Step', 'Ray of Enfeeblement', 'See Invisibility', 'Shatter', 'Spider Climb', 'Web', 'Jump'], kt: ['Alacrity', 'Become Fire', 'Become Stone', 'Become Water', 'Become Wind', 'Boil Blood', 'Burning Strike', 'Clay Touch', 'Cold Snap', 'Crackle', 'Crescent Wind Slash', 'Disorient', 'Dragon Surge', 'Earth Ripple', 'Elemental Exhalation', 'Ethereal Immolation', 'Fling', 'Gravity Surge', 'Hurricane Slash', 'Infernal Shackles', 'Instant Counter', 'Iron Wind Strike', 'Poison Dart', 'Pseudopod Slam', 'Shattering Shield', 'Star Dust', 'Time Skip', 'Time Trap', 'Vacuum Pull', 'Wind Cutter', 'Elemental Barrage', 'Dancing Object'] },
    3: { phb: ['Blink', 'Counterspell', 'Dispel Magic', 'Fireball', 'Fly', 'Haste', 'Lightning Bolt', 'Sleet Storm', 'Stinking Cloud', 'Tongues', 'Vampiric Touch', 'Water Breathing', 'Water Walk', 'Slow'], kt: ['Acidic Pit', 'Aether Lance', 'Arctic Aura', 'Crushing Singularity', 'Electrocute', 'Erode', 'Fire Cyclone', 'Flash Freeze', 'Ghost Step', 'Hungering Void', 'Meteor Jump', 'Seismic Wave', 'Spider Bite', 'Static Field', 'Vortex Blast', 'Water Cannon', 'Wither'] },
    4: { phb: ['Arcane Eye', 'Banishment', "Evard's Black Tentacles", 'Blight', 'Confusion', 'Dimension Door', 'Fire Shield', 'Freedom of Movement', 'Greater Invisibility', 'Ice Storm', 'Phantasmal Killer', 'Stoneskin', 'Wall of Fire', "Otiluke's Resilient Sphere"], kt: ['Aero Barrage', 'Bile Beam', 'Devour Shadow', 'Dimension Cutter', 'Echoing Lance', 'Force Blade', 'Geyser', 'Ice Spike', 'Iron Garden', 'Jumping Jolt', 'Orbital Stones', 'Pillar of Fire', 'Poison Puff', 'Quicksilver Steps', 'Suffocate'] },
    5: { phb: ['Cloudkill', 'Cone of Cold', 'Hold Monster', 'Mislead', 'Passwall', 'Scrying', 'Telekinesis', 'Animate Objects', 'Dispel Evil and Good', 'Wall of Stone'], kt: ['Acid Rain', 'Aether Storm', 'Anvil Drop', 'Blastwave', 'Burial Barrage', 'Deglove Creature', 'Devouring Darkness', 'Fissure', 'Flickering Strikes', 'Pressure Cutter', 'Pyroclastic Lance', 'Sky Burst', 'Sonic Shriek', 'Tornado', 'Shockwave'] }
  };
  // Note: a few PHB spells above (Jump, Slow, Otiluke's Resilient Sphere, Animate Objects, Dispel Evil and Good, Wall of Stone) are added because Spellblade techniques grant them.
  Object.keys(SB).forEach(function (l) {
    SB[l].phb.forEach(function (n) { var s = DB.SPELL_INDEX[n.toLowerCase()]; if (s && s.classes.indexOf('L') < 0) s.classes += 'L'; });
    SB[l].kt.forEach(function (n) { stub(n, +l, 'KT', null, { addClass: 'L' }); });
  });
  stub('Ice Weapon', 0, 'KT', 'Create a weapon of ice (KibblesTasty cantrip).');
  stub('Thunder Punch', 1, 'KT', null, { addClass: 'L' });
  stub('Ice Spikes', 4, 'KT', null);

  DB.OPTS.aegis = [
    { id: 'agility', name: '1st: Arcane Agility', text: 'Jump spell effect.' },
    { id: 'armor', name: '1st: Arcane Armor', text: 'Mage armor effect (AC 13 + DEX).', fx: { acFormula: { name: 'Arcane Armor (Aegis)', base: 13, add: ['DEX'], shield: true } } },
    { id: 'fist', name: '1st: Arcane Fist (Spellfist)', text: 'Unarmed strike 1d10 (1d12 with a 3rd-level slot).' },
    { id: 'swift', name: '1st: Arcane Swiftness', text: '+5 ft speed.', fx: { speed: 5 } },
    { id: 'enchant', name: '1st: Elemental Enchantment', text: 'Weapon damage becomes fire, cold or lightning.' },
    { id: 'shieldprof', name: '1st: Enchanted Shield', text: 'Proficiency with a touched shield.', fx: { armor: ['Shields'] } },
    { id: 'surgesaves', name: '1st: Surging Saves', text: 'A surge adds INT to STR/DEX saves and checks.' },
    { id: 'barrier', name: '1st: Warding Barrier', text: 'Reduce all damage taken by 1.' },
    { id: 'focus', name: '1st: Weapon Focus', text: 'Weapon serves as arcane focus.' },
    { id: 'eyes', name: '2nd: Arcane Eyes', text: 'Darkvision 60 ft.' },
    { id: 'style', name: '2nd: Arcane Style', text: 'One fighter fighting style (note which in Notes).' },
    { id: 'skill', name: '2nd: Arcane Skill', text: 'One skill proficiency (note which in Notes).' },
    { id: 'channel', name: '2nd: Blade Channel', text: 'Use your attack ability for Spellstrike spellcasting.' },
    { id: 'illusion', name: '2nd: Illusionary Ally', text: 'One mirror image duplicate on initiative.' },
    { id: 'loyal', name: '2nd: Loyal Weapon', text: 'Weapon gains returning.' },
    { id: 'quick', name: '2nd: Quickened Movement', text: '+5 ft speed.', fx: { speed: 5 } },
    { id: 'aetherbarrier', name: '3rd: Aether Barrier (Aether Blade)', text: 'Temp HP = INT mod when dealing Aether Blade damage.' },
    { id: 'overflow', name: '3rd: Arcane Overflow', text: '+1 Arcane Surge use.' },
    { id: 'arcaneshield', name: '3rd: Arcane Shield', text: '+2 AC as a hands-free shield (doesn\'t stack with a shield).' },
    { id: 'blastwave', name: '3rd: Blastwave', text: 'Teleporting pushes nearby creatures (STR save or prone).' },
    { id: 'chameleon', name: '3rd: Chameleon Aegis', text: 'Hide without cover.' },
    { id: 'blink', name: '3rd: Contingent Blink', text: 'At 0 HP drop to 1 and blink to the Ethereal Plane. Once per long rest.' },
    { id: 'reflect', name: '3rd: Reflective Aegis', text: 'Advantage on line-spell saves; reflect half damage on success.' },
    { id: 'resist', name: '4th: Arcane Resistance', text: 'Resistance to one of acid, cold, fire, lightning, poison or thunder.' },
    { id: 'contingency', name: '4th: Combat Contingency', text: 'On initiative, reaction to cast a self-only 3rd-level or lower spell.' },
    { id: 'pathways', name: '4th: Dimensional Pathways', text: 'Surge teleport brings a willing creature.' },
    { id: 'phantom', name: '4th: Phantom Aegis', text: 'Pass through creatures and thin barriers.' },
    { id: 'runic', name: '4th: Runic Strength', text: 'STR equals INT.' },
    { id: 'flight', name: '5th: Arcane Flight', text: '30 ft fly speed.' },
    { id: 'alacrity', name: '5th: Arcane Alacrity', text: 'Attack action makes two attacks.' },
    { id: 'resilient', name: '5th: Resilient Aegis', text: 'Proficiency in one saving throw.' },
    { id: 'stone', name: '5th: Stone Aegis', text: 'Reduce all damage taken by 5.' }
  ];
  function tech(id, name, spells, feats, extra) {
    var o = { id: id, name: name, src: 'HB', srcNote: KT, spells: spells, features: feats };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  var SB_KNOWN = [0, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12];
  DB.CLASSES.push({
    id: 'spellblade', name: 'Spellblade (KT)', src: 'HB', srcNote: 'KibblesTasty Spellblade v1.3', hd: 8, saves: ['CON', 'INT'],
    armor: ['Light armor', 'Medium armor'], weapons: ['Simple weapons', 'Martial weapons'],
    skills: { n: 2, from: ['Acrobatics', 'Arcana', 'Athletics', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Religion', 'Sleight of Hand', 'Stealth'] },
    subLevel: 3, subName: 'Spellblade Technique', asi: [4, 8, 12, 16, 19],
    caster: { type: 'half', abil: 'INT', list: 'L', mode: 'known', start: 1, cantrips: [1, 3, 3, 3, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8], known: SB_KNOWN },
    cols: {
      'Arcane Surge': DB.fill([[1, 2], [5, 3], [9, 4], [13, 5], [17, 6]]),
      'Surge Teleport': DB.fill([[1, '5 ft'], [5, '10 ft'], [9, '15 ft'], [13, '20 ft'], [17, '25 ft']]),
      'Aegis slot levels': DB.fill([[2, 1], [5, 2], [9, 3], [13, 4], [17, 5]])
    },
    grantedSpells: [{ name: 'Shield', at: 2, note: 'Arcane Deflection: 1 free cast per rest' }, { name: 'Detect Magic', at: 14, note: 'Magical Sensitivity: no concentration' }],
    choices: [
      { lvl: 2, id: 'aegis', label: 'Aegis effect (1st-level; change on long rest)', type: 'list', n: 1, opts: 'aegis' },
      { lvl: 6, id: 'warding', label: 'Magical Warding: save proficiency', type: 'save', n: 1, from: ['WIS', 'CHA'] }
    ],
    features: [
      [1, 'Magic Trick', 'Learn one Spellblade cantrip (INT).'],
      [1, 'Arcane Surge', 'Uses = prof bonus per short/long rest, one per turn: cast detect magic free, advantage on one attack, add INT to a STR/DEX check, or teleport 5 ft (more at higher levels) as no action.'],
      [2, 'Spellcasting', 'Spellblade spells using INT. Known spells; half-caster slots. Swap one on level up.'],
      [2, 'Spellstrike', 'Bonus action: cast a 1-action Spellblade spell into a melee weapon; it triggers on your next melee attack this turn. Attack-roll spells use the weapon hit; save spells deal damage as if failed on a hit (other effects still allow a save); areas must include the target.'],
      [2, 'Aegis', 'Choose a 1st-level Aegis effect each long rest; sacrifice slots for more (total slot levels ≤ table).'],
      [2, 'Arcane Deflection', 'Learn shield (free); cast it once per short/long rest without a slot.'],
      [3, 'Spellblade Technique', 'Choose your technique; its spells don\'t count against spells known.'],
      [5, 'Empowered Strike', 'Spellstrike works with cantrips. Extra cantrips (see table).'],
      [6, 'Arcane Recuperation', 'Once per long rest on a short rest, regain slots totaling spellblade level ÷ 3. Bonus action: spend a slot to regain surges equal to its level.'],
      [6, 'Magical Warding', 'Proficiency in WIS or CHA saves; you auto-succeed on saves against your own spells.'],
      [10, 'Archetypal Magic', 'Cast each technique spell once per long rest without a slot.'],
      [10, 'Innate Aegis', 'Free extra 1st-level Aegis effect (add a 2nd-level one at 14th, 3rd-level at 18th).'],
      [11, 'Splash Damage', 'Spellstrike hits deal +1d8 force to the target and chosen creatures within 5 ft your roll would hit (half to target on a miss).'],
      [11, 'Blast Zone Immunity', 'Immune to your own spells\' area effects unless you choose otherwise.'],
      [14, 'Surging Focus', 'Spend a surge to succeed on a failed concentration save.'],
      [14, 'Magical Sensitivity', 'Learn detect magic; no concentration; Arcana proficiency (or expertise) while active.'],
      [18, 'Blast Zone Control', 'Spend a surge to extend Blast Zone Immunity to INT mod allies until your next turn.']
    ],
    start: [['{martial}'], ['Light crossbow + Crossbow bolts (20)', '{simple} + {simple}'], ['Scale mail', 'Leather armor'], ["Dungeoneer's pack", "Explorer's pack"], ['Arcane focus']],
    subclasses: [
      tech('battlemage', 'Battlemage', { 3: ['Burning Hands'], 5: ['Mirror Image'], 9: ['Lightning Bolt'], 13: ['Dimension Door'], 17: ['Hold Monster'] }, [
        [3, 'Arcane Warrior', 'After a long rest, pick a proficient non-two-handed weapon; use INT for its attack and damage.', { intWeapon: true }],
        [3, 'Quickening Surge', 'Surge option: cast a 1-action Spellblade spell as a bonus action.'],
        [7, 'Twin Surge', 'Choose two surge options per surge.'],
        [15, 'Surge Mastery', 'Better surges: detect magic adds darkvision/see invisibility; reroll a die on advantage; INT checks also get advantage; +10 ft teleport.'],
        [20, 'Unlimited Surges', '1 minute of surges that cost no uses (still one per turn). Once per long rest.']
      ]),
      tech('aetherblade', 'Aether Blade', { 3: ['Magic Missile'], 5: ['Star Dust'], 9: ['Aether Lance'], 13: ['Dimension Cutter'], 17: ['Aether Storm'] }, [
        [3, 'Aether Blade', 'On initiative or bonus action, manifest a one-handed force blade: 1d10 force, 5 ft reach, INT for attack and damage.', { intWeapon: true }],
        [3, 'Aether Enhancement', '1-hour ritual: absorb a magic weapon\'s bonus into your blade.'],
        [3, 'Empowering Surge', 'Surge option: blade deals an extra die until your next turn; reroll one damage die.'],
        [7, 'Aether Great Weapon', 'Blade becomes 1d12 with reach.'],
        [15, 'Channeled Power', 'Every surge also grants Empowering Surge.'],
        [20, 'Massive Blade', '1 minute: ignore nonmagical armor (target AC 10 + DEX); blade hits two creatures within 10 ft. Once per long rest.']
      ]),
      tech('guardian', 'Guardian', { 3: ['Arcane Ablation'], 5: ['Warding Bond'], 9: ['Haste'], 13: ["Otiluke's Resilient Sphere"], 17: ['Wall of Stone'] }, [
        [3, 'Guardian Proficiency', 'Heavy armor and shields; a melee weapon can be your focus.', { armor: ['Heavy armor', 'Shields'] }],
        [3, 'Projected Barrier', 'Reaction, 1 surge: cast shield on an ally within 30 ft who is hit or targeted by magic missile.'],
        [7, 'Fortifying Surge', 'Each surge gives temp HP = 1d8 + INT mod.'],
        [15, 'Swapping Surge', 'Surge teleport can swap places with a willing creature; both gain the temp HP.'],
        [20, 'Resilient Aegis', '1 minute of resistance to all damage. Once per long rest.']
      ]),
      tech('swiftblade', 'Swiftblade', { 3: ['Inflict Wounds'], 5: ['Poison Dart'], 9: ['Spider Bite'], 13: ['Blight'], 17: ['Mislead'] }, [
        [3, 'Two-Weapon Fighting', 'Add your ability modifier to off-hand damage.'],
        [3, 'Swift Casting', 'Use Spellstrike as part of the Attack action once per turn; melee weapon as focus.'],
        [3, 'Rapid Surge', 'Surge option: make one weapon attack.'],
        [7, 'Relentless Spellstrike', 'If a Spellstrike attack misses, hold the spell for your next attack this turn.'],
        [15, 'Vanishing Surge', 'Spending a surge makes you invisible until your next turn.'],
        [20, 'Infinite Strikes', '1 minute: each weapon attack from an action or bonus action lets you attack again. Once per long rest.']
      ]),
      tech('magehunter', 'Mage Hunter', { 3: ["Aldricor's Elemental Rebuke"], 5: ['Silence'], 9: ['Counterspell'], 13: ['Suffocate'], 17: ['Dispel Evil and Good'] }, [
        [3, 'Disrupting Blows', 'Once per turn on a melee hit, +prof force damage (doubled after casting abjuration or a technique spell); bypass 1st-level spell defenses like shield and mage armor.'],
        [3, 'Purging Surge', 'Spend a surge to end a magical effect on yourself (INT save if the spell is higher than half your level).'],
        [7, 'Nullifying Surge', 'Purge while incapacitated; 2 surges to cast counterspell or dispel magic without a slot.'],
        [15, 'Expert Abjuration', 'Add prof to dispel/counter checks from surges.'],
        [20, 'Mana Void', '1 minute antimagic field (5 ft); regain a surge each turn you counter or end a spell. Once per long rest.']
      ]),
      tech('spellshot', 'Spellshot', { 3: ['Multishot'], 5: ['Elemental Barrage'], 9: ['Lightning Bolt'], 13: ['Greater Invisibility'], 17: ['Pressure Cutter'] }, [
        [3, 'Ranged Spellstrike', 'Infuse spells into ammunition (range = lesser of spell and weapon normal range).'],
        [3, 'Distant Surge', 'Surge option: extend an infused spell to the weapon\'s full range with no long-range disadvantage.'],
        [7, 'Transmuted Ammunition', 'Line spells use STR or DEX for DC and add weapon damage.'],
        [15, 'Seeking Surges', 'Spending a surge adds INT mod to your next attack roll.'],
        [15, 'Arcane Bolts', 'Create force ammunition from nothing.'],
        [20, 'Complete Control', '1 minute: ignore cover, free Distant Surge, redirect misses. Once per long rest.']
      ]),
      tech('rimeblade', 'Rimeblade', { 3: ['Arctic Breath'], 5: ['Cold Snap'], 9: ['Slow'], 13: ['Ice Spikes'], 17: ['Cone of Cold'] }, [
        [3, 'Ice Blade', 'After a long rest, a proficient non-two-handed weapon deals cold and uses INT.', { intWeapon: true }],
        [3, 'Arctic Armory', 'Learn ice weapon; cast it once per turn without a bonus action.'],
        [3, 'Frostbite', 'Surge option on a melee hit: remove cold resistance/immunity and give disadvantage on saves vs your cold spells.'],
        [7, 'Frozen Heart', 'Cold resistance; advantage vs charmed and frightened.', { resist: ['cold'] }],
        [15, "Winter's Grip", 'Frostbite lasts longer; frostbitten creatures that fail a save vs your cold spell are restrained.'],
        [20, 'Ice Age', '1 minute, 30 ft everfrost around you: difficult terrain, slows and restrains foes, allies resist cold. Once per long rest.']
      ], { grantedSpells: [{ name: 'Ice Weapon', at: 3 }] }),
      tech('flyingsword', 'Flying Sword', { 3: ['Jump'], 5: ['Dancing Object'], 9: ['Fly'], 13: ['Quicksilver Steps'], 17: ['Animate Objects'] }, [
        [3, 'Flying Sword', 'Infuse a melee weapon during a long rest; attack with it at up to 30 ft (15 ft heavy, 60 ft light) using INT.', { intWeapon: true }],
        [3, 'Phantom Sword Surge', 'When attacking with it, a surge creates two phantom copies that attack other targets for force damage.'],
        [7, 'Sword Flight', 'Ride your sword like a broom of flying; range doubles.'],
        [15, 'Phantom Sword Barrage', 'Up to 4 copies; other surges add a copy.'],
        [20, 'Ultimate Move', '120 ft × 15 ft line: DEX save, 6d6 slashing + 6d6 force (half on save). Once per long rest.']
      ]),
      tech('spellfist', 'Spellfist', { 3: ['Thunder Punch'], 5: ['Shatter'], 9: ['Vortex Blast'], 13: ['Aero Barrage'], 17: ['Shockwave'] }, [
        [3, 'Kinetic Magic', 'Unarmed strikes deal 1d8 bludgeoning, count as magical and work with Spellstrike.', { unarmedDie: '1d8' }],
        [3, 'Impactful Magic', 'Surge options: Arcane Impact (push 10 ft further) or Arcane Grab (grapple/shove with advantage on a hit).'],
        [7, 'Point Blank', 'Spellstrike on a grappled target auto-hits; it saves at disadvantage against other effects.'],
        [15, "Brawler's Resilience", 'Spending a surge gives resistance to all damage until your next turn.'],
        [20, 'Unlimited Power', '1 minute: +2 STR (and max), 30 ft cone splash, huge jumps, advantage on STR checks and saves. Once per long rest.']
      ])
    ]
  });

  // =================== NEW CLASS: PSION ===================
  DB.OPTS.psiDiscipline = [
    { id: 'enhancement', name: 'Enhancement', text: 'Enhancing Skill (+1d4 to STR/DEX checks). Power: Enhancing Surge (1d6 temp HP and +1d6 next damage; Fortifying, Resilient, Savage, Swift modifiers). Recreates heroism to greater restoration.' },
    { id: 'projection', name: 'Projection', text: 'Project Item (up to 3 ethereal objects). Power: Astral Construct (1d8 force; Grab, Grow, Relocate, Replicate, Solidify, Strike, Sustain). Recreates floating disk to creation.' },
    { id: 'telekinesis', name: 'Telekinesis', text: 'Telekinetic Hands (10 lb at 30 ft). Power: Telekinetic Force (STR save, 1d10 bludgeoning plus shove/prone; Crushing, Hammering, Hurling, Zone modifiers). Recreates jump to telekinesis.' },
    { id: 'telepathy', name: 'Telepathy', text: 'Telepathic Communication (30 ft). Power: Telepathic Intrusion (WIS save, 1d8 psychic, disadvantage attacking you; Meddling, Overwhelming, Rending, Terrifying). Recreates compelled query to telepathic bond.' },
    { id: 'transposition', name: 'Transposition', text: 'Flicker Step (replace movement with a short teleport). Power: Phase Rift (move 10 ft, tear deals 1d8 force on failed DEX save; Blurring, Disruptive, Echoing, Ethereal, Long). Recreates flicker to spatial manipulation.' },
    { id: 'psychokinesis', name: 'Psychokinesis', text: 'Energy Manipulation. Power: Elemental Blast (ranged spell attack, 1d8 cold/fire/force/lightning; Amplified, Lasting, Massive, Overcharged). Specialize as Cryo-, Electro- or Pyrokinetic. Recreates burning hands to cone of cold.' },
    { id: 'precognition', name: 'Precognition', text: 'Prescience (prof to Perception and initiative). Power: Seeing (grant advantage/disadvantage; Omniscient, Piercing, Positioning, Thwarting, Withheld). Recreates detect good and evil to scrying.' },
    { id: 'nullification', name: 'Nullification', text: 'Disruptive Touch. Power: Denial (CHA save, 1d4 force, more vs certain types; Aura, Existential, Firm, Lingering, Supernatural). Recreates protection from evil and good to dispel evil and good.' },
    { id: 'consumption', name: 'Consumption', text: 'Adaptive Hunter (borrow a proficiency after Mind Leech). Power: Mind Leech (CHA save, 1d6 psychic, gain a psionic charge; Devouring, Nourishing, Rending, Shredding, Stunning, Thieving). Recreates inflict wounds to devouring darkness.' }
  ];
  DB.OPTS.psiTalent = [
    ['Body Control (5th, Enhancement)', 'At-will alter self; cheaper enlarge/reduce.'], ['Enhanced Regrowth (Enhancement)', 'Cure wounds for 1 psi.'],
    ['Metamorphosis (Enhancement, needs Body Control)', 'Adds mutate and polymorph (self).'], ['Physical Surge (Enhancement)', 'Enhancing Surge on yourself sets STR or DEX to INT.'],
    ['Surging Power (Enhancement)', 'Enhancing Surge on yourself as a bonus action (smaller dice).'], ['Transcendent Life (9th, Enhancement)', 'Adds mass cure wounds and reincarnate.'],
    ['Animated Projections (10th, Projection)', '5 psi: animate objects.'], ['Astral Swap (Projection)', 'Bonus action, 1 psi: swap places with your construct.'],
    ['Life Link (Projection)', 'Take damage for a solidified construct, with resistance.'], ['Matter Made Real (9th, Projection)', 'Fabricate and wall of stone for psi = spell level.'],
    ['Projected Weaponry (Projection)', 'Project up to 3 weapons; INT for attack and damage.'], ['Unlimited Imagination (Shaper\'s Mind)', 'Pick two Boundless Imagination options.'],
    ['Kinetic Slam (Telekinesis)', 'Telekinetic Force as a ranged spell attack with Hammering.'], ['Mental Might (5th, Telekinesis)', 'INT for Athletics; telekinetic grapple/shove at 30 ft.'],
    ['Precise Power (9th, Telekinesis)', 'Animate objects; ±2d4 to ranged attacks you see.'], ['Telekinetic Movement (Telekinesis)', '1 psi: +10 ft and spider climb, feather fall or levitate.'],
    ['Telekinetic Weapons (Telekinesis)', 'Gain the Telekinetic Weapons power.'], ['Telekinetic Barrier (Telekinesis)', '2 psi: wall or 15 ft radius that hinders ranged attacks.'],
    ['Unchecked Power (9th, Telekinesis)', 'Fissure; 1 psi to shove an attacker.'], ['Attuned Argument (Telepathy)', 'Extra d20 on CHA checks, prof-bonus times per long rest.'],
    ['Empathy (Telepathy)', 'Reaction: share a creature\'s damage, granting it resistance.'], ['Mental Image (Telepathy)', 'Adds illusion spells to recreations.'],
    ['Mental Influence (Telepathy)', 'Expertise in Persuasion.'], ['Reflected Agony (Telepathy)', 'Reaction: 1d10 psychic per psi back at an attacker.'],
    ['Tactical Opening (5th, Telepathy)', 'Bonus action Help at 30 ft after a failed Intrusion save.'], ['Telepathic Link (Telepathy)', 'Unlimited-range telepathy with INT mod willing creatures.'],
    ['Rift Strike (Transposition)', 'Bonus action weapon attack when using Phase Rift as an action.'], ['Flickering Escape (11th, Transposition)', 'Teleport 5 ft after a flicker d4 attack.'],
    ['Lingering Rifts (Transposition)', 'Phase Rift leaves a damaging tear.'], ['Phase Shot (Transposition, needs Rift Strike)', 'Ammunition gains Phase Rift properties.'],
    ['Phase Slash (11th, Transposition, needs Rift Strike)', 'Melee attacks vs creatures you pass through.'], ['Phase Shroud (Transposition)', 'Temp HP after Phase Rift.'],
    ['Elemental Aegis (Psychokinesis)', 'Action: temp HP = psion level + INT and damaging shield. Once per rest.'], ['Elemental Emotions (Psychokinesis)', 'Elemental damage boosts a related save.'],
    ['Elemental Shield (9th, Psychokinesis)', 'Fire shield free once per long rest or for 4 psi.'], ['Manifested Emotions (Psychokinesis)', '2 psi: manifest an emotion as a mephit.'],
    ['Glimpsed Future (Precognition)', 'Seeing on yourself as a bonus action.'], ['One Step Ahead (Precognition)', '1 psi: identify a save\'s effect and add INT.'],
    ['Precognitive Dreams (11th, Precognition)', 'Allies gain INT mod temp HP; you can\'t be surprised for 24 h.'], ['Deadspot (15th, Nullification)', 'Antimagic field for 8 psi, once per long rest.'],
    ['Iron Templar (Nullification)', 'Medium armor and shields; Denial as a bonus action on a hit.'], ['Magical Anathema (Nullification)', 'Resist magical damage; magical healing on you halved.'],
    ['Magical Resistance (9th, Nullification)', 'Advantage on saves against magic.'], ['Consumed Strength (Consumption)', 'INT for Athletics while holding a charge.'],
    ['Consuming Link (Consumption)', 'Mind Leech charmed/frightened creatures within 120 ft.'], ['Skill Thief (Consumption)', 'More Adaptive Hunter proficiencies.'],
    ['Unlife Wielder (Consumption)', 'Animate a corpse with a charge.'], ['Astral Arms', '1 psi: psionic arms make INT unarmed strikes for 10 minutes.'],
    ['Aura Sight', '1 psi: read a creature\'s aura within 30 ft.'], ['Awaken Mind (9th)', 'Cast awaken free once per long rest.'],
    ['Beam of Annihilation (11th, Elemental Mind)', '6 psi: a beam of annihilation.'], ['Controlled Power', '2 psi: no glow or somatic components (cost doubles until rest).'],
    ['Divided Mind (9th)', 'Divide self for 5 psi.'], ['Dreamwalker (9th)', 'Cast dream free once per long rest.'],
    ['Elemental Penetration (Elemental Mind)', '1 psi: ignore elemental resistance.'], ['Empowered Strike (Psychokinesis or Telekinesis)', 'Once per turn add discipline modifiers to a melee hit.'],
    ['Life Wielder (Enhancement or Consumption)', 'Learn invest life.'], ['Mind Devourer (5th)', 'Psychic drain for 2 psi; regain HP and psi when nearby creatures die.'],
    ['Mind Rider', 'See and hear through a willing creature for an hour.'], ['Perfect Focus (10th)', 'Concentrate on two effects (speed 0, -5 saves).'],
    ['Personal Truth', 'Convince yourself of anything; 1 psi for minor reality tweaks.'], ['Potent Psionics', 'Half damage on a successful save vs your damaging powers.'],
    ['Psi Crystal', '2 psi: find familiar as a psi crystal.'], ['Psionic Defenses', 'Unarmored, no shield: AC = 13 + INT.'],
    ['Psionic Weapon', 'Bonus action, 1 psi: +1d6 psychic per turn for 1 minute (scales to 4d6).'], ['Projected Nightmares (Shaper\'s Mind)', 'Horrifying Nightmare option for constructs.']
  ].map(function (t, i) {
    var o = { id: 'pt' + i, name: t[0], text: t[1] };
    if (t[0] === 'Psionic Defenses') o.fx = { acFormula: { name: 'Psionic Defenses', base: 13, add: ['INT'], shield: false } };
    return o;
  });
  function arche(id, name, disc, feats, extra) {
    var o = { id: id, name: name, src: 'HB', srcNote: KT, discipline: disc, features: feats };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  DB.CLASSES.push({
    id: 'psion', name: 'Psion (KT)', src: 'HB', srcNote: 'KibblesTasty Psion v1.5.3', hd: 6, saves: ['INT', 'WIS'],
    armor: ['Light armor'], weapons: ['Simple weapons'], fixedSkills: ['Psionics'],
    skills: { n: 2, from: ['Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Perception', 'Religion'] },
    subLevel: 1, subName: 'Psionic Archetype', asi: [4, 8, 12, 16, 19],
    dc: { label: 'Psionic save DC / attack', abil: 'INT' },
    cols: {
      'Psi Points': DB.fill([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20]]),
      'Psi Limit': DB.fill([[1, 1], [3, 2], [5, 3], [7, 4], [9, 5], [11, 6], [13, 7], [15, 8], [17, 9], [19, 10]]),
      'Talents Known': DB.fill([[2, 2], [5, 3], [7, 4], [9, 5], [12, 6], [15, 7], [18, 8]]),
      'Disciplines': DB.fill([[1, 1], [3, 2], [18, 3]]),
      'Free psi / turn': DB.fill([[5, 1], [11, 2], [17, 3]])
    },
    choices: [
      { lvl: 2, id: 't2', label: 'Psionic Talents (2)', type: 'list', n: 2, opts: 'psiTalent' },
      { lvl: 3, id: 'disc2', label: 'Secondary Discipline', type: 'list', n: 1, opts: 'psiDiscipline' },
      { lvl: 5, id: 't5', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' },
      { lvl: 7, id: 't7', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' },
      { lvl: 9, id: 't9', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' },
      { lvl: 11, id: 'in6', label: 'Innate Psionics: 6th-level spell', type: 'spell', n: 1, spellLvl: 6, list: 'W', note: 'Psion list not included; pick from the wizard list or ask your DM.' },
      { lvl: 12, id: 't12', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' },
      { lvl: 13, id: 'in7', label: 'Innate Psionics: 7th-level spell', type: 'spell', n: 1, spellLvl: 7, list: 'W' },
      { lvl: 15, id: 't15', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' },
      { lvl: 15, id: 'in8', label: 'Innate Psionics: 8th-level spell', type: 'spell', n: 1, spellLvl: 8, list: 'W' },
      { lvl: 17, id: 'in9', label: 'Innate Psionics: 9th-level spell', type: 'spell', n: 1, spellLvl: 9, list: 'W' },
      { lvl: 18, id: 'disc3', label: 'Third Discipline', type: 'list', n: 1, opts: 'psiDiscipline' },
      { lvl: 18, id: 't18', label: 'Psionic Talent (+1)', type: 'list', n: 1, opts: 'psiTalent' }
    ],
    features: [
      [1, 'Psionic Archetype', 'Choose an archetype; it grants your first discipline.'],
      [1, 'Psionics', 'Psi points = psion level, regained on a short or long rest; spend up to the Psi Limit per use. DC = 8 + prof + INT; attack = prof + INT. Recreated spells have no V/M components, but psionics need somatic components and make you glow. Dispellable; suppressed by antimagic.'],
      [2, 'Psionic Talents', 'Learn talents (see table); swap one per level.'],
      [3, 'Secondary Discipline', 'Learn a second discipline.'],
      [5, 'Psionic Mastery', '1 free psi point at the start of each turn for discipline effects only (2 at 11th, 3 at 17th).'],
      [11, 'Innate Psionics', 'One 6th-level spell castable once per long rest (7th at 13th, 8th at 15th, 9th at 17th). Needs components.'],
      [18, 'Third Discipline', 'Learn a third discipline.'],
      [20, 'Ascension', 'On death, become a ghost-like entity on the Border Ethereal until your psi points run out.']
    ],
    start: [['Quarterstaff', 'Dagger'], ['Leather armor'], ["Scholar's pack", "Explorer's pack"]],
    subclasses: [
      arche('awakened', 'Awakened Mind', 'telepathy', [
        [1, 'Opened Mind', 'Gain the Telepathy discipline.'],
        [1, 'Mental Awareness', 'Use INT for Insight vs creatures with INT 6+; know the direction of creatures you\'ve linked with for an hour.'],
        [3, 'Mind Reader', 'Telepathic Intrusion can target INT; failed saves give you a ±d4 against that creature.'],
        [6, 'Empowered Psionics', 'Add INT mod to discipline power damage.'],
        [10, 'All Seeing Eye', '60 ft mindsight for INT 6+ creatures; INT for Perception to detect creatures.'],
        [14, 'Full Awakening', '2 psi at turn start: advantage on attacks and saves until your next turn.']
      ]),
      arche('unleashed', 'Unleashed Mind', 'telekinesis', [
        [1, 'Unshackled Power', 'Gain the Telekinesis discipline.'],
        [1, 'Overwhelming Power', 'Psionic thaumaturgy that can float small objects or push creatures 5 ft (STR save).'],
        [3, 'Rampaging Power', 'Rampage die (d4 → d12) added once per turn to damage, growing each turn you deal damage; exhaustion if held at d12 for over a minute.'],
        [6, 'Empowered Psionics', 'Add INT mod to discipline power damage.'],
        [10, 'Uncontrollable Mind', 'Immune to charmed, frightened and mind control while the rampage die is d8+.'],
        [14, 'Unstoppable Rampage', 'When dropped to 0, roll the rampage die + CON to stay at 1 HP (2 psi for an extra die).']
      ]),
      arche('transcended', 'Transcended Mind', 'enhancement', [
        [1, 'Enlightened', 'Gain the Enhancement discipline.'],
        [1, 'State of Mind', 'Ignore extreme temperatures; hold breath and go without food/sleep twice as long.'],
        [3, 'Balance of Power', 'Psionic healing/temp HP fills a pool (max psion level) you can add to a damage roll.'],
        [6, 'Perfected Enhancement', 'Add prof to temp HP from your powers.'],
        [10, 'Mental Control', 'Add INT mod to CON saves for concentration on discipline effects.'],
        [14, 'Mind Over Matter', '2 psi: make an INT save instead of STR/DEX/CON; 4 psi: a death save counts as 20.']
      ]),
      arche('shaper', "Shaper's Mind", 'projection', [
        [1, "Creator's Mind", 'Gain the Projection discipline.'],
        [1, 'Boundless Imagination', 'Constructs get Devastating Weapons (1d12), Psionic Conduit, or Vivid Existence; switch as a bonus action.'],
        [3, 'Astral Metastability', 'One construct at a time with no concentration.'],
        [6, 'Empowered Construct', 'Add INT mod to construct and projected weapon damage.'],
        [10, 'Astral Guardian', 'Reaction: pull your construct to you, solidify it, and have it take the damage.'],
        [14, 'Imaginary Army', 'Replicate makes an extra temporary construct (once per short/long rest).']
      ]),
      arche('wandering', 'Wandering Mind', 'transposition', [
        [1, 'Spatial Manipulation', 'Gain the Transposition discipline; use DEX for its DCs and attacks.'],
        [1, "Nomad's Gear", 'Martial weapons and medium armor.', { weapons: ['Martial weapons'], armor: ['Medium armor'] }],
        [3, 'Cunning Strikes', 'Gain the Rift Strike talent free.'],
        [3, 'Curious Mind', 'After a long rest, add half prof to two unproficient skills.'],
        [6, 'Phase Dancer', 'Phase Rift makes an illusory duplicate; first attack after it has advantage.'],
        [10, 'Flickering Presence', 'Unspent mastery points carry over for flicker; 1 psi to reroll flicker/blink.'],
        [14, 'Planeswalker', 'Cast plane shift or teleport once per day.'],
        [14, 'Winding Paths', 'Phase Rift doesn\'t need a straight line.']
      ]),
      arche('elemental', 'Elemental Mind', 'psychokinesis', [
        [1, 'Elemental Power', 'Gain the Psychokinesis discipline.'],
        [1, 'Primordial Aspect', 'Action or on dealing fire/cold/lightning: take an aspect until your next turn (cold: reduce nonmagical B/P/S by prof; fire: melee attackers take prof fire; lightning: +5 ft speed). 1 psi for resistance to it (free if specialized).'],
        [3, 'Living Power', 'Modify Psychokinesis powers (shape melee/ranged; cold, fire and lightning manifestations).'],
        [6, 'Empowered Psionics', 'Add INT mod to discipline power damage.'],
        [10, 'Full Manifestation', '1 psi on entering an aspect to fully manifest it (free if specialized).'],
        [14, 'Elemental Form', '5 psi (3 if specialized): shapechange into an air, fire or water elemental. Once per short/long rest.']
      ]),
      arche('consuming', 'Consuming Mind', 'consumption', [
        [1, 'Psionic Predator', 'Gain the Consumption discipline.'],
        [1, 'Dark Lurker', 'Proficiency in Stealth and Deception; hide your psionic use with Deception vs Insight.', { skills: ['Stealth', 'Deception'] }],
        [3, 'Ravenous Powers', 'Gain the Mind Devourer talent free; it works from 30 ft on kills by your powers.'],
        [6, 'Empowered Psionics', 'Add INT mod to discipline power damage.'],
        [10, 'Mind Vampire', 'Mind Devourer triggers on psychic damage within 30 ft; can exceed your psi max a little.'],
        [14, 'Shattered Husks', 'Mind Leech always Shreds; spend psi for up to 3d4 save penalty.']
      ])
    ]
  });

  // =================== NEW CLASS: WARLORD ===================
  function pres(id, name, feats, extra) {
    var o = { id: id, name: name, src: 'HB', srcNote: KT, features: feats };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  DB.CLASSES.push({
    id: 'warlord', name: 'Warlord (KT)', src: 'HB', srcNote: 'KibblesTasty Warlord v1.5', hd: 8, saves: ['WIS', 'CHA'],
    armor: ['Light armor', 'Medium armor'], weapons: ['Simple weapons'],
    skills: { n: 3, from: ['Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Performance', 'Persuasion'] },
    subLevel: 1, subName: 'Warlord Presence', asi: [4, 8, 10, 12, 16, 19],
    cols: {
      'Leadership Die': DB.fill([[2, 'd6'], [9, 'd8'], [13, 'd10'], [17, 'd12']]),
      'Leadership Dice': DB.fill([[2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 11], [12, 12], [13, 13], [14, 14], [15, 15], [16, 16], [17, 17], [18, 18], [19, 19], [20, 20]]),
      'Dice per turn': DB.fill([[2, 1], [6, 2], [11, 3], [17, 4]])
    },
    choices: [{ lvl: 3, id: 'wexp', label: "Warlord's Expertise (proficiency, or expertise if already proficient)", type: 'skill', n: 1, from: ['Investigation', 'Insight', 'Intimidation', 'Persuasion'], expertiseIfProf: true }],
    features: [
      [1, 'Battlefield Presence', 'When you take the Attack action, replace one attack to grant a friendly creature that can see/hear you an extra attack on its next Attack action (one per creature per round).'],
      [2, 'Leadership Dice', 'Spend up to the per-turn limit; regain on a short/long rest. Bonus actions: Rallying Mark (mark a foe within 60 ft; next ally damage adds the dice and the ally heals that much), Urgent Orders (ally within 60 ft uses its reaction to move up to its speed without opportunity attacks and gains temp HP = dice), Helpful Word (1 die: Help an ally within 30 ft).'],
      [3, "Warlord's Expertise", 'Proficiency (or expertise) in Investigation, Insight, Intimidation or Persuasion.'],
      [5, 'Extra Attack', 'Attack twice per Attack action; Battlefield Presence can replace one or both.'],
      [6, 'Prepare for Battle', '1 minute: spend dice up to your limit; up to five creatures gain temp HP = roll and may spend that many Hit Dice.'],
      [9, 'Press the Attack', 'Boost Morale (reaction, 1 die: another creature heals like Rallying Mark), Coordinated Movements (extra Urgent Orders targets for 1 die each), Expert Instructions (reaction, 1 die added to a helped roll).'],
      [13, "Warlord's Intuition", 'Before a proficient check, set the d20 to your warlord level. Once per long rest.'],
      [14, 'Shift the Field', 'Action, 1 die: up to five allies move half speed without opportunity attacks.'],
      [17, 'Unbreakable Will', 'Immune to frightened and charmed.'],
      [20, 'Tireless Leader', 'Roll a d4 instead of spending a die for Rallying Mark, Urgent Orders, Helpful Word or Prepare for Battle.']
    ],
    start: [['{simple-melee}', '{martial}'], ['Light crossbow + Crossbow bolts (20)', 'Shield'], ['Leather armor', 'Scale mail', 'Chain mail'], ["Scholar's pack", "Explorer's pack"]],
    subclasses: [
      pres('commander', 'Commander', [
        [1, 'Martial Proficiency', 'Heavy armor, shields, martial weapons.', { armor: ['Heavy armor', 'Shields'], weapons: ['Martial weapons'] }],
        [1, 'Form Up!', 'On initiative (not surprised), allies within 30 ft move up to 5 × WIS mod ft (min 5).'],
        [3, 'Keen Pointer', 'Helpful Word without a die if within 5 ft; spend dice to apply Rallying Mark.'],
        [7, 'On Your Feet!', 'Bonus action, 1 die: ally within 5 ft heals the roll (+WIS at 0 HP) and can stand.'],
        [11, 'Martial Advantage', 'Once per turn, +2d6 weapon damage if an ally is within 5 ft of the target.'],
        [15, 'Bulwark', 'When you succeed on a save, allies within 30 ft facing it get advantage.'],
        [18, 'No One Left Behind!', 'On Your Feet can move you your full speed with resistance to all damage.']
      ]),
      pres('chieftain', 'Chieftain', [
        [1, "Chieftain's Proficiency", 'Shields, martial weapons, Intimidation.', { armor: ['Shields'], weapons: ['Martial weapons'], skills: ['Intimidation'] }],
        [1, 'Wolfpack Movement', 'When an ally first moves, up to max(1, CHA mod) willing creatures within 20 ft can move with it.'],
        [3, 'Warcry', 'Action or part of Attack: spend dice; you and 1 + CHA mod allies within 20 ft gain temp HP = roll + CHA mod; then a bonus-action weapon attack.'],
        [3, 'Savage Momentum', 'Spending a die gives advantage on your next attack this turn.'],
        [7, 'Reckless Assault', 'Creatures with your temp HP may sacrifice it to add half to damage.'],
        [11, 'Wolfpack Tactics', '+1d12 on your first hit on a creature an ally damaged; +1d4 to granted attacks on creatures you damaged.'],
        [15, 'Booming Shout', 'Warcry can frighten (WIS save) once per rest; your ranges double.'],
        [18, 'Bloody Victory', 'Reaction when a foe that hurt you drops: free Warcry with a d12. CHA mod uses per long rest.']
      ], { dc: { label: 'Warlord DC', abil: 'CHA' } }),
      pres('noble', 'Noble', [
        [1, 'Destined Leader', 'Rapiers, longswords, Persuasion. Extra leadership die at 3rd, 9th and 15th.', { weapons: ['Rapier', 'Longsword'], skills: ['Persuasion'] }],
        [1, 'Call to Arms', 'On initiative, up to max(1, CHA mod) allies within 60 ft get advantage on their first attack.'],
        [1, 'Inspiring Leader', 'Weaker allies can use your prof + CHA on their first Battlefield Presence attack.'],
        [3, 'Divine Right', 'Spend dice to cast command (level = dice). Add CHA mod (max 2) to AC without heavy armor or shield.'],
        [3, 'Charismatic Leadership', 'Add CHA mod to Rallying Mark, Urgent Orders and Helpful Word.'],
        [7, 'Words of Conviction', 'Cast bless or heroism with dice (level = dice).'],
        [7, 'Imperative Order', 'Urgent Orders with 2+ dice lets the ally attack with its reaction (3+: move and attack).'],
        [11, 'Inspired Zeal', 'Chosen creatures within 30 ft deal +1d4 radiant on weapon hits.'],
        [15, 'Untouchable Presence', 'Sanctuary effect on you that returns each turn.'],
        [18, 'Grand Decree', 'Command all chosen creatures in range free once per long rest.']
      ], { dc: { label: 'Warlord DC', abil: 'CHA' }, nobleAC: true }),
      pres('packleader', 'Packleader', [
        [1, 'Tools of the Wild', 'Martial weapons, Survival, and herbalism or poisoner\'s kit.', { weapons: ['Martial weapons'], skills: ['Survival'] }],
        [1, 'Concealed Approach', '1 minute prep: add WIS to Stealth for you and 5 allies; hidden allies add WIS to initiative.'],
        [3, "Nature's Gift", 'Learn mold earth and one druid cantrip; spend a die to cast fog cloud, snare or one chosen 1st-level druid spell (WIS).'],
        [7, 'Shroud of Nature', 'Creatures obscured by your spells can Hide as a reaction.'],
        [7, 'Trackless Trails', '2 dice: cast pass without trace.'],
        [11, 'Fleeting Strikers', '+1d10 on your first attack if you moved or are obscured; granted attacks may Dash instead.'],
        [15, 'Ghosts of the Wild', 'Spend dice to Hide free or give granted attacks advantage.'],
        [18, 'Warlord of the Wilds', 'Five druid spells (4th or lower) castable with dice = level; bonus action attack after.']
      ], { dc: { label: 'Warlord DC', abil: 'WIS' }, grantedSpells: [{ name: 'Mold Earth', at: 3 }],
        choices: [{ lvl: 1, id: 'kit', label: 'Kit', type: 'tool', n: 1, from: ['Herbalism kit', "Poisoner's kit"] }, { lvl: 3, id: 'cantrip', label: "Nature's Gift: druid cantrip", type: 'spell', n: 1, spellLvl: 0, list: 'D' }, { lvl: 3, id: 'spell1', label: "Nature's Gift: 1st-level druid spell", type: 'spell', n: 1, spellLvl: 1, list: 'D' }] }),
      pres('paragon', 'Paragon', [
        [1, 'Martial Proficiency', 'Heavy armor, shields, martial weapons.', { armor: ['Heavy armor', 'Shields'], weapons: ['Martial weapons'] }],
        [1, 'Lead the Charge', 'Add CHA mod to initiative; gain CHA mod + prof temp HP on initiative.', { initAbil: 'CHA' }],
        [3, 'Fighting Style', 'Defense, Dueling, Great Weapon Fighting or Two-Weapon Fighting.'],
        [3, 'Heroic Strike', 'Once per turn, apply Rallying Mark with a melee attack; dice add to its damage.'],
        [7, 'Stand Defiant', 'At 0 HP, regain CHA mod HP (more with dice). Once per short/long rest.'],
        [11, 'Inspired Warrior', 'Gain d4s when allies within 30 ft deal or take damage; add them to your damage.'],
        [15, 'Dauntless Resolve', 'Turn a failed save into a success once per long rest.'],
        [18, 'Invincible Legion', 'An ally within 60 ft dropping to 0 stays at 1 HP (once per creature per long rest).']
      ], { choices: [{ lvl: 3, id: 'style', label: 'Fighting Style', type: 'list', n: 1, opts: 'fightingStyleWarlord' }] }),
      pres('tactician', 'Tactician', [
        [1, "Tactician's Cunning", 'History and Investigation; on long checks treat d20 ≤ 4 as 5.', { skills: ['History', 'Investigation'] }],
        [1, 'Battle Plans', 'Add INT mod to initiative; swap initiative with a willing ally.', { initAbil: 'INT' }],
        [3, 'Tactical Insight', 'Bonus action: Investigation vs Deception; on success Determine Attack, Predict Movement, Outwit Response or Expose Weakness.'],
        [3, 'Tactical Flexibility', 'Use Tactical Insight and leadership options as an action or bonus action.'],
        [7, 'Inscrutable Mind', 'INT save proficiency; reaction, 1 die added to a WIS/INT/CHA save.', { saveProf: ['INT'] }],
        [7, 'Control the Field', 'Urgent Orders and Shift the Field gain Deceptive Movement, Flanking Maneuvers and Coordinated Transitions.'],
        [11, 'Tactical Strike', 'After a successful Tactical Insight, the next damage to the target gains +2d6.'],
        [15, 'Advanced Orders', 'Urgent Orders can grant Use an Object, Search, Hide or Dodge as a reaction.'],
        [18, 'Unstoppable Schemes', 'Moved allies may pass through hostile spaces.'],
        [18, 'Multilayered Tactics', 'Tactical Insight grants two effects.']
      ], { dc: { label: 'Warlord DC', abil: 'INT' } }),
      pres('dancer', 'Dancer (expanded, DM approval)', [
        [1, "Dancer's Grace", 'Performance proficiency (or expertise). Unarmored defense 10 + DEX + CHA.', { skills: ['Performance'], acFormula: { name: 'Dancer\'s Grace', base: 10, add: ['DEX', 'CHA'], shield: false } }],
        [1, 'Graceful Entrance', 'Add CHA mod to initiative; move half speed on initiative; you and nearby creatures gain CHA mod temp HP.', { initAbil: 'CHA' }],
        [3, 'Distract', 'Bonus action: subtract a rolled die from a creature\'s attack on others.'],
        [3, "Dancer's Dodge", 'Dodging unarmored gives a free leadership option.'],
        [7, 'Battlefield Grace', 'When missed, regain a die and move 5 ft (once per turn).'],
        [7, 'Whirling Thorns', 'Bonus action light melee attack; dice for extra targets.'],
        [11, 'Furious Tempo', 'Add CHA mod to your and granted attack damage.'],
        [15, 'Evasion', 'DEX saves for half: none on success, half on failure.'],
        [18, 'Elegant Exchange', 'Reaction: take a hit for a willing creature within 15 ft.']
      ]),
      pres('dreadlord', 'Dreadlord [Beta] (expanded, DM approval)', [
        [1, 'Dreadlord Proficiency', 'Heavy armor, Intimidation.', { armor: ['Heavy armor'], skills: ['Intimidation'] }],
        [1, 'Unapproachable', 'The first attack on an ally within 30 ft after initiative has disadvantage.'],
        [3, 'Demoralization Dice', 'Spent dice give demoralization dice for reactions: Make It Excruciating, Don\'t Touch That, Are You Sure?'],
        [7, 'Supernatural Dread', 'Cast frighten with dice; fear once per long rest.'],
        [7, 'Iron Mask', 'Disadvantage on Insight vs you; suppress your own fear.'],
        [11, 'Punish the Weak', 'Mark a creature: +1d8 damage when damaged (+1d12 if frightened of you).'],
        [15, 'Instinctive Flinch', 'Creatures that resist your fear still have disadvantage on their next attack.'],
        [15, 'Expanded Dominion', 'Demoralization ranges double.'],
        [18, 'Dreadful Terror', 'Spend dice to make frightened creatures flee, be blinded or paralyzed.']
      ], { dc: { label: 'Warlord DC', abil: 'CHA' } })
    ]
  });
})(window.DB);
