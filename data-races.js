// Races. Trait text is summarized. fx keys are read by the rules engine (see engine.js).
(function (DB) {
  DB.RACES = [
    {
      id: 'dwarf', name: 'Dwarf', src: 'PHB', size: 'Medium', speed: 25, asi: { CON: 2 }, languages: ['Common', 'Dwarvish'],
      darkvision: 60, resist: ['poison'], weapons: ['Battleaxe', 'Handaxe', 'Light hammer', 'Warhammer'],
      choices: [{ id: 'tool', label: 'Tool proficiency', type: 'tool', n: 1, from: ["Smith's tools", "Brewer's supplies", "Mason's tools"] }],
      traits: [
        ['Darkvision', 'See 60 ft in dim light as bright, darkness as dim (no color).'],
        ['Dwarven Resilience', 'Advantage on saves vs poison; resistance to poison damage.'],
        ['Dwarven Combat Training', 'Proficient with battleaxe, handaxe, light hammer and warhammer.'],
        ['Stonecunning', 'Double proficiency on History checks about stonework.'],
        ['Speed', 'Speed is not reduced by heavy armor.']
      ],
      subraces: [
        { id: 'hill', name: 'Hill Dwarf', asi: { WIS: 1 }, fx: { hpPerLevel: 1 }, traits: [['Dwarven Toughness', '+1 HP max per level.']] },
        { id: 'mountain', name: 'Mountain Dwarf', asi: { STR: 2 }, armor: ['Light armor', 'Medium armor'], traits: [['Dwarven Armor Training', 'Proficient with light and medium armor.']] }
      ]
    },
    {
      id: 'elf', name: 'Elf', src: 'PHB', size: 'Medium', speed: 30, asi: { DEX: 2 }, languages: ['Common', 'Elvish'],
      darkvision: 60, skills: ['Perception'],
      traits: [
        ['Darkvision', '60 ft.'],
        ['Keen Senses', 'Proficiency in Perception.'],
        ['Fey Ancestry', 'Advantage on saves vs charmed; magic can\'t put you to sleep.'],
        ['Trance', '4 hours of meditation counts as a long rest\'s sleep.']
      ],
      subraces: [
        {
          id: 'high', name: 'High Elf', asi: { INT: 1 }, weapons: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
          choices: [
            { id: 'cantrip', label: 'Wizard cantrip (INT)', type: 'spell', n: 1, spellLvl: 0, list: 'W' },
            { id: 'lang', label: 'Extra language', type: 'language', n: 1 }
          ],
          traits: [['Elf Weapon Training', 'Longsword, shortsword, shortbow, longbow.'], ['Cantrip', 'One wizard cantrip (INT).'], ['Extra Language', 'One extra language.']]
        },
        {
          id: 'wood', name: 'Wood Elf', asi: { WIS: 1 }, speed: 35, weapons: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'],
          traits: [['Elf Weapon Training', 'Longsword, shortsword, shortbow, longbow.'], ['Fleet of Foot', 'Base speed 35 ft.'], ['Mask of the Wild', 'Can try to hide when lightly obscured by nature.']]
        },
        {
          id: 'drow', name: 'Drow (Dark Elf)', asi: { CHA: 1 }, darkvision: 120, weapons: ['Rapier', 'Shortsword', 'Hand crossbow'],
          grantedSpells: [{ name: 'Dancing Lights', at: 1 }, { name: 'Faerie Fire', at: 3, note: '1/long rest' }, { name: 'Darkness', at: 5, note: '1/long rest' }], spellAbil: 'CHA',
          traits: [['Superior Darkvision', '120 ft.'], ['Sunlight Sensitivity', 'Disadvantage on attacks and sight-based Perception in direct sunlight.'],
            ['Drow Magic', 'Dancing lights; faerie fire at 3rd; darkness at 5th (1/long rest each, CHA).'], ['Drow Weapon Training', 'Rapier, shortsword, hand crossbow.']]
        }
      ]
    },
    {
      id: 'halfling', name: 'Halfling', src: 'PHB', size: 'Small', speed: 25, asi: { DEX: 2 }, languages: ['Common', 'Halfling'],
      traits: [['Lucky', 'Reroll a natural 1 on an attack, check or save.'], ['Brave', 'Advantage on saves vs frightened.'], ['Halfling Nimbleness', 'Move through the space of any larger creature.']],
      subraces: [
        { id: 'lightfoot', name: 'Lightfoot', asi: { CHA: 1 }, traits: [['Naturally Stealthy', 'Can hide behind a creature at least one size larger.']] },
        { id: 'stout', name: 'Stout', asi: { CON: 1 }, resist: ['poison'], traits: [['Stout Resilience', 'Advantage on saves vs poison; resistance to poison damage.']] }
      ]
    },
    {
      id: 'human', name: 'Human', src: 'PHB', size: 'Medium', speed: 30, asi: {}, languages: ['Common'],
      traits: [],
      subraces: [
        {
          id: 'standard', name: 'Human', asi: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
          choices: [{ id: 'lang', label: 'Extra language', type: 'language', n: 1 }],
          traits: [['Ability Score Increase', '+1 to every ability score.']]
        },
        {
          id: 'variant', name: 'Variant Human', asi: {},
          choices: [
            { id: 'asi', label: '+1 to two different abilities', type: 'ability', n: 2 },
            { id: 'skill', label: 'Skill proficiency', type: 'skill', n: 1 },
            { id: 'feat', label: 'Feat', type: 'feat', n: 1 },
            { id: 'lang', label: 'Extra language', type: 'language', n: 1 }
          ],
          traits: [['Variant Human', '+1 to two abilities, one skill, one feat.']]
        }
      ]
    },
    {
      id: 'dragonborn', name: 'Dragonborn', src: 'PHB', size: 'Medium', speed: 30, asi: { STR: 2, CHA: 1 }, languages: ['Common', 'Draconic'],
      choices: [{ id: 'ancestry', label: 'Draconic ancestry', type: 'list', n: 1, opts: 'dragonColor' }],
      traits: [
        ['Draconic Ancestry', 'Pick a dragon type; it sets breath weapon damage/area and your resistance.'],
        ['Breath Weapon', 'Action: area per ancestry, save DC 8 + CON mod + prof. 2d6 (3d6 at 6th, 4d6 at 11th, 5d6 at 16th), half on save. Once per short/long rest.'],
        ['Damage Resistance', 'Resistance to your ancestry damage type.']
      ],
      subraces: []
    },
    {
      id: 'gnome', name: 'Gnome', src: 'PHB', size: 'Small', speed: 25, asi: { INT: 2 }, languages: ['Common', 'Gnomish'], darkvision: 60,
      traits: [['Darkvision', '60 ft.'], ['Gnome Cunning', 'Advantage on INT, WIS and CHA saves vs magic.']],
      subraces: [
        {
          id: 'forest', name: 'Forest Gnome', asi: { DEX: 1 }, grantedSpells: [{ name: 'Minor Illusion', at: 1 }], spellAbil: 'INT',
          traits: [['Natural Illusionist', 'Know minor illusion (INT).'], ['Speak with Small Beasts', 'Communicate simple ideas with Small or smaller beasts.']]
        },
        {
          id: 'rock', name: 'Rock Gnome', asi: { CON: 1 }, tools: ["Tinker's tools"],
          traits: [['Artificer\'s Lore', 'Double proficiency on History checks about magic items, alchemy or tech.'], ['Tinker', 'Tinker\'s tools proficiency; build tiny clockwork devices.']]
        }
      ]
    },
    {
      id: 'halfelf', name: 'Half-Elf', src: 'PHB', size: 'Medium', speed: 30, asi: { CHA: 2 }, languages: ['Common', 'Elvish'], darkvision: 60,
      choices: [
        { id: 'asi', label: '+1 to two abilities (not CHA)', type: 'ability', n: 2, exclude: ['CHA'] },
        { id: 'skills', label: 'Skill Versatility (2 skills)', type: 'skill', n: 2 },
        { id: 'lang', label: 'Extra language', type: 'language', n: 1 }
      ],
      traits: [['Darkvision', '60 ft.'], ['Fey Ancestry', 'Advantage on saves vs charmed; magic can\'t put you to sleep.'], ['Skill Versatility', 'Two skill proficiencies of your choice.']],
      subraces: []
    },
    {
      id: 'halforc', name: 'Half-Orc', src: 'PHB', size: 'Medium', speed: 30, asi: { STR: 2, CON: 1 }, languages: ['Common', 'Orc'], darkvision: 60,
      skills: ['Intimidation'],
      traits: [['Darkvision', '60 ft.'], ['Menacing', 'Proficiency in Intimidation.'], ['Relentless Endurance', 'Drop to 1 HP instead of 0 once per long rest.'], ['Savage Attacks', 'On a melee weapon crit, roll one weapon damage die an extra time.']],
      subraces: []
    },
    {
      id: 'tiefling', name: 'Tiefling', src: 'PHB', size: 'Medium', speed: 30, asi: { CHA: 2, INT: 1 }, languages: ['Common', 'Infernal'], darkvision: 60,
      resist: ['fire'], grantedSpells: [{ name: 'Thaumaturgy', at: 1 }, { name: 'Hellish Rebuke', at: 3, note: '1/long rest, as 2nd level' }, { name: 'Darkness', at: 5, note: '1/long rest' }], spellAbil: 'CHA',
      traits: [['Darkvision', '60 ft.'], ['Hellish Resistance', 'Resistance to fire damage.'], ['Infernal Legacy', 'Thaumaturgy; hellish rebuke (as 2nd level) at 3rd; darkness at 5th; each 1/long rest (CHA).']],
      subraces: []
    },
    // ---------- Other official books (2014-era versions) ----------
    {
      id: 'goliath', name: 'Goliath', src: 'VGM', srcNote: "Volo's Guide to Monsters (2016)", size: 'Medium', speed: 30, asi: { STR: 2, CON: 1 },
      languages: ['Common', 'Giant'], skills: ['Athletics'],
      traits: [
        ['Natural Athlete', 'Proficiency in Athletics.'],
        ["Stone's Endurance", 'Reaction when you take damage: roll 1d12 + CON mod and reduce the damage by that much. Once per short or long rest.'],
        ['Powerful Build', 'Count as one size larger for carrying capacity and push/drag/lift.'],
        ['Mountain Born', 'Acclimated to high altitude (above 20,000 ft) and naturally adapted to cold climates.']
      ],
      subraces: []
    },
    {
      id: 'warforged', name: 'Warforged', src: 'ERLW', srcNote: 'Eberron: Rising from the Last War (2019)', size: 'Medium', speed: 30, asi: { CON: 2 },
      languages: ['Common'], resist: ['poison'], fx: { acBonus: 1 },
      choices: [
        { id: 'asi', label: '+1 to one ability (not CON)', type: 'ability', n: 1, exclude: ['CON'] },
        { id: 'skill', label: 'Specialized Design: skill', type: 'skill', n: 1 },
        { id: 'tool', label: 'Specialized Design: tool', type: 'tool', n: 1 },
        { id: 'lang', label: 'Extra language', type: 'language', n: 1 }
      ],
      traits: [
        ['Constructed Resilience', 'Advantage on saves vs poison; resistance to poison damage; immune to disease; no need to eat, drink or breathe; magic can\'t put you to sleep.'],
        ["Sentry's Rest", 'A long rest is 6 hours of motionless inactivity, during which you stay conscious and aware.'],
        ['Integrated Protection', '+1 AC. Armor you wear is integrated into your body (1 hour to don or doff) and can\'t be removed against your will.'],
        ['Specialized Design', 'One skill and one tool proficiency of your choice.']
      ],
      subraces: []
    },
    {
      id: 'dhampir', name: 'Dhampir', src: 'VRGR', srcNote: "Van Richten's Guide to Ravenloft (2021)", size: 'Medium or Small', speed: 35, asi: {},
      darkvision: 60, languages: ['Common'],
      fx: { extraAttack: { name: 'Vampiric Bite', die: '1d4', type: 'piercing', abil: 'CON', notes: 'Advantage if you have half HP or less. On a hit, PB times per long rest: heal the damage dealt or add it to your next check/attack.' } },
      choices: [{ id: 'lang', label: 'Extra language', type: 'language', n: 1 }],
      traits: [
        ['Ability Scores', 'Flexible: +2 to one and +1 to another, or +1 to three (pick the version below).'],
        ['Size', 'Medium or Small (your choice; note it in Notes).'],
        ['Speed', 'Walking speed 35 ft, and a climbing speed equal to your walking speed.'],
        ['Darkvision', '60 ft.'],
        ['Ancestral Legacy', 'Optionally keep skill proficiencies and climb/fly/swim speeds from a previous race instead of this race\'s languages and Spider Climb (agree with your DM).'],
        ['Deathless Nature', 'You don\'t need to breathe.'],
        ['Spider Climb', 'Climbing speed equal to walking speed; from 3rd level, move up, down and across vertical surfaces and upside down along ceilings with your hands free.'],
        ['Vampiric Bite', 'Unarmed bite: 1d4 + CON piercing, with advantage when you have half your HP or less. When you hit a creature that isn\'t a construct or undead, prof-bonus times per long rest you can heal HP equal to the piercing damage dealt, or add that amount to your next ability check or attack roll.']
      ],
      subraces: [
        { id: 'asi21', name: 'Dhampir (+2 / +1)', choices: [{ id: 'asi2', label: '+2 to one ability', type: 'ability', n: 1, amt: 2 }, { id: 'asi1', label: '+1 to a different ability', type: 'ability', n: 1 }] },
        { id: 'asi111', name: 'Dhampir (+1 / +1 / +1)', choices: [{ id: 'asi', label: '+1 to three different abilities', type: 'ability', n: 3 }] }
      ]
    },
    // ---------- Homebrew ----------
    {
      id: 'bearkin', name: 'Bearkin', src: 'HB', srcNote: 'dandwiki.com Bearkin (5e Race)', size: 'Medium', speed: 30, asi: { STR: 2 },
      languages: ['Common', 'Bearic'], skills: ['Survival'], unarmed: { die: '1d4', type: 'slashing', name: 'Claws' },
      traits: [
        ['Age', 'Adolescent around the same age as humans; live about 60 years.'],
        ['Keen Smell', 'Advantage on Perception checks that rely on smell.'],
        ['Animal Instincts', 'Proficiency in Survival.'],
        ['Claws', 'Unarmed strikes deal 1d4 slashing.'],
        ['Languages', 'Common and Bearic (a spoken language of growls and barks with no script).']
      ],
      subraces: [
        { id: 'black', name: 'Black Bear', asi: { WIS: 1 }, darkvision: 60, skills: ['Stealth'], traits: [['Darkvision', '60 ft.'], ['Black Bear', 'Proficiency in Stealth.']] },
        { id: 'brown', name: 'Brown Bear', asi: { CHA: 1 }, traits: [['Protector', 'When an ally within 10 ft must make a STR save, you can take the effect in their place. Twice per short rest.']] },
        { id: 'polar', name: 'Polar Bear', asi: { CON: 1 }, resist: ['cold'], traits: [['Polar Bear', 'Resistance to cold damage; adapted to extreme cold and snow.']] },
        {
          id: 'panda', name: 'Panda Bear', asi: { WIS: 1 }, skills: ['Medicine'], grantedSpells: [{ name: 'Speak with Plants', at: 1, note: '1/long rest' }], spellAbil: 'WIS',
          traits: [['Panda Bear', 'Proficiency in Medicine.'], ['Spiritual Communication', 'Cast speak with plants once per long rest (WIS).']]
        },
        {
          id: 'instinct', name: 'Creature of Instinct (Barbarian only)', asi: { INT: -1 },
          traits: [['Creature of Instinct', 'Barbarian-only variant. INT -1.'], ['Raging Bear', 'While raging with no armor: claws deal 1d6 and you can make one extra unarmed strike as a bonus action (doesn\'t stack with monk features).']]
        }
      ]
    }
  ];
})(window.DB);
