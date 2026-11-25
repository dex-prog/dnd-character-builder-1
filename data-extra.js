// Official 2014-era subclasses from books other than the PHB. Feature text is summarized.
(function (DB) {
  function cls(id) { for (var i = 0; i < DB.CLASSES.length; i++) if (DB.CLASSES[i].id === id) return DB.CLASSES[i]; }
  var XGE = "Xanathar's Guide to Everything (2017)";

  // ---------------- Warlock: The Hexblade ----------------
  cls('warlock').subclasses.push({
    id: 'hexblade', name: 'The Hexblade', src: 'XGE', srcNote: XGE,
    armor: ['Medium armor', 'Shields'], weapons: ['Martial weapons'],
    expanded: { 1: ['Shield', 'Wrathful Smite'], 2: ['Blur', 'Branding Smite'], 3: ['Blink', 'Elemental Weapon'], 4: ['Phantasmal Killer', 'Staggering Smite'], 5: ['Banishing Smite', 'Cone of Cold'] },
    features: [
      [1, "Hexblade's Curse", 'Bonus action: curse a creature you can see within 30 ft for 1 minute. Add your proficiency bonus to damage against it, crit it on 19–20, and when it dies regain HP equal to warlock level + CHA mod (min 1). Once per short or long rest.'],
      [1, 'Hex Warrior', 'Proficiency with medium armor, shields and martial weapons. After a long rest, touch one weapon you\'re proficient with that lacks the two-handed property: use CHA instead of STR or DEX for its attack and damage rolls until your next long rest. Also applies to your pact weapon if you have Pact of the Blade.', { chaWeapon: true }],
      [6, 'Accursed Specter', 'When you slay a humanoid, its spirit rises as a specter under your control until your next long rest. It gains temp HP = half warlock level and adds CHA mod (min +0) to attack rolls. Once per long rest.'],
      [10, 'Armor of Hexes', 'When the target of your Hexblade\'s Curse hits you with an attack, use your reaction and roll a d6: on a 4 or higher the attack misses.'],
      [14, 'Master of Hexes', 'When the cursed creature dies, you can move the curse to another creature within 30 ft (you don\'t regain HP from the first one).']
    ]
  });

  // ---------------- Monk: Way of the Sun Soul ----------------
  cls('monk').subclasses.push({
    id: 'sunsoul', name: 'Way of the Sun Soul', src: 'XGE', srcNote: XGE,
    features: [
      [3, 'Radiant Sun Bolt', 'Ranged spell attack, 30 ft, using DEX (you are proficient): Martial Arts die + DEX radiant. Use it in place of attacks in the Attack action; after using it with the Attack action, spend 1 ki to make two more as a bonus action.', { extraAttack: { name: 'Radiant Sun Bolt', die: 'MA', type: 'radiant', abil: 'DEX', range: '30 ft', notes: 'Ranged spell attack; can replace Attack action attacks' } }],
      [6, 'Searing Arc Strike', 'After taking the Attack action, spend 2 ki to cast burning hands as a bonus action. Each extra ki raises its level by 1, up to half your monk level (rounded down) in total ki for the spell\'s level.'],
      [11, 'Searing Sunburst', 'Action: a 20 ft radius orb of light at a point within 150 ft. CON save (ki DC) or 2d6 radiant. Spend up to 3 ki for +2d6 each.'],
      [17, 'Sun Shield', 'Shed bright light 30 ft (and dim light 30 ft more); toggle as a bonus action. When a creature hits you with a melee attack while the light is on, use your reaction to deal it radiant damage = 5 + WIS mod.']
    ]
  });

  // ---------------- Cleric: Forge Domain ----------------
  cls('cleric').subclasses.push({
    id: 'forge', name: 'Forge Domain', src: 'XGE', srcNote: XGE,
    armor: ['Heavy armor'], tools: ["Smith's tools"],
    spells: { 1: ['Identify', 'Searing Smite'], 3: ['Heat Metal', 'Magic Weapon'], 5: ['Elemental Weapon', 'Protection from Energy'], 7: ['Fabricate', 'Wall of Fire'], 9: ['Animate Objects', 'Creation'] },
    features: [
      [1, 'Bonus Proficiencies', "Heavy armor and smith's tools."],
      [1, 'Blessing of the Forge', 'At the end of a long rest, touch one nonmagical suit of armor or shield (+1 AC) or simple/martial weapon (+1 to attack and damage) until your next long rest. Set the item\'s Bonus to 1 in Equipment to apply it.'],
      [2, "Channel Divinity: Artisan's Blessing", '1-hour ritual: create a simple metal item worth up to 100 gp (melting down metal of equal value).'],
      [6, 'Soul of the Forge', 'Resistance to fire damage; +1 AC while wearing heavy armor.', { resist: ['fire'], acBonusHeavy: 1 }],
      [8, 'Divine Strike', 'Once per turn, weapon hits deal +1d8 fire (2d8 at 14th).'],
      [17, 'Saint of Forge and Fire', 'Immune to fire damage. While wearing heavy armor, resistance to nonmagical bludgeoning, piercing and slashing.', { resist: ['fire (immune)'] }]
    ]
  });
})(window.DB);
