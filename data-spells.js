// PHB 2014 spells. Format: Name|Level|School|Classes|Cast time|Range|Components|Duration|Flags|Summary
// Classes: B=Bard C=Cleric D=Druid P=Paladin R=Ranger S=Sorcerer K=Warlock W=Wizard. Flags: C=concentration, R=ritual.
// Summaries are short paraphrases for quick reference, not the full rules text.
(function (DB) {
  var RAW = `
Acid Splash|0|Con|SW|1 action|60 ft|V,S|Instant||1-2 creatures within 5 ft of each other: DEX save or 1d6 acid. Scales at 5/11/17.
Blade Ward|0|Abj|BSKW|1 action|Self|V,S|1 round||Resistance to bludgeoning, piercing and slashing from weapon attacks until end of your next turn.
Chill Touch|0|Nec|SKW|1 action|120 ft|V,S|1 round||Ranged spell attack, 1d8 necrotic; target can't regain HP; undead have disadvantage attacking you. Scales.
Dancing Lights|0|Evo|BSW|1 action|120 ft|V,S,M|1 minute|C|Up to four torch-like lights you can move 60 ft as a bonus action.
Druidcraft|0|Tra|D|1 action|30 ft|V,S|Instant||Minor nature effects: predict weather, bloom a flower, sensory effect, light/snuff a small flame.
Eldritch Blast|0|Evo|K|1 action|120 ft|V,S|Instant||Ranged spell attack, 1d10 force. Extra beams at 5th, 11th and 17th level.
Fire Bolt|0|Evo|SW|1 action|120 ft|V,S|Instant||Ranged spell attack, 1d10 fire; ignites unattended flammable objects. Scales.
Friends|0|Enc|BSKW|1 action|Self|S,M|1 minute|C|Advantage on CHA checks vs one non-hostile creature; it knows afterwards.
Guidance|0|Div|CD|1 action|Touch|V,S|1 minute|C|Target adds 1d4 to one ability check.
Light|0|Evo|BCSW|1 action|Touch|V,M|1 hour||Object sheds bright light 20 ft and dim light 20 ft more.
Mage Hand|0|Con|BSKW|1 action|30 ft|V,S|1 minute||Spectral hand manipulates objects up to 10 lb.
Mending|0|Tra|BCDSW|1 minute|Touch|V,S,M|Instant||Repairs a single break or tear in an object.
Message|0|Tra|BSW|1 action|120 ft|V,S,M|1 round||Whisper a message to a creature; it can whisper a reply.
Minor Illusion|0|Ill|BSKW|1 action|30 ft|S,M|1 minute||Create a sound or an image of an object (5 ft cube). INT (Investigation) reveals it.
Poison Spray|0|Con|DSKW|1 action|10 ft|V,S|Instant||CON save or 1d12 poison. Scales.
Prestidigitation|0|Tra|BSKW|1 action|10 ft|V,S|Up to 1 hour||Minor magical tricks: sparks, clean, chill/warm, flavor, mark, small trinket.
Produce Flame|0|Con|D|1 action|Self|V,S|10 minutes||Flame in your hand gives light; throw it as a ranged spell attack for 1d8 fire. Scales.
Ray of Frost|0|Evo|SW|1 action|60 ft|V,S|Instant||Ranged spell attack, 1d8 cold and -10 ft speed. Scales.
Resistance|0|Abj|CD|1 action|Touch|V,S,M|1 minute|C|Target adds 1d4 to one saving throw.
Sacred Flame|0|Evo|C|1 action|60 ft|V,S|Instant||DEX save (no cover bonus) or 1d8 radiant. Scales.
Shillelagh|0|Tra|D|1 bonus action|Touch|V,S,M|1 minute||Club or quarterstaff uses your spellcasting ability, damage die d8, counts as magical.
Shocking Grasp|0|Evo|SW|1 action|Touch|V,S|Instant||Melee spell attack (advantage vs metal armor), 1d8 lightning, target can't take reactions. Scales.
Spare the Dying|0|Nec|C|1 action|Touch|V,S|Instant||Stabilize a creature at 0 HP.
Thaumaturgy|0|Tra|C|1 action|30 ft|V|Up to 1 minute||Minor wonders: booming voice, flickering flames, tremors, sounds, doors, eyes.
Thorn Whip|0|Tra|D|1 action|30 ft|V,S,M|Instant||Melee spell attack, 1d6 piercing, pull Large or smaller target 10 ft closer. Scales.
True Strike|0|Div|BSKW|1 action|30 ft|S|1 round|C|Advantage on your first attack roll against the target next turn.
Vicious Mockery|0|Enc|B|1 action|60 ft|V|Instant||WIS save or 1d4 psychic and disadvantage on its next attack. Scales.
Alarm|1|Abj|RW|1 minute|30 ft|V,S,M|8 hours|R|Ward a door, window or 20 ft cube; alerts you mentally or audibly when entered.
Animal Friendship|1|Enc|BDR|1 action|30 ft|V,S,M|24 hours||Beast with INT 3 or lower makes a WIS save or is charmed.
Armor of Agathys|1|Abj|K|1 action|Self|V,S,M|1 hour||Gain 5 temp HP; melee attackers take 5 cold while it lasts. +5 per slot level.
Arms of Hadar|1|Con|K|1 action|Self (10 ft)|V,S|Instant||STR save or 2d6 necrotic and no reactions; half on save. +1d6/slot.
Bane|1|Enc|BC|1 action|30 ft|V,S,M|1 minute|C|Up to 3 creatures (CHA save) subtract 1d4 from attacks and saves. +1 target/slot.
Bless|1|Enc|CP|1 action|30 ft|V,S,M|1 minute|C|Up to 3 creatures add 1d4 to attacks and saves. +1 target/slot.
Burning Hands|1|Evo|SW|1 action|Self (15 ft cone)|V,S|Instant||DEX save, 3d6 fire, half on save. +1d6/slot.
Charm Person|1|Enc|BDSKW|1 action|30 ft|V,S|1 hour||Humanoid makes a WIS save (advantage if fighting you) or is charmed. +1 target/slot.
Chromatic Orb|1|Evo|SW|1 action|90 ft|V,S,M|Instant||Ranged spell attack, 3d8 acid/cold/fire/lightning/poison/thunder. +1d8/slot.
Color Spray|1|Ill|SW|1 action|Self (15 ft cone)|V,S,M|1 round||Blind 6d10 HP of creatures, lowest HP first. +2d10/slot.
Command|1|Enc|CP|1 action|60 ft|V|1 round||One-word command (approach, drop, flee, grovel, halt); WIS save. +1 target/slot.
Compelled Duel|1|Enc|P|1 bonus action|30 ft|V|1 minute|C|WIS save or target has disadvantage attacking others and can't willingly move away from you.
Comprehend Languages|1|Div|BSKW|1 action|Self|V,S,M|1 hour|R|Understand any spoken language and read any written one you touch.
Create or Destroy Water|1|Tra|CD|1 action|30 ft|V,S,M|Instant||Create or destroy up to 10 gallons of water. +10 gallons/slot.
Cure Wounds|1|Evo|BCDPR|1 action|Touch|V,S|Instant||Heal 1d8 + spellcasting mod. +1d8/slot.
Detect Evil and Good|1|Div|CP|1 action|Self|V,S|10 minutes|C|Sense aberrations, celestials, elementals, fey, fiends and undead within 30 ft.
Detect Magic|1|Div|BCDPRSW|1 action|Self|V,S|10 minutes|C,R|Sense magic within 30 ft and see auras and schools.
Detect Poison and Disease|1|Div|CDPR|1 action|Self|V,S,M|10 minutes|C,R|Sense poisons, poisonous creatures and diseases within 30 ft.
Disguise Self|1|Ill|BSW|1 action|Self|V,S|1 hour||Change your appearance, including clothes and gear.
Dissonant Whispers|1|Enc|B|1 action|60 ft|V|Instant||WIS save or 3d6 psychic and must use its reaction to move away; half on save. +1d6/slot.
Divine Favor|1|Evo|P|1 bonus action|Self|V,S|1 minute|C|Your weapon attacks deal +1d4 radiant.
Ensnaring Strike|1|Con|R|1 bonus action|Self|V|1 minute|C|Next weapon hit: STR save or restrained by vines, 1d6 piercing each turn. +1d6/slot.
Entangle|1|Con|D|1 action|90 ft|V,S|1 minute|C|20 ft square of grasping plants: STR save or restrained; difficult terrain.
Expeditious Retreat|1|Tra|SKW|1 bonus action|Self|V,S|10 minutes|C|Dash as a bonus action each turn.
Faerie Fire|1|Evo|BD|1 action|60 ft|V|1 minute|C|20 ft cube: DEX save or outlined in light; attacks against them have advantage, no invisibility.
False Life|1|Nec|SW|1 action|Self|V,S,M|1 hour||Gain 1d4 + 4 temp HP. +5/slot.
Feather Fall|1|Tra|BSW|1 reaction|60 ft|V,M|1 minute||Up to five falling creatures descend at 60 ft per round, no falling damage.
Find Familiar|1|Con|W|1 hour|10 ft|V,S,M|Instant|R|Gain a spirit familiar in animal form; see/hear through it; deliver touch spells.
Fog Cloud|1|Con|DRSW|1 action|120 ft|V,S|1 hour|C|20 ft radius heavily obscured sphere. +20 ft radius/slot.
Goodberry|1|Tra|DR|1 action|Touch|V,S,M|Instant||Up to ten berries, each heals 1 HP and feeds for a day.
Grease|1|Con|W|1 action|60 ft|V,S,M|1 minute||10 ft square difficult terrain; DEX save or prone.
Guiding Bolt|1|Evo|C|1 action|120 ft|V,S|1 round||Ranged spell attack, 4d6 radiant; next attack on target has advantage. +1d6/slot.
Hail of Thorns|1|Con|R|1 bonus action|Self|V|1 minute|C|Next ranged weapon hit: 1d10 piercing to creatures within 5 ft of target (DEX half). +1d10/slot.
Healing Word|1|Evo|BCD|1 bonus action|60 ft|V|Instant||Heal 1d4 + spellcasting mod. +1d4/slot.
Hellish Rebuke|1|Evo|K|1 reaction|60 ft|V,S|Instant||When damaged: attacker takes 2d10 fire, DEX half. +1d10/slot.
Heroism|1|Enc|BP|1 action|Touch|V,S|1 minute|C|Immune to frightened; gain temp HP = spellcasting mod each turn. +1 target/slot.
Hex|1|Enc|K|1 bonus action|90 ft|V,S,M|1 hour|C|Your hits deal +1d6 necrotic to the target; disadvantage on checks of one ability. Longer with higher slots.
Hunter's Mark|1|Div|R|1 bonus action|90 ft|V|1 hour|C|Your weapon hits deal +1d6 to the marked target; advantage to track it. Move mark on its death. Longer with higher slots.
Identify|1|Div|BW|1 minute|Touch|V,S,M|Instant|R|Learn a magic item's properties or spells affecting a creature/object.
Illusory Script|1|Ill|BKW|1 minute|Touch|S,M|10 days|R|Write a message only chosen creatures can read.
Inflict Wounds|1|Nec|C|1 action|Touch|V,S|Instant||Melee spell attack, 3d10 necrotic. +1d10/slot.
Jump|1|Tra|DRSW|1 action|Touch|V,S,M|1 minute||Triple the target's jump distance.
Longstrider|1|Tra|BDRW|1 action|Touch|V,S,M|1 hour||+10 ft speed. +1 target/slot.
Mage Armor|1|Abj|SW|1 action|Touch|V,S,M|8 hours||Unarmored target's base AC becomes 13 + DEX.
Magic Missile|1|Evo|SW|1 action|120 ft|V,S|Instant||Three darts, each auto-hits for 1d4 + 1 force. +1 dart/slot.
Protection from Evil and Good|1|Abj|CPKW|1 action|Touch|V,S,M|10 minutes|C|Aberrations, celestials, elementals, fey, fiends, undead have disadvantage attacking target; can't charm/frighten/possess it.
Purify Food and Drink|1|Tra|CDP|1 action|10 ft|V,S|Instant|R|Remove poison and disease from food and drink in a 5 ft sphere.
Ray of Sickness|1|Nec|SW|1 action|60 ft|V,S|Instant||Ranged spell attack, 2d8 poison; CON save or poisoned. +1d8/slot.
Sanctuary|1|Abj|C|1 bonus action|30 ft|V,S,M|1 minute||Attackers must make a WIS save or pick a new target; ends if the warded creature attacks.
Searing Smite|1|Evo|P|1 bonus action|Self|V|1 minute|C|Next melee hit: +1d6 fire and target ignites (1d6/turn, CON save ends). +1d6/slot.
Shield|1|Abj|SW|1 reaction|Self|V,S|1 round||+5 AC until your next turn, including the triggering attack; immune to magic missile.
Shield of Faith|1|Abj|CP|1 bonus action|60 ft|V,S,M|10 minutes|C|+2 AC to one creature.
Silent Image|1|Ill|BSW|1 action|60 ft|V,S,M|10 minutes|C|Visual illusion up to a 15 ft cube; move it with your action.
Sleep|1|Enc|BSW|1 action|90 ft|V,S,M|1 minute||5d8 HP of creatures fall asleep, lowest HP first. +2d8/slot.
Speak with Animals|1|Div|BDR|1 action|Self|V,S|10 minutes|R|Communicate with beasts.
Tasha's Hideous Laughter|1|Enc|BW|1 action|30 ft|V,S,M|1 minute|C|WIS save or prone and incapacitated with laughter; repeats save.
Tenser's Floating Disk|1|Con|W|1 action|30 ft|V,S,M|1 hour|R|Floating disk carries up to 500 lb and follows you.
Thunderous Smite|1|Evo|P|1 bonus action|Self|V|1 minute|C|Next melee hit: +2d6 thunder; STR save or pushed 10 ft and prone.
Thunderwave|1|Evo|BDSW|1 action|Self (15 ft cube)|V,S|Instant||CON save, 2d8 thunder and pushed 10 ft; half and no push on save. +1d8/slot.
Unseen Servant|1|Con|BKW|1 action|60 ft|V,S,M|1 hour|R|Invisible force performs simple tasks.
Witch Bolt|1|Evo|SKW|1 action|30 ft|V,S,M|1 minute|C|Ranged spell attack, 1d12 lightning; action each turn for another 1d12 automatically. +1d12/slot.
Wrathful Smite|1|Evo|P|1 bonus action|Self|V|1 minute|C|Next melee hit: +1d6 psychic; WIS save or frightened.
Aid|2|Abj|CP|1 action|30 ft|V,S,M|8 hours||Up to three creatures gain +5 current and max HP. +5/slot.
Alter Self|2|Tra|SW|1 action|Self|V,S|1 hour|C|Aquatic adaptation, change appearance, or natural weapons (1d6, magical).
Animal Messenger|2|Enc|BDR|1 action|30 ft|V,S,M|24 hours|R|Tiny beast carries a 25-word message to a location.
Arcane Lock|2|Abj|W|1 action|Touch|V,S,M|Until dispelled||Magically lock a door/container; you set a password.
Augury|2|Div|C|1 minute|Self|V,S,M|Instant|R|Omen (weal, woe, both, nothing) about a plan within 30 minutes.
Barkskin|2|Tra|DR|1 action|Touch|V,S,M|1 hour|C|Target's AC can't be lower than 16.
Beast Sense|2|Div|DR|1 action|Touch|S|1 hour|C,R|Perceive through a willing beast's senses.
Blindness/Deafness|2|Nec|BCSW|1 action|30 ft|V|1 minute||CON save or blinded or deafened; repeats save each turn. +1 target/slot.
Blur|2|Ill|SW|1 action|Self|V|1 minute|C|Attacks against you have disadvantage (unless attacker doesn't rely on sight).
Branding Smite|2|Evo|P|1 bonus action|Self|V|1 minute|C|Next weapon hit: +2d6 radiant and target can't be invisible. +1d6/slot.
Calm Emotions|2|Enc|BC|1 action|60 ft|V,S|1 minute|C|20 ft sphere: CHA save or suppress charm/fear, or make hostile creatures indifferent.
Cloud of Daggers|2|Con|BSKW|1 action|60 ft|V,S,M|1 minute|C|5 ft cube; 4d4 slashing to creatures entering or starting there. +2d4/slot.
Continual Flame|2|Evo|CW|1 action|Touch|V,S,M|Until dispelled||Permanent heatless torch-like flame.
Cordon of Arrows|2|Tra|R|1 action|5 ft|V,S,M|8 hours||Plant ammo that fires at creatures entering 30 ft (DEX save, 1d6 piercing).
Crown of Madness|2|Enc|BSKW|1 action|120 ft|V,S|1 minute|C|WIS save or charmed; must attack a creature you choose.
Darkness|2|Evo|SKW|1 action|60 ft|V,M|10 minutes|C|15 ft sphere of magical darkness; darkvision can't see through.
Darkvision|2|Tra|DRSW|1 action|Touch|V,S,M|8 hours||Target gains 60 ft darkvision.
Detect Thoughts|2|Div|BSW|1 action|Self|V,S,M|1 minute|C|Read surface thoughts; probe deeper (WIS save).
Enhance Ability|2|Tra|BCDS|1 action|Touch|V,S,M|1 hour|C|Advantage on checks with one ability (plus a minor extra effect). +1 target/slot.
Enlarge/Reduce|2|Tra|SW|1 action|30 ft|V,S,M|1 minute|C|Grow (+1d4 weapon damage, adv STR) or shrink (-1d4, disadv STR); CON save if unwilling.
Enthrall|2|Enc|BK|1 action|60 ft|V,S|1 minute||WIS save or disadvantage on Perception to notice others.
Find Steed|2|Con|P|10 minutes|30 ft|V,S|Instant||Summon a loyal spirit steed (warhorse, pony, camel, elk or mastiff); share self-target spells.
Find Traps|2|Div|CDR|1 action|120 ft|V,S|Instant||Sense the presence of traps in line of sight.
Flame Blade|2|Evo|D|1 bonus action|Self|V,S,M|10 minutes|C|Fiery blade; melee spell attack 3d6 fire. +1d6 per two slot levels.
Flaming Sphere|2|Con|DW|1 action|60 ft|V,S,M|1 minute|C|5 ft fire ball; 2d6 fire (DEX half) when it rams or creatures end turns next to it. +1d6/slot.
Gentle Repose|2|Nec|CW|1 action|Touch|V,S,M|10 days|R|Corpse doesn't decay or become undead.
Gust of Wind|2|Evo|DSW|1 action|Self (60 ft line)|V,S,M|1 minute|C|Strong wind line: STR save or pushed 15 ft; disperses gas.
Heat Metal|2|Tra|BD|1 action|60 ft|V,S,M|1 minute|C|Metal object glows: 2d8 fire to anyone touching it each turn. +1d8/slot.
Hold Person|2|Enc|BCDSKW|1 action|60 ft|V,S,M|1 minute|C|Humanoid makes a WIS save or is paralyzed. +1 target/slot.
Invisibility|2|Ill|BSKW|1 action|Touch|V,S,M|1 hour|C|Target is invisible until it attacks or casts a spell. +1 target/slot.
Knock|2|Tra|BSW|1 action|60 ft|V|Instant||Unlock an object; loud knock audible 300 ft.
Lesser Restoration|2|Abj|BCDPR|1 action|Touch|V,S|Instant||End one disease or blinded, deafened, paralyzed or poisoned.
Levitate|2|Tra|SW|1 action|60 ft|V,S,M|10 minutes|C|Target rises up to 20 ft and hovers (CON save if unwilling).
Locate Animals or Plants|2|Div|BDR|1 action|Self|V,S,M|Instant|R|Learn direction and distance to a named beast or plant within 5 miles.
Locate Object|2|Div|BCDPRW|1 action|Self|V,S,M|10 minutes|C|Sense the direction of a known object within 1,000 ft.
Magic Mouth|2|Ill|BW|1 minute|30 ft|V,S,M|Until dispelled|R|Object speaks a message when triggered.
Magic Weapon|2|Tra|PW|1 bonus action|Touch|V,S|1 hour|C|Nonmagical weapon becomes +1 (+2 at 4th slot, +3 at 6th).
Melf's Acid Arrow|2|Evo|W|1 action|90 ft|V,S,M|Instant||Ranged spell attack, 4d4 acid + 2d4 next turn (half on miss). +1d4/slot.
Mirror Image|2|Ill|SKW|1 action|Self|V,S|1 minute||Three illusory duplicates may absorb attacks against you.
Misty Step|2|Con|SKW|1 bonus action|Self|V|Instant||Teleport up to 30 ft to a space you can see.
Moonbeam|2|Evo|D|1 action|120 ft|V,S,M|1 minute|C|5 ft radius beam: 2d10 radiant (CON half) on entering/starting; move it 60 ft as an action. +1d10/slot.
Nystul's Magic Aura|2|Ill|W|1 action|Touch|V,S,M|24 hours||Mask or falsify an object's or creature's magical aura.
Pass without Trace|2|Abj|DR|1 action|Self|V,S,M|1 hour|C|You and allies within 30 ft get +10 to Stealth and leave no tracks.
Phantasmal Force|2|Ill|BSW|1 action|60 ft|V,S,M|1 minute|C|INT save or the target perceives an illusion that can deal 1d6 psychic per turn.
Prayer of Healing|2|Evo|C|10 minutes|30 ft|V|Instant||Up to six creatures heal 2d8 + spellcasting mod. +1d8/slot.
Protection from Poison|2|Abj|CDPR|1 action|Touch|V,S|1 hour||Neutralize one poison; advantage vs poisoned and resistance to poison damage.
Ray of Enfeeblement|2|Nec|KW|1 action|60 ft|V,S|1 minute|C|Ranged spell attack; target deals half damage with STR weapon attacks (CON save each turn).
Rope Trick|2|Tra|W|1 action|Touch|V,S,M|1 hour||Rope leads to an extradimensional space for up to eight creatures.
Scorching Ray|2|Evo|SW|1 action|120 ft|V,S|Instant||Three rays, ranged spell attacks, 2d6 fire each. +1 ray/slot.
See Invisibility|2|Div|BSW|1 action|Self|V,S,M|1 hour||See invisible creatures and objects and into the Ethereal Plane.
Shatter|2|Evo|BSKW|1 action|60 ft|V,S,M|Instant||10 ft sphere, CON save, 3d8 thunder, half on save. +1d8/slot.
Silence|2|Ill|BCR|1 action|120 ft|V,S|10 minutes|C,R|20 ft sphere with no sound; no verbal spells; immune to thunder.
Spider Climb|2|Tra|SKW|1 action|Touch|V,S,M|1 hour|C|Climb walls and ceilings hands-free; climb speed equal to walk.
Spike Growth|2|Tra|DR|1 action|150 ft|V,S,M|10 minutes|C|20 ft radius difficult terrain; 2d4 piercing per 5 ft moved.
Spiritual Weapon|2|Evo|C|1 bonus action|60 ft|V,S|1 minute||Floating weapon: bonus action melee spell attack for 1d8 + mod force. +1d8 per two slot levels.
Suggestion|2|Enc|BSKW|1 action|30 ft|V,M|8 hours|C|WIS save or follow a reasonable-sounding suggestion.
Warding Bond|2|Abj|C|1 action|Touch|V,S,M|1 hour||Target gets +1 AC and saves and resistance to all damage; you take the same damage it does.
Web|2|Con|SW|1 action|60 ft|V,S,M|1 hour|C|20 ft cube of webs: difficult terrain, DEX save or restrained.
Zone of Truth|2|Enc|BCP|1 action|60 ft|V,S|10 minutes||15 ft sphere: CHA save or can't deliberately lie.
Animate Dead|3|Nec|CW|1 minute|10 ft|V,S,M|Instant||Create a skeleton or zombie servant; reassert control every 24 hours. +2 undead/slot.
Aura of Vitality|3|Evo|P|1 action|Self (30 ft)|V|1 minute|C|Bonus action each turn: heal one creature in the aura 2d6.
Beacon of Hope|3|Abj|C|1 action|30 ft|V,S|1 minute|C|Targets have advantage on WIS and death saves and get max healing.
Bestow Curse|3|Nec|BCW|1 action|Touch|V,S|1 minute|C|WIS save or cursed (disadvantage on one ability, extra 1d8 necrotic from you, etc.).
Blinding Smite|3|Evo|P|1 bonus action|Self|V|1 minute|C|Next melee hit: +3d8 radiant and CON save or blinded.
Blink|3|Tra|SW|1 action|Self|V,S|1 minute||End of each turn, 50% chance to vanish to the Ethereal Plane until your next turn.
Call Lightning|3|Con|D|1 action|120 ft|V,S|10 minutes|C|Storm cloud; action to call a bolt: 3d10 lightning in 5 ft radius (DEX half). +1d10/slot.
Clairvoyance|3|Div|BCSW|10 minutes|1 mile|V,S,M|10 minutes|C|Invisible sensor lets you see or hear a familiar location.
Conjure Animals|3|Con|DR|1 action|60 ft|V,S|1 hour|C|Summon fey spirits as beasts (e.g. one CR 2, two CR 1, four CR 1/2, eight CR 1/4).
Conjure Barrage|3|Con|R|1 action|Self (60 ft cone)|V,S,M|Instant||Throw a weapon/ammo: DEX save, 3d8 weapon-type damage, half on save.
Counterspell|3|Abj|SKW|1 reaction|60 ft|S|Instant||Interrupt a spell; automatic if 3rd level or lower, otherwise ability check DC 10 + spell level.
Create Food and Water|3|Con|CP|1 action|30 ft|V,S|Instant||Food and water for 15 humanoids or 5 steeds for a day.
Crusader's Mantle|3|Evo|P|1 action|Self (30 ft)|V|1 minute|C|Allies in the aura deal +1d4 radiant on weapon hits.
Daylight|3|Evo|CDPRS|1 action|60 ft|V,S|1 hour||60 ft sphere of bright light; dispels darkness of 3rd level or lower.
Dispel Magic|3|Abj|BCDPSKW|1 action|120 ft|V,S|Instant||End spells of 3rd level or lower; higher ones need a check DC 10 + spell level.
Elemental Weapon|3|Tra|P|1 action|Touch|V,S|1 hour|C|Weapon gets +1 to hit and +1d4 acid/cold/fire/lightning/thunder damage.
Fear|3|Ill|BSKW|1 action|Self (30 ft cone)|V,S,M|1 minute|C|WIS save or drop held items, frightened and must dash away.
Feign Death|3|Nec|BCDW|1 action|Touch|V,S,M|1 hour|R|Willing creature appears dead; resistant to all damage except psychic.
Fireball|3|Evo|SW|1 action|150 ft|V,S,M|Instant||20 ft radius explosion, DEX save, 8d6 fire, half on save. +1d6/slot.
Fly|3|Tra|SKW|1 action|Touch|V,S,M|10 minutes|C|Target gains 60 ft flying speed. +1 target/slot.
Gaseous Form|3|Tra|SKW|1 action|Touch|V,S,M|1 hour|C|Willing creature becomes a misty cloud with 10 ft fly speed.
Glyph of Warding|3|Abj|BCW|1 hour|Touch|V,S,M|Until triggered||Inscribe a glyph that explodes (5d8) or stores a spell when triggered.
Haste|3|Tra|SW|1 action|30 ft|V,S,M|1 minute|C|Double speed, +2 AC, advantage on DEX saves, extra limited action. Lethargy when it ends.
Hunger of Hadar|3|Con|K|1 action|150 ft|V,S,M|1 minute|C|20 ft sphere of darkness: 2d6 cold at turn start, 2d6 acid at turn end (DEX save).
Hypnotic Pattern|3|Ill|BSKW|1 action|120 ft|S,M|1 minute|C|30 ft cube: WIS save or charmed, incapacitated, speed 0.
Leomund's Tiny Hut|3|Evo|BW|1 minute|Self (10 ft)|V,S,M|8 hours|R|Dome shelter for up to nine creatures; blocks spells and creatures from outside.
Lightning Arrow|3|Tra|R|1 bonus action|Self|V,S|1 minute|C|Next ranged weapon attack becomes a lightning bolt: 4d8, plus 2d8 to creatures within 10 ft.
Lightning Bolt|3|Evo|SW|1 action|Self (100 ft line)|V,S,M|Instant||DEX save, 8d6 lightning, half on save. +1d6/slot.
Magic Circle|3|Abj|CPKW|1 minute|10 ft|V,S,M|1 hour||Cylinder that keeps a chosen creature type in or out.
Major Image|3|Ill|BSKW|1 action|120 ft|V,S,M|10 minutes|C|Illusion up to 20 ft cube with sound, smell and temperature.
Mass Healing Word|3|Evo|C|1 bonus action|60 ft|V|Instant||Up to six creatures heal 1d4 + spellcasting mod. +1d4/slot.
Meld into Stone|3|Tra|CD|1 action|Touch|V,S|8 hours|R|Merge yourself into a stone surface.
Nondetection|3|Abj|BRW|1 action|Touch|V,S,M|8 hours||Target can't be found by divination magic.
Phantom Steed|3|Ill|W|1 minute|30 ft|V,S|1 hour|R|Quasi-real horse with 100 ft speed.
Plant Growth|3|Tra|BDR|1 action or 8 hours|150 ft|V,S|Instant||Overgrowth (movement costs 4×) or enrich plants for a year.
Protection from Energy|3|Abj|CDRSW|1 action|Touch|V,S|1 hour|C|Resistance to one of acid, cold, fire, lightning or thunder.
Remove Curse|3|Abj|CPKW|1 action|Touch|V,S|Instant||End all curses on a creature or object.
Revivify|3|Nec|CP|1 action|Touch|V,S,M|Instant||Return a creature dead under 1 minute to life with 1 HP (300 gp diamonds).
Sending|3|Evo|BCW|1 action|Unlimited|V,S,M|1 round||Send a 25-word message to a known creature; it can reply.
Sleet Storm|3|Con|DSW|1 action|150 ft|V,S,M|1 minute|C|40 ft radius: difficult terrain, heavily obscured, DEX save or prone; breaks concentration.
Slow|3|Tra|SW|1 action|120 ft|V,S,M|1 minute|C|Up to six creatures (WIS save): half speed, -2 AC/DEX saves, limited actions.
Speak with Dead|3|Nec|BC|1 action|10 ft|V,S,M|10 minutes||A corpse answers up to five questions.
Speak with Plants|3|Tra|BDR|1 action|Self (30 ft)|V,S|10 minutes||Talk to and command plants in range.
Spirit Guardians|3|Con|C|1 action|Self (15 ft)|V,S,M|10 minutes|C|Spirits halve enemy speed; 3d8 radiant/necrotic on entering/starting (WIS half). +1d8/slot.
Stinking Cloud|3|Con|BSW|1 action|90 ft|V,S,M|1 minute|C|20 ft sphere: CON save or spend the turn retching.
Tongues|3|Div|BCSKW|1 action|Touch|V,M|1 hour||Target understands and is understood in any spoken language.
Vampiric Touch|3|Nec|KW|1 action|Self|V,S|1 minute|C|Melee spell attack each turn for 3d6 necrotic; heal half. +1d6/slot.
Water Breathing|3|Tra|DRSW|1 action|30 ft|V,S,M|24 hours|R|Up to ten creatures breathe underwater.
Water Walk|3|Tra|CDRS|1 action|30 ft|V,S,M|1 hour|R|Up to ten creatures walk on liquid surfaces.
Wind Wall|3|Evo|DR|1 action|120 ft|V,S,M|1 minute|C|Wall of wind: 3d8 bludgeoning (STR half), blocks arrows and gas.
Arcane Eye|4|Div|CW|1 action|30 ft|V,S,M|1 hour|C|Invisible floating eye with darkvision you can move and see through.
Aura of Life|4|Abj|P|1 action|Self (30 ft)|V|10 minutes|C|Allies resist necrotic, max HP can't be reduced; 0 HP allies regain 1 HP.
Aura of Purity|4|Abj|P|1 action|Self (30 ft)|V|10 minutes|C|Allies resist poison, can't be diseased, advantage vs many conditions.
Banishment|4|Abj|CPSKW|1 action|60 ft|V,S,M|1 minute|C|CHA save or banished to a harmless demiplane (or home plane if extraplanar). +1 target/slot.
Blight|4|Nec|DSKW|1 action|30 ft|V,S|Instant||CON save, 8d8 necrotic, half on save (plants worse). +1d8/slot.
Compulsion|4|Enc|B|1 action|30 ft|V,S|1 minute|C|WIS save or you can force targets to move in a direction you choose.
Confusion|4|Enc|BDSW|1 action|90 ft|V,S,M|1 minute|C|10 ft sphere: WIS save or act randomly. +5 ft radius/slot.
Conjure Minor Elementals|4|Con|DW|1 minute|90 ft|V,S|1 hour|C|Summon elementals (e.g. one CR 2, two CR 1, four CR 1/2, eight CR 1/4).
Conjure Woodland Beings|4|Con|DR|1 action|60 ft|V,S,M|1 hour|C|Summon fey (e.g. one CR 2 ... eight CR 1/4).
Control Water|4|Tra|CDW|1 action|300 ft|V,S,M|10 minutes|C|Flood, part, redirect or whirlpool water in a 100 ft cube.
Death Ward|4|Abj|CP|1 action|Touch|V,S|8 hours||First time the target drops to 0 HP, it drops to 1 instead.
Dimension Door|4|Con|BSKW|1 action|500 ft|V|Instant||Teleport yourself (and one adjacent willing creature) up to 500 ft.
Divination|4|Div|C|1 action|Self|V,S,M|Instant|R|Ask your god one question about the coming week.
Dominate Beast|4|Enc|DS|1 action|60 ft|V,S|1 minute|C|WIS save or the beast is charmed and obeys you. Longer with higher slots.
Evard's Black Tentacles|4|Con|W|1 action|90 ft|V,S,M|1 minute|C|20 ft square of tentacles: DEX save or restrained, 3d6 bludgeoning.
Fabricate|4|Tra|W|10 minutes|120 ft|V,S|Instant||Turn raw materials into finished products.
Fire Shield|4|Evo|W|1 action|Self|V,S,M|10 minutes||Warm or chill shield: resist cold or fire; melee attackers take 2d8 fire or cold.
Freedom of Movement|4|Abj|BCDR|1 action|Touch|V,S,M|1 hour||Ignore difficult terrain, paralysis and restraint; escape grapples easily.
Giant Insect|4|Tra|D|1 action|30 ft|V,S|10 minutes|C|Turn insects into giant versions (centipedes, spiders, wasp, scorpion).
Grasping Vine|4|Con|DR|1 bonus action|30 ft|V,S|1 minute|C|Vine pulls a creature 20 ft toward it (DEX save).
Greater Invisibility|4|Ill|BSW|1 action|Touch|V,S|1 minute|C|Target is invisible even while attacking or casting.
Guardian of Faith|4|Con|C|1 action|30 ft|V|8 hours||Spectral guardian deals 20 radiant (DEX half) to hostiles that come within 10 ft; 60 total.
Hallucinatory Terrain|4|Ill|BDKW|10 minutes|300 ft|V,S,M|24 hours||Make natural terrain in a 150 ft cube look, sound and smell different.
Ice Storm|4|Evo|DSW|1 action|300 ft|V,S,M|Instant||20 ft radius: DEX save, 2d8 bludgeoning + 4d6 cold; difficult terrain. +1d8/slot.
Leomund's Secret Chest|4|Con|W|1 action|Touch|V,S,M|Instant||Hide a chest in the Ethereal Plane and recall it.
Locate Creature|4|Div|BCDPRW|1 action|Self|V,S,M|1 hour|C|Sense the direction of a known creature within 1,000 ft.
Mordenkainen's Faithful Hound|4|Con|W|1 action|30 ft|V,S,M|8 hours||Invisible watchdog barks at intruders and bites (4d8 piercing).
Mordenkainen's Private Sanctum|4|Abj|W|10 minutes|120 ft|V,S,M|24 hours||Ward an area against sound, sight, divination and teleportation.
Otiluke's Resilient Sphere|4|Evo|W|1 action|30 ft|V,S,M|1 minute|C|Enclose a creature in an impenetrable sphere (DEX save).
Phantasmal Killer|4|Ill|W|1 action|120 ft|V,S|1 minute|C|WIS save or frightened; 4d10 psychic each turn until it saves. +1d10/slot.
Polymorph|4|Tra|BDSW|1 action|60 ft|V,S,M|1 hour|C|Turn a creature into a beast of CR ≤ its level/CR (WIS save if unwilling).
Staggering Smite|4|Evo|P|1 bonus action|Self|V|1 minute|C|Next melee hit: +4d6 psychic; WIS save or disadvantage and no reactions.
Stone Shape|4|Tra|CDW|1 action|Touch|V,S,M|Instant||Reshape a stone object of Medium size or smaller.
Stoneskin|4|Abj|DRSW|1 action|Touch|V,S,M|1 hour|C|Resistance to nonmagical bludgeoning, piercing and slashing.
Wall of Fire|4|Evo|DSW|1 action|120 ft|V,S,M|1 minute|C|Wall of fire; 5d8 fire (DEX half) on one side. +1d8/slot.
Animate Objects|5|Tra|BSW|1 action|120 ft|V,S|1 minute|C|Animate up to ten small objects to fight for you.
Antilife Shell|5|Abj|D|1 action|Self (10 ft)|V,S|1 hour|C|Barrier keeps non-undead, non-construct creatures out.
Awaken|5|Tra|BD|8 hours|Touch|V,S,M|Instant||Give a beast or plant INT 10 and speech; charmed for 30 days.
Banishing Smite|5|Abj|P|1 bonus action|Self|V|1 minute|C|Next weapon hit: +5d10 force; if at 50 HP or less, banished.
Bigby's Hand|5|Evo|W|1 action|120 ft|V,S,M|1 minute|C|Large hand: punch (4d8 force), push, grapple or block.
Circle of Power|5|Abj|P|1 action|Self (30 ft)|V|10 minutes|C|Allies get advantage on saves vs spells; successful saves for half take none.
Cloudkill|5|Con|SW|1 action|120 ft|V,S|10 minutes|C|20 ft sphere of poison fog that drifts; 5d8 poison (CON half). +1d8/slot.
Commune|5|Div|C|1 minute|Self|V,S,M|1 minute|R|Ask your deity up to three yes/no questions.
Commune with Nature|5|Div|DR|1 minute|Self|V,S|Instant|R|Learn facts about the land within 3 miles.
Cone of Cold|5|Evo|SW|1 action|Self (60 ft cone)|V,S,M|Instant||CON save, 8d8 cold, half on save. +1d8/slot.
Conjure Elemental|5|Con|DW|1 minute|90 ft|V,S,M|1 hour|C|Summon an elemental of CR 5 or lower.
Conjure Volley|5|Con|R|1 action|150 ft|V,S,M|Instant||40 ft radius: DEX save, 8d8 weapon damage, half on save.
Contact Other Plane|5|Div|KW|1 minute|Self|V|1 minute|R|Ask an otherworldly entity five questions (INT save or take psychic damage and go insane).
Contagion|5|Nec|CD|1 action|Touch|V,S|7 days||Melee spell attack: poison then afflict a disease after failed saves.
Creation|5|Ill|SW|1 minute|30 ft|V,S,M|Special||Create a nonliving object of vegetable matter or mineral (temporary).
Destructive Wave|5|Evo|P|1 action|Self (30 ft)|V|Instant||CON save, 5d6 thunder + 5d6 radiant/necrotic and prone; half on save.
Dispel Evil and Good|5|Abj|CP|1 action|Self|V,S,M|1 minute|C|Protection from extraplanar creatures; can banish or break enchantments.
Dominate Person|5|Enc|BS|1 action|60 ft|V,S|1 minute|C|WIS save or a humanoid is charmed and obeys you. Longer with higher slots.
Dream|5|Ill|BKW|1 minute|Special|V,S,M|8 hours||Enter a creature's dreams to talk or terrify (3d6 psychic).
Flame Strike|5|Evo|C|1 action|60 ft|V,S,M|Instant||10 ft radius column: DEX save, 4d6 fire + 4d6 radiant, half on save.
Geas|5|Enc|BCDPW|1 minute|60 ft|V|30 days||WIS save or bound to a command; 5d10 psychic when it disobeys.
Greater Restoration|5|Abj|BCD|1 action|Touch|V,S,M|Instant||End charm, petrification, a curse, an ability reduction or an HP max reduction.
Hallow|5|Evo|C|24 hours|Touch|V,S,M|Until dispelled||Consecrate an area against certain creatures with an extra effect.
Hold Monster|5|Enc|BSKW|1 action|90 ft|V,S,M|1 minute|C|WIS save or a creature is paralyzed. +1 target/slot.
Insect Plague|5|Con|CDS|1 action|300 ft|V,S,M|10 minutes|C|20 ft sphere of locusts: 4d10 piercing (CON half); difficult terrain.
Legend Lore|5|Div|BCW|10 minutes|Self|V,S,M|Instant||Learn significant lore about a person, place or object.
Mass Cure Wounds|5|Evo|BCD|1 action|60 ft|V,S|Instant||Up to six creatures heal 3d8 + spellcasting mod. +1d8/slot.
Mislead|5|Ill|BW|1 action|Self|S|1 hour|C|Become invisible while an illusory double appears in your place.
Modify Memory|5|Enc|BW|1 action|30 ft|V,S|1 minute|C|WIS save or you reshape up to 10 minutes of memory.
Passwall|5|Tra|W|1 action|30 ft|V,S,M|1 hour||Create a passage through wood, plaster or stone.
Planar Binding|5|Abj|BCDW|1 hour|60 ft|V,S,M|24 hours||Bind a celestial, elemental, fey or fiend to your service (CHA save).
Raise Dead|5|Nec|BCP|1 hour|Touch|V,S,M|Instant||Return a creature dead up to 10 days to life (500 gp diamond).
Rary's Telepathic Bond|5|Div|W|1 action|30 ft|V,S,M|1 hour|R|Telepathic link among up to eight willing creatures.
Reincarnate|5|Tra|D|1 hour|Touch|V,S,M|Instant||Return a dead humanoid to life in a new random body.
Scrying|5|Div|BCDKW|10 minutes|Self|V,S,M|10 minutes|C|Spy on a creature anywhere on the same plane (WIS save).
Seeming|5|Ill|BSW|1 action|30 ft|V,S|8 hours||Change the appearance of any number of creatures.
Swift Quiver|5|Tra|R|1 bonus action|Touch|V,S,M|1 minute|C|Bonus action each turn: two attacks with a bow; ammo regenerates.
Telekinesis|5|Tra|SW|1 action|60 ft|V,S|10 minutes|C|Move creatures or objects up to 1,000 lb with your mind.
Teleportation Circle|5|Con|BSW|1 minute|10 ft|V,M|1 round||Open a portal to a known permanent teleportation circle.
Tree Stride|5|Con|DR|1 action|Self|V,S|1 minute|C|Step into a tree and out of another within 500 ft.
Wall of Force|5|Evo|W|1 action|120 ft|V,S,M|10 minutes|C|Invisible, impassable wall or dome of force.
Wall of Stone|5|Evo|DSW|1 action|120 ft|V,S,M|10 minutes|C|Create a stone wall; permanent if held for the full duration.
Arcane Gate|6|Con|SKW|1 action|500 ft|V,S|10 minutes|C|Linked portals up to 500 ft apart.
Blade Barrier|6|Evo|C|1 action|90 ft|V,S|10 minutes|C|Wall of spinning blades: 6d10 slashing (DEX half), three-quarters cover.
Chain Lightning|6|Evo|SW|1 action|150 ft|V,S,M|Instant||Bolt hits a target then up to three more: 10d8 lightning each (DEX half).
Circle of Death|6|Nec|SKW|1 action|150 ft|V,S,M|Instant||60 ft radius: CON save, 8d6 necrotic, half on save. +2d6/slot.
Conjure Fey|6|Con|DK|1 minute|90 ft|V,S|1 hour|C|Summon a fey creature of CR 6 or lower.
Contingency|6|Evo|W|10 minutes|Self|V,S,M|10 days||Store a spell that triggers on a condition you set.
Create Undead|6|Nec|CKW|1 minute|10 ft|V,S,M|Instant||Create ghouls (more powerful undead at higher slots).
Disintegrate|6|Tra|SW|1 action|60 ft|V,S,M|Instant||DEX save or 10d6 + 40 force; dust at 0 HP. +3d6/slot.
Drawmij's Instant Summons|6|Con|W|1 minute|Touch|V,S,M|Until dispelled|R|Mark an object to summon it to your hand later.
Eyebite|6|Nec|BSKW|1 action|Self|V,S|1 minute|C|Each turn, one creature (WIS save): asleep, panicked or sickened.
Find the Path|6|Div|BCD|1 minute|Self|V,S,M|1 day|C|Know the shortest route to a location.
Flesh to Stone|6|Tra|KW|1 action|60 ft|V,S,M|1 minute|C|CON saves or restrained then petrified.
Forbiddance|6|Abj|C|10 minutes|Touch|V,S,M|1 day|R|Ward an area against teleportation and planar travel; damages chosen creature types.
Globe of Invulnerability|6|Abj|SW|1 action|Self (10 ft)|V,S,M|1 minute|C|Spells of 5th level or lower can't affect anything inside.
Guards and Wards|6|Abj|BW|10 minutes|Touch|V,S,M|24 hours||Protect a stronghold with fog, webs, locked doors and more.
Harm|6|Nec|C|1 action|60 ft|V,S|Instant||CON save, 14d6 necrotic (half on save) and HP max reduced.
Heal|6|Evo|CD|1 action|60 ft|V,S|Instant||Heal 70 HP and end blindness, deafness and diseases. +10/slot.
Heroes' Feast|6|Con|CD|10 minutes|30 ft|V,S,M|Instant||Feast cures, grants immunity to poison/fear, WIS save advantage, +2d10 HP max for 24 hours.
Magic Jar|6|Nec|W|1 minute|Self|V,S,M|Until dispelled||Move your soul into a container and possess bodies nearby.
Mass Suggestion|6|Enc|BSKW|1 action|60 ft|V,M|24 hours||Up to twelve creatures follow a suggestion (WIS save).
Move Earth|6|Tra|DSW|1 action|120 ft|V,S,M|2 hours|C|Reshape terrain in a 40 ft square.
Otiluke's Freezing Sphere|6|Evo|W|1 action|300 ft|V,S,M|Instant||60 ft radius: CON save, 10d6 cold; can freeze water.
Otto's Irresistible Dance|6|Enc|BW|1 action|30 ft|V|1 minute|C|Target dances: disadvantage on DEX saves and attacks, others have advantage.
Planar Ally|6|Con|C|10 minutes|60 ft|V,S|Instant||Ask your deity to send an otherworldly ally (for payment).
Programmed Illusion|6|Ill|BW|1 action|120 ft|V,S,M|Until dispelled||Illusion that plays when a condition is met.
Sunbeam|6|Evo|DSW|1 action|Self (60 ft line)|V,S,M|1 minute|C|CON save, 6d8 radiant and blinded; repeat each turn as an action.
Transport via Plants|6|Con|D|1 action|10 ft|V,S|1 round||Link two plants anywhere on the same plane to travel between.
True Seeing|6|Div|BCSKW|1 action|Touch|V,S,M|1 hour||Truesight 120 ft.
Wall of Ice|6|Evo|W|1 action|120 ft|V,S,M|10 minutes|C|Ice wall; 10d6 cold (DEX half) when created, frigid air when broken.
Wall of Thorns|6|Con|D|1 action|120 ft|V,S,M|10 minutes|C|Thorny wall: 7d8 piercing (DEX half) and costly to pass.
Wind Walk|6|Tra|D|1 minute|30 ft|V,S,M|8 hours||Up to ten creatures become clouds with 300 ft fly speed.
Word of Recall|6|Con|C|1 action|5 ft|V|Instant||You and up to five creatures teleport to a prepared sanctuary.
Conjure Celestial|7|Con|C|1 minute|90 ft|V,S|1 hour|C|Summon a celestial of CR 4 or lower.
Delayed Blast Fireball|7|Evo|SW|1 action|150 ft|V,S,M|1 minute|C|Fireball (12d6) that grows 1d6 each round you hold it.
Divine Word|7|Evo|C|1 bonus action|30 ft|V|Instant||CHA save: deafen, blind, stun or kill based on HP; banish extraplanar.
Etherealness|7|Tra|BCSKW|1 action|Self|V,S|8 hours||Step into the Ethereal Plane.
Finger of Death|7|Nec|SKW|1 action|60 ft|V,S|Instant||CON save, 7d8 + 30 necrotic; humanoids killed rise as zombies.
Fire Storm|7|Evo|CDS|1 action|150 ft|V,S|Instant||Ten 10 ft cubes of fire: DEX save, 7d10 fire.
Forcecage|7|Evo|BKW|1 action|100 ft|V,S,M|1 hour||Invisible cage or box of force; teleport out needs a CHA save.
Mirage Arcane|7|Ill|BDW|10 minutes|Sight|V,S|10 days||Make terrain up to 1 square mile look, feel and sound different.
Mordenkainen's Magnificent Mansion|7|Con|BW|1 minute|300 ft|V,S,M|24 hours||Extradimensional mansion with servants and a feast.
Mordenkainen's Sword|7|Evo|BW|1 action|60 ft|V,S,M|1 minute|C|Spectral sword attacks for 3d10 force; bonus action to move and attack.
Plane Shift|7|Con|CDSKW|1 action|Touch|V,S,M|Instant||Travel to another plane, or banish a creature (melee spell attack, CHA save).
Prismatic Spray|7|Evo|SW|1 action|Self (60 ft cone)|V,S|Instant||Each creature is hit by a random ray of color with different effects.
Project Image|7|Ill|BW|1 action|500 miles|V,S,M|1 day|C|Illusory copy of yourself you can see, hear and cast through.
Regenerate|7|Tra|BCD|1 minute|Touch|V,S,M|1 hour||Heal 4d8 + 15 then 1 HP per round; regrow lost body parts.
Resurrection|7|Nec|BC|1 hour|Touch|V,S,M|Instant||Return a creature dead up to a century to life (1,000 gp diamond).
Reverse Gravity|7|Tra|DSW|1 action|100 ft|V,S,M|1 minute|C|Gravity reverses in a 50 ft radius cylinder.
Sequester|7|Tra|W|1 action|Touch|V,S,M|Until dispelled||Hide a creature or object from divination; creature enters suspended animation.
Simulacrum|7|Ill|W|12 hours|Touch|V,S,M|Until dispelled||Create an obedient duplicate of a creature with half its HP.
Symbol|7|Abj|BCDW|1 minute|Touch|V,S,M|Until dispelled or triggered||Glyph with a harmful effect (death, fear, sleep, stun, etc.) when triggered.
Teleport|7|Con|BSW|1 action|10 ft|V|Instant||Teleport you and up to eight creatures to a known destination (with mishap chance).
Animal Shapes|8|Tra|D|1 action|30 ft|V,S|24 hours|C|Turn willing creatures into beasts of CR 4 or lower.
Antimagic Field|8|Abj|CW|1 action|Self (10 ft)|V,S,M|1 hour|C|Magic doesn't work inside a 10 ft sphere around you.
Antipathy/Sympathy|8|Enc|DW|1 hour|60 ft|V,S,M|10 days||An object or area repels or attracts a creature type.
Clone|8|Nec|W|1 hour|Touch|V,S,M|Instant||Grow an inert duplicate that your soul moves into when you die.
Control Weather|8|Tra|CDW|10 minutes|Self (5 miles)|V,S,M|8 hours|C|Change the weather around you over time.
Demiplane|8|Con|KW|1 action|60 ft|S|1 hour||Door to a 30 ft empty demiplane.
Dominate Monster|8|Enc|BSKW|1 action|60 ft|V,S|1 hour|C|WIS save or a creature is charmed and obeys you.
Earthquake|8|Evo|CDS|1 action|500 ft|V,S,M|1 minute|C|100 ft radius quake: prone, fissures, structural damage.
Feeblemind|8|Enc|BDKW|1 action|150 ft|V,S,M|Instant||4d6 psychic; INT save or INT and CHA become 1.
Glibness|8|Tra|BK|1 action|Self|V|1 hour||Treat CHA check rolls below 15 as 15; magic can't detect your lies.
Holy Aura|8|Abj|C|1 action|Self|V,S,M|1 minute|C|Allies within 30 ft get advantage on saves; attacks against them have disadvantage.
Incendiary Cloud|8|Con|SW|1 action|150 ft|V,S|1 minute|C|20 ft radius smoke and embers: 10d8 fire (DEX half); drifts 10 ft each turn.
Maze|8|Con|W|1 action|60 ft|V,S|10 minutes|C|Banish a creature into a labyrinthine demiplane.
Mind Blank|8|Abj|BW|1 action|Touch|V,S|24 hours||Immunity to psychic damage, mind reading, divination and charm.
Power Word Stun|8|Enc|BSKW|1 action|60 ft|V|Instant||A creature with 150 HP or less is stunned.
Sunburst|8|Evo|DSW|1 action|150 ft|V,S,M|Instant||60 ft radius: CON save, 12d6 radiant and blinded; half and no blindness on save.
Telepathy|8|Evo|W|1 action|Unlimited|V,S,M|24 hours||Telepathic link with a familiar creature on the same plane.
Tsunami|8|Con|D|1 minute|Sight|V,S|6 rounds|C|Massive wall of water: 6d10 bludgeoning (STR half), carries creatures.
Astral Projection|9|Nec|CKW|1 hour|10 ft|V,S,M|Special||Project you and up to eight others into the Astral Plane.
Foresight|9|Div|BDKW|1 minute|Touch|V,S,M|8 hours||Can't be surprised; advantage on everything; attacks against target have disadvantage.
Gate|9|Con|CSW|1 action|60 ft|V,S,M|1 minute|C|Portal to another plane; can summon a specific named creature.
Imprisonment|9|Abj|KW|1 minute|30 ft|V,S,M|Until dispelled||WIS save or imprisoned (burial, chaining, hedged prison, minimus, slumber).
Mass Heal|9|Evo|C|1 action|60 ft|V,S|Instant||Distribute 700 HP of healing and cure conditions.
Meteor Swarm|9|Evo|SW|1 action|1 mile|V,S|Instant||Four 40 ft radius blasts: DEX save, 20d6 fire + 20d6 bludgeoning.
Power Word Heal|9|Evo|B|1 action|Touch|V,S|Instant||Restore all HP and end several conditions.
Power Word Kill|9|Enc|BSKW|1 action|60 ft|V|Instant||A creature with 100 HP or less dies.
Prismatic Wall|9|Abj|W|1 action|60 ft|V,S|10 minutes||Seven-layered wall of light with different effects.
Shapechange|9|Tra|DW|1 action|Self|V,S,M|1 hour|C|Transform into a creature of CR ≤ your level; change as an action.
Storm of Vengeance|9|Con|D|1 action|Sight|V,S|1 minute|C|Massive storm: thunder, acid rain, lightning, hail and wind over 360 ft radius.
Time Stop|9|Tra|SW|1 action|Self|V|Instant||Take 1d4 + 1 turns in a row while time is stopped.
True Polymorph|9|Tra|BKW|1 action|30 ft|V,S,M|1 hour|C|Transform a creature or object into another; permanent if held for an hour.
True Resurrection|9|Nec|CD|1 hour|Touch|V,S,M|Instant||Return a creature dead up to 200 years to life, new body if needed.
Weird|9|Ill|W|1 action|120 ft|V,S,M|1 minute|C|30 ft radius: WIS save or frightened, 4d10 psychic each turn.
Wish|9|Con|SW|1 action|Self|V|Instant||Duplicate any 8th-level or lower spell, or attempt something greater at a risk.
`;
  DB.SPELLS = [];
  DB.SPELL_INDEX = {};
  RAW.trim().split('\n').forEach(function (line) {
    var p = line.split('|');
    if (p.length < 10) return;
    var s = {
      name: p[0], lvl: +p[1], school: p[2], classes: p[3], time: p[4], range: p[5], comp: p[6], dur: p[7],
      conc: p[8].indexOf('C') >= 0, ritual: p[8].indexOf('R') >= 0, desc: p[9], src: 'PHB'
    };
    DB.SPELLS.push(s);
    DB.SPELL_INDEX[s.name.toLowerCase()] = s;
  });
  // Register a spell that isn't in the PHB list (homebrew or other books) as a stub, if missing.
  DB.ensureSpell = function (name, lvl, opts) {
    var key = name.toLowerCase();
    var s = DB.SPELL_INDEX[key];
    if (!s) {
      opts = opts || {};
      s = {
        name: name, lvl: lvl, school: opts.school || '', classes: '', time: opts.time || '—', range: opts.range || '—', comp: opts.comp || '—',
        dur: opts.dur || '—', conc: !!opts.conc, ritual: false, desc: opts.desc || ('Not a PHB spell. See its source (' + (opts.src || 'homebrew') + ') for rules.'),
        src: opts.src || 'HB'
      };
      DB.SPELLS.push(s); DB.SPELL_INDEX[key] = s;
    }
    if (opts && opts.addClass && s.classes.indexOf(opts.addClass) < 0) s.classes += opts.addClass;
    return s;
  };
})(window.DB);
