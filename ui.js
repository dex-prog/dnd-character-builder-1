// UI: renders tabs from the character state and wires events. Everything is saved to localStorage.
(function (DB, E) {
  var STORE = 'dnd2014builder.v1';
  var APP = { chars: [], cur: null, tab: 'race', spellUi: {}, rolls: null };
  window.APP = APP;

  // ---------- persistence ----------
  function load() {
    try { var s = JSON.parse(localStorage.getItem(STORE) || 'null'); if (s && s.chars) { APP.chars = s.chars; APP.cur = s.cur; } } catch (e) { }
    if (!APP.chars.length) { var c = E.newCharacter(); APP.chars.push(c); APP.cur = c.id; }
    if (!cur()) APP.cur = APP.chars[0].id;
    APP.chars.forEach(migrate);
  }
  function migrate(c) {
    var blank = E.newCharacter();
    Object.keys(blank).forEach(function (k) { if (c[k] === undefined) c[k] = blank[k]; });
    if (!c.levels.length) c.levels = [{ cls: '', hp: null }];
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify({ chars: APP.chars, cur: APP.cur })); } catch (e) { } }
  function cur() { for (var i = 0; i < APP.chars.length; i++) if (APP.chars[i].id === APP.cur) return APP.chars[i]; return null; }

  // ---------- html helpers ----------
  function h(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function select(attrs, options, value, blank) {
    var o = blank !== false ? '<option value="">' + h(blank || '— choose —') + '</option>' : '';
    options.forEach(function (x) {
      var v = typeof x === 'object' ? x.v : x, t = typeof x === 'object' ? x.t : x;
      o += '<option value="' + h(v) + '"' + (String(v) === String(value) ? ' selected' : '') + (x.title ? ' title="' + h(x.title) + '"' : '') + (x.dis ? ' disabled' : '') + '>' + h(t) + '</option>';
    });
    return '<select ' + attrs + '>' + o + '</select>';
  }
  function fmt(n) { return E.fmt(n); }
  function vlevel(ch) { return Math.max(1, Math.min(ch.viewLevel || ch.levels.length, ch.levels.length)); }
  function featureList(list) {
    if (!list.length) return '';
    return '<ul class="feats">' + list.map(function (f) { return '<li><b>' + h(f.name) + '.</b> ' + h(f.text) + (f.src ? ' <small class="muted">(' + h(f.src) + ')</small>' : '') + '</li>'; }).join('') + '</ul>';
  }
  function srcBadge(o) { return o && o.src === 'HB' ? ' <span class="badge" title="' + h(o.srcNote || 'Homebrew') + '">HB</span>' : ''; }

  // ---------- generic choice widget ----------
  function choiceOptions(def, ch, oc) {
    var t = def.type;
    if (t === 'skill') return E.fromList(def).map(function (s) { return { v: s, t: s + ' (' + (DB.SKILLS[s] || DB.EXTRA_SKILLS[s] || '') + ')' }; });
    if (t === 'expertise') { var l = (def.from || DB.ALL_SKILLS).slice(); if (def.allowThieves) l.push("Thieves' tools"); return l; }
    if (t === 'tool') return E.fromList(def);
    if (t === 'language') return DB.LANGUAGES;
    if (t === 'ability') return DB.ABILS.filter(function (a) { return (def.exclude || []).indexOf(a) < 0; });
    if (t === 'save') return def.from;
    if (t === 'weapon') return DB.WEAPONS.map(function (w) { return w.name; });
    if (t === 'feat') return DB.FEATS.map(function (f) { return { v: f.id, t: f.name, title: f.text }; });
    if (t === 'list') return E.opts(def.opts).map(function (o) { return { v: o.id, t: o.name, title: o.text || '' }; });
    if (t === 'spell') {
      if (def.fixed) return def.fixed.map(function (n) { var s = E.spell(n); return { v: n, t: n + (s ? ' (' + (s.lvl ? 'lvl ' + s.lvl : 'cantrip') + ')' : ''), title: s ? s.desc : '' }; });
      var code = def.list;
      if (def.listFrom) code = (ch.choices[(oc.featPrefix || oc.key.split(':')[0]) + ':' + def.listFrom] || [])[0];
      if (!code) return [];
      return DB.SPELLS.filter(function (s) { return s.lvl === def.spellLvl && (code === 'any' ? s.classes : s.classes.indexOf(code) >= 0); })
        .sort(function (a, b) { return a.name < b.name ? -1 : 1; }).map(function (s) { return { v: s.name, t: s.name, title: s.desc }; });
    }
    return [];
  }
  function renderChoice(oc, ch) {
    var def = oc.def, vals = ch.choices[oc.key] || [];
    var opts = choiceOptions(def, ch, oc);
    var html = '<div class="choice"><div class="clabel">' + h(def.label) + (def.optional ? ' <small class="muted">(optional)</small>' : '') + ' <small class="muted">— ' + h(oc.src) + '</small></div><div class="crow">';
    for (var i = 0; i < def.n; i++) html += select('data-act="choice" data-key="' + h(oc.key) + '" data-idx="' + i + '"', opts, vals[i] || '');
    html += '</div>';
    if (def.note) html += '<div class="muted small">' + h(def.note) + '</div>';
    if (def.type === 'list') {
      var os = E.opts(def.opts);
      var picked = vals.map(function (v) { return os.filter(function (o) { return o.id === v; })[0]; }).filter(Boolean);
      if (picked.length) html += '<ul class="feats small">' + picked.map(function (o) { return '<li><b>' + h(o.name) + ':</b> ' + h(o.text || '') + '</li>'; }).join('') + '</ul>';
    }
    if (def.type === 'feat' && vals[0]) { var f = E.feat(vals[0]); if (f) html += '<div class="small">' + h(f.text) + '</div>' + featAsiWidget(f, 'rfeat', ch); }
    if (def.type === 'spell') { var sp = vals.map(E.spell).filter(Boolean); if (sp.length) html += '<ul class="feats small">' + sp.map(function (s) { return '<li><b>' + h(s.name) + ':</b> ' + h(s.desc) + '</li>'; }).join('') + '</ul>'; }
    return html + '</div>';
  }
  function featAsiWidget(f, prefix, ch) {
    if (!f.asiChoice) return '';
    return '<div class="choice"><div class="clabel">' + h(f.name) + ': +1 to</div>' + select('data-act="choice" data-key="' + prefix + ':asi" data-idx="0"', f.asiChoice, (ch.choices[prefix + ':asi'] || [])[0]) + '</div>';
  }
  function asiWidget(ch, n) {
    var rec = ch.asi[n] || { mode: 'asi', a: ['', ''] };
    var html = '<div class="choice"><div class="clabel">Ability Score Improvement or Feat</div><div class="crow">' +
      select('data-act="asimode" data-n="' + n + '"', [{ v: 'asi', t: 'Ability Score Improvement' }, { v: 'feat', t: 'Feat' }], rec.mode || 'asi', false);
    if (rec.mode === 'feat') {
      html += select('data-act="asifeat" data-n="' + n + '"', DB.FEATS.map(function (f) { return { v: f.id, t: f.name + (f.src === 'HB' ? ' [HB]' : ''), title: f.text }; }), rec.feat);
      html += '</div>';
      var f = E.feat(rec.feat);
      if (f) html += '<div class="small">' + h(f.text) + (f.prereq ? ' <i>Prerequisite applies.</i>' : '') + '</div>' + featAsiWidget(f, 'feat@' + n, ch);
    } else {
      html += select('data-act="asiab" data-n="' + n + '" data-i="0"', DB.ABILS, (rec.a || [])[0], '+1 to…') + select('data-act="asiab" data-n="' + n + '" data-i="1"', DB.ABILS, (rec.a || [])[1], '+1 to…');
      html += '</div><div class="muted small">Pick the same ability twice for +2.</div>';
    }
    return html + '</div>';
  }

  // ---------- header & tabs ----------
  var TABS = [['race', '1. Race'], ['class', '2. Class'], ['abilities', '3. Abilities'], ['background', '4. Background'], ['equipment', '5. Equipment'], ['spells', '6. Spells'], ['plan', 'Level Plan'], ['sheet', 'Sheet'], ['notes', 'Notes']];
  function renderHeader(ch) {
    var opts = APP.chars.map(function (c) { return { v: c.id, t: (c.name || 'Unnamed') + ' (lvl ' + c.levels.length + ')' }; });
    var lvls = []; for (var i = 1; i <= ch.levels.length; i++) lvls.push({ v: i, t: 'Level ' + i });
    return '<header class="noprint"><div class="row">' +
      '<b class="title">D&amp;D 5e (2014) Character Builder</b>' +
      '<label>Character ' + select('data-act="pick"', opts, APP.cur, false) + '</label>' +
      '<button data-act="new">New</button><button data-act="dup">Duplicate</button><button data-act="del">Delete</button>' +
      '<button data-act="export">Export file</button><label class="filebtn">Import file<input type="file" accept=".json,application/json" data-act="import" hidden></label>' +
      '<button data-act="print">Print / PDF</button></div>' +
      '<div class="row"><label>Name <input data-act="field" data-f="name" value="' + h(ch.name) + '"></label>' +
      '<label>Player <input data-act="field" data-f="player" value="' + h(ch.player) + '"></label>' +
      '<label title="The sheet, spell counts and warnings show your character at this level">Show level ' + select('data-act="view"', lvls, vlevel(ch), false) + '</label></div>' +
      '<nav>' + TABS.map(function (t) {
        var dis = t[0] === 'plan' && !ch.created;
        return '<button class="tab' + (APP.tab === t[0] ? ' on' : '') + '" data-act="tab" data-t="' + t[0] + '"' + (dis ? ' disabled title="Finish level 1 first (Spells step)"' : '') + '>' + t[1] + '</button>';
      }).join('') + '</nav></header>';
  }
  function nextBtn(to, label) { return '<div class="next"><button class="primary" data-act="tab" data-t="' + to + '">' + (label || 'Next →') + '</button></div>'; }
  function warnBox(d, filter) {
    var w = filter ? d.warnings.filter(filter) : d.warnings;
    if (!w.length) return '';
    return '<div class="warn noprint"><b>To check (' + w.length + ')</b><ul>' + w.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul></div>';
  }

  // ---------- RACE ----------
  function tabRace(ch) {
    var r = E.race(ch.race), sr = E.subrace(r, ch.subrace);
    var html = '<section><h2>Race</h2><div class="grid2"><div>' +
      '<label>Race ' + select('data-act="race"', DB.RACES.map(function (x) { return { v: x.id, t: x.name + (x.src === 'HB' ? ' [Homebrew]' : '') }; }), ch.race) + '</label>';
    if (r && r.subraces.length) html += ' <label>Subrace ' + select('data-act="subrace"', r.subraces.map(function (x) { return { v: x.id, t: x.name }; }), ch.subrace) + '</label>';
    html += '</div><div>';
    if (r) {
      var asi = {}; [r.asi, sr && sr.asi].forEach(function (o) { if (o) Object.keys(o).forEach(function (k) { asi[k] = (asi[k] || 0) + o[k]; }); });
      html += '<p><b>' + h(r.name) + (sr ? ' — ' + h(sr.name) : '') + '</b>' + srcBadge(r) + '<br>Ability scores: ' + (Object.keys(asi).map(function (k) { return k + ' ' + fmt(asi[k]); }).join(', ') || 'see choices') +
        '<br>Size ' + r.size + ', speed ' + ((sr && sr.speed) || r.speed) + ' ft' + ((sr && sr.darkvision) || r.darkvision ? ', darkvision ' + ((sr && sr.darkvision) || r.darkvision) + ' ft' : '') +
        '<br>Languages: ' + h(r.languages.join(', ')) + (r.srcNote ? '<br><small class="muted">Source: ' + h(r.srcNote) + '</small>' : '') + '</p>';
    }
    html += '</div></div>';
    if (r) {
      html += '<h3>Traits</h3>' + featureList(r.traits.concat((sr && sr.traits) || []).map(function (t) { return { name: t[0], text: t[1] }; }));
      var cs = E.originChoices(ch).filter(function (oc) { return /^(race|subrace|rfeat):/.test(oc.key); });
      if (cs.length) html += '<h3>Choices</h3>' + cs.map(function (oc) { return renderChoice(oc, ch); }).join('');
    }
    return html + nextBtn('class') + '</section>';
  }

  // ---------- CLASS (level 1) ----------
  function classSummary(c) {
    var cs = c.caster;
    return '<p><b>' + h(c.name) + '</b>' + srcBadge(c) + ' — Hit die d' + c.hd + ', saves ' + c.saves.join(' & ') +
      '<br>Armor: ' + h(c.armor.join(', ') || 'none') + '<br>Weapons: ' + h(c.weapons.join(', ')) +
      (c.tools && c.tools.length ? '<br>Tools: ' + h(c.tools.join(', ')) : '') +
      '<br>Skills: choose ' + c.skills.n + ' from ' + h(c.skills.from === 'any' ? 'any' : c.skills.from.join(', ')) +
      (cs ? '<br>Spellcasting: ' + cs.abil + ', ' + cs.type + ' caster (' + cs.mode + ')' : '') +
      '<br>' + h(c.subName) + ' at level ' + c.subLevel + (c.srcNote ? '<br><small class="muted">Source: ' + h(c.srcNote) + '</small>' : '') + '</p>';
  }
  function subclassSelect(ch, c) {
    return '<label>' + h(c.subName) + ' ' + select('data-act="subclass" data-c="' + c.id + '"', c.subclasses.map(function (s) { return { v: s.id, t: s.name + (s.src === 'HB' ? ' [HB]' : '') }; }), ch.subclasses[c.id]) + '</label>';
  }
  function subclassBlurb(ch, c) {
    var s = E.sub(c.id, ch.subclasses[c.id]); if (!s) return '';
    var html = '<div class="subinfo">' + (s.srcNote ? '<small class="muted">Source: ' + h(s.srcNote) + '</small>' : '') + (s.tenets ? '<div class="small"><b>Tenets:</b> ' + h(s.tenets) + '</div>' : '');
    var sp = s.spells || (s.landSpells ? null : null);
    if (sp) html += '<div class="small"><b>Always-prepared spells:</b> ' + Object.keys(sp).map(function (k) { return k + ': ' + sp[k].join(', '); }).join(' · ') + '</div>';
    if (s.expanded) html += '<div class="small"><b>Expanded spell list:</b> ' + Object.keys(s.expanded).map(function (k) { return (k === '0' ? 'cantrips' : 'lvl ' + k) + ': ' + s.expanded[k].join(', '); }).join(' · ') + '</div>';
    html += '<details><summary>All ' + h(s.name) + ' features</summary>' + featureList(s.features.map(function (f) { return { name: f[1], text: f[2], src: 'level ' + f[0] }; })) + '</details>';
    return html + '</div>';
  }
  function tabClass(ch) {
    var c = E.cls(ch.levels[0].cls);
    var html = '<section><h2>Class (level 1)</h2><label>Class ' + select('data-act="cls1"', DB.CLASSES.map(function (x) { return { v: x.id, t: x.name + (x.src === 'HB' ? ' [Homebrew]' : '') }; }), ch.levels[0].cls) + '</label>';
    if (!c) return html + '</section>';
    html += classSummary(c);
    if (c.subLevel === 1) html += subclassSelect(ch, c) + subclassBlurb(ch, c);
    html += '<h3>Level 1 features</h3>' + featureList(E.levelFeatures(ch, 1));
    var cs = E.levelChoices(ch, 1);
    if (cs.length) html += '<h3>Choices</h3>' + cs.map(function (oc) { return renderChoice(oc, ch); }).join('');
    html += '<details><summary>Full ' + h(c.name) + ' feature list (levels 1–20)</summary>' + featureList(c.features.map(function (f) { return { name: f[1], text: f[2], src: 'level ' + f[0] }; })) + '</details>';
    return html + nextBtn('abilities') + '</section>';
  }

  // ---------- ABILITIES ----------
  function tabAbilities(ch) {
    var d = E.compute(ch, 1);
    var m = ch.abil.method, base = ch.abil.base;
    var html = '<section><h2>Ability scores</h2><label>Method ' + select('data-act="method"', [{ v: 'pointbuy', t: 'Point buy (27 points)' }, { v: 'array', t: 'Standard array (15, 14, 13, 12, 10, 8)' }, { v: 'manual', t: 'Rolled / manual entry' }], m, false) + '</label>';
    if (m === 'pointbuy') {
      var spent = DB.ABILS.reduce(function (s, a) { return s + (DB.POINT_BUY_COST[base[a]] != null ? DB.POINT_BUY_COST[base[a]] : 99); }, 0);
      html += ' <b class="' + (spent > 27 ? 'bad' : '') + '">Points spent: ' + spent + ' / 27</b>';
    }
    if (m === 'manual') html += ' <button data-act="roll">Roll 4d6 (drop lowest) ×6</button>' + (APP.rolls ? ' <span>Rolled: <b>' + APP.rolls.join(', ') + '</b> — type them into the boxes below.</span>' : '');
    html += '<table class="abil"><tr><th></th><th>Base</th><th>Racial</th><th>Total (lvl 1)</th><th>Mod</th></tr>';
    DB.ABILS.forEach(function (a) {
      var input;
      if (m === 'pointbuy') input = select('data-act="base" data-a="' + a + '"', [8, 9, 10, 11, 12, 13, 14, 15], base[a], false);
      else if (m === 'array') {
        // Picking a value another ability already has swaps the two.
        input = select('data-act="base" data-a="' + a + '"', DB.STANDARD_ARRAY.map(function (v) {
          var holder = DB.ABILS.filter(function (b) { return b !== a && +base[b] === v; })[0];
          return { v: v, t: v + (holder ? ' (swap with ' + holder + ')' : '') };
        }), DB.STANDARD_ARRAY.indexOf(+base[a]) >= 0 ? base[a] : '', false);
      } else input = '<input type="number" min="1" max="30" data-act="base" data-a="' + a + '" value="' + h(base[a]) + '">';
      var x = d.abil[a];
      html += '<tr><th>' + DB.ABIL_NAMES[a] + '</th><td>' + input + '</td><td>' + fmt(x.racial) + '</td><td><b>' + x.total + '</b></td><td>' + fmt(x.mod) + '</td></tr>';
    });
    html += '</table><p class="muted small">Racial bonuses come from the Race step. Later Ability Score Improvements are chosen in the Level Plan.</p>';
    return html + nextBtn('background') + '</section>';
  }

  // ---------- BACKGROUND ----------
  function tabBackground(ch) {
    var b = E.bg(ch.bg);
    var html = '<section><h2>Background</h2><label>Background ' + select('data-act="bg"', DB.BACKGROUNDS.map(function (x) { return { v: x.id, t: x.name }; }), ch.bg) + '</label>' +
      ' <label>Alignment ' + select('data-act="field" data-f="alignment"', DB.ALIGNMENTS, ch.alignment) + '</label>';
    if (b) {
      html += '<p>' + (b.skills ? 'Skills: <b>' + h(b.skills.join(', ')) + '</b><br>' : '') + (b.tools ? 'Tools: ' + h(b.tools.join(', ')) + '<br>' : '') +
        (b.langs ? 'Languages: ' + b.langs + ' of your choice<br>' : '') + 'Equipment: ' + h(b.equip.join(', ')) + ', ' + b.gp + ' gp</p>' +
        featureList([{ name: b.feature[0], text: b.feature[1] }]);
      var cs = E.originChoices(ch).filter(function (oc) { return oc.key.indexOf('bg:') === 0; });
      html += cs.map(function (oc) { return renderChoice(oc, ch); }).join('');
      html += '<p class="muted small">Personality traits, ideals, bonds and flaws go in the Notes tab.</p>';
    }
    return html + nextBtn('equipment') + '</section>';
  }

  // ---------- EQUIPMENT ----------
  function tokenOptions(tok) {
    var map = { '{martial}': ['martial-melee', 'martial-ranged'], '{martial-melee}': ['martial-melee'], '{simple}': ['simple-melee', 'simple-ranged'], '{simple-melee}': ['simple-melee'] };
    if (tok === '{instrument}') return DB.INSTRUMENTS;
    return DB.WEAPONS.filter(function (w) { return map[tok] && map[tok].indexOf(w.cat) >= 0 && w.name.indexOf('(KT)') < 0; }).map(function (w) { return w.name; });
  }
  function tabEquipment(ch) {
    var d = E.compute(ch, vlevel(ch));
    var c = E.cls(ch.levels[0].cls), b = E.bg(ch.bg);
    var html = '<section><h2>Equipment</h2>';
    if (c && c.start) {
      html += '<div class="box"><h3>Starting equipment (' + h(c.name) + (b ? ' + ' + h(b.name) : '') + ')</h3>';
      c.start.forEach(function (grp, gi) {
        var pick = ch.startChoices['g' + gi] != null ? ch.startChoices['g' + gi] : 0;
        html += '<div class="choice">';
        grp.forEach(function (opt, oi) {
          var parts = opt.split(' + ');
          var label = parts.map(function (p, pi) {
            if (p.charAt(0) === '{') return select('data-act="starttok" data-k="g' + gi + 'o' + oi + 'p' + pi + '"', tokenOptions(p), ch.startChoices['g' + gi + 'o' + oi + 'p' + pi], p.replace(/[{}]/g, '').replace('-', ' '));
            return h(p);
          }).join(' + ');
          html += '<label class="opt"><input type="radio" name="g' + gi + '" data-act="startgrp" data-g="' + gi + '" value="' + oi + '"' + (pick === oi ? ' checked' : '') + '> ' + label + '</label>';
        });
        html += '</div>';
      });
      if (b) html += '<div class="small">Background: ' + h(b.equip.join(', ')) + ', ' + b.gp + ' gp</div>';
      html += '<button class="primary" data-act="applystart">' + (ch.startApplied ? 'Add starting equipment again' : 'Add starting equipment to inventory') + '</button>' +
        (ch.startApplied ? ' <span class="muted small">Already added once.</span>' : '') + '</div>';
    }
    html += '<h3>Inventory</h3><table class="inv"><tr><th>Item</th><th>Qty</th><th title="Equipped items count for AC and attacks">Equipped</th><th title="Magic bonus (+1 etc.)">Bonus</th><th>Notes</th><th></th></tr>';
    (ch.inventory || []).forEach(function (it, i) {
      var item = DB.findItem(it.name);
      var info = item ? (item.kind === 'weapon' ? item.dmg + ' ' + item.type + (item.props ? ', ' + item.props : '') : item.kind === 'armor' ? (item.type === 'shield' ? '+2 AC' : 'AC ' + item.ac + (item.dexCap === null ? ' + DEX' : item.dexCap ? ' + DEX (max ' + item.dexCap + ')' : '')) : (item.contents || '')) : '';
      var canEq = item && (item.kind === 'weapon' || item.kind === 'armor');
      html += '<tr><td>' + h(it.name) + (info ? '<div class="muted small">' + h(info) + '</div>' : '') + '</td>' +
        '<td><input type="number" min="0" class="n" data-act="inv" data-i="' + i + '" data-f="qty" value="' + h(it.qty) + '"></td>' +
        '<td>' + (canEq ? '<input type="checkbox" data-act="inveq" data-i="' + i + '"' + (it.eq ? ' checked' : '') + '>' : '') + '</td>' +
        '<td>' + (canEq ? '<input type="number" min="0" max="3" class="n" data-act="inv" data-i="' + i + '" data-f="bonus" value="' + h(it.bonus || 0) + '">' : '') + '</td>' +
        '<td><input data-act="inv" data-i="' + i + '" data-f="note" value="' + h(it.note || '') + '"></td>' +
        '<td><button data-act="invdel" data-i="' + i + '">Remove</button></td></tr>';
    });
    html += '</table>';
    var cat = APP.addCat || 'weapon';
    var list = cat === 'weapon' ? DB.WEAPONS : cat === 'armor' ? DB.ARMOR : DB.GEAR;
    html += '<div class="crow">Add ' + select('data-act="addcat"', [{ v: 'weapon', t: 'Weapon' }, { v: 'armor', t: 'Armor' }, { v: 'gear', t: 'Gear / tools / packs' }, { v: 'custom', t: 'Custom item' }], cat, false);
    if (cat === 'custom') html += ' <input id="customitem" placeholder="Item name">';
    else html += select('id="additem"', list.map(function (x) { return { v: x.name, t: x.name + (x.cost ? ' (' + x.cost + ')' : '') }; }), '');
    html += ' <button data-act="additem">Add</button></div>';
    html += '<h3>Coins</h3><div class="crow">' + ['cp', 'sp', 'ep', 'gp', 'pp'].map(function (k) { return '<label>' + k.toUpperCase() + ' <input type="number" class="n" data-act="coin" data-k="' + k + '" value="' + h(ch.coins[k] || 0) + '"></label>'; }).join(' ') + '</div>';
    html += '<h3>Result</h3><p>AC <b>' + d.ac + '</b> <span class="muted">(' + h(d.acSource) + ')</span></p>' + attacksTable(d);
    html += warnBox(d, function (w) { return /proficient|armor|STR \d/i.test(w); });
    return html + nextBtn('spells') + '</section>';
  }
  function attacksTable(d) {
    return '<table class="atk"><tr><th>Attack</th><th>To hit</th><th>Damage</th><th>Range</th><th>Notes</th></tr>' + d.attacks.map(function (a) {
      return '<tr><td>' + h(a.name) + '</td><td>' + fmt(a.hit) + '</td><td>' + h(a.dmg) + '</td><td>' + h(a.range) + '</td><td class="small">' + h(a.notes) + '</td></tr>';
    }).join('') + '</table>';
  }

  // ---------- SPELLS ----------
  function spellRow(s, extra) {
    return '<details class="sp"><summary><span class="lv">' + (s.lvl ? s.lvl : 'C') + '</span> <b>' + h(s.name) + '</b> <span class="muted small">' + h(DB.SCHOOLS[s.school] || s.school || '') + (s.conc ? ' · conc.' : '') + (s.ritual ? ' · ritual' : '') + (s.src !== 'PHB' ? ' · ' + h(s.src) : '') + '</span>' + (extra || '') + '</summary>' +
      '<div class="small">' + h(s.time) + ' · ' + h(s.range) + ' · ' + h(s.comp) + ' · ' + h(s.dur) + '<br>' + h(s.desc) + '</div></details>';
  }
  function tabSpells(ch) {
    var L = vlevel(ch), d = E.compute(ch, L);
    var html = '<section><h2>Spells <small class="muted">(at character level ' + L + ')</small></h2>';
    if (!d.casting.length && !d.granted.length) html += '<p>No spellcasting at this level. Use the "Show level" selector to plan spells for later levels.</p>';
    if (d.slots.length || d.pact) html += '<p>Slots: ' + d.slots.map(function (n, i) { return '<b>' + (i + 1) + '</b>: ' + n; }).join(' · ') + (d.pact ? ' &nbsp; Pact slots: <b>' + d.pact.n + '</b> × level ' + d.pact.lvl : '') + (d.multiclassCaster ? ' <span class="muted small">(multiclass table)</span>' : '') + '</p>';
    d.casting.forEach(function (ci) {
      var cs = ci.caster;
      var ui = APP.spellUi[ci.cls] || (APP.spellUi[ci.cls] = { lvl: '', q: '', any: false });
      html += '<div class="box"><h3>' + h(ci.name) + ' (' + ci.lvl + ') — ' + cs.abil + ', save DC ' + ci.dc + ', attack ' + fmt(ci.atk) + '</h3>';
      if (ci.note) html += '<div class="muted small">' + h(ci.note) + '</div>';
      if (cs.note) html += '<div class="muted small">' + h(cs.note) + '</div>';
      if (ci.notYet && !ci.cantripsMax) { html += '<p class="muted">' + h(ci.notYet) + ' Switch "Show level" to a higher level to plan spells.</p></div>'; return; }
      if (ci.notYet) html += '<div class="muted small">' + h(ci.notYet) + '</div>';
      var counts = 'Cantrips: <b class="' + (ci.cantripCount > ci.cantripsMax ? 'bad' : '') + '">' + ci.cantripCount + ' / ' + ci.cantripsMax + '</b>';
      if (cs.mode === 'known') counts += ' · Spells known: <b class="' + (ci.leveledCount > ci.knownMax ? 'bad' : '') + '">' + ci.leveledCount + ' / ' + ci.knownMax + '</b>';
      if (cs.mode === 'prepared') counts += ' · Prepared: <b class="' + (ci.prepCount > ci.prepMax ? 'bad' : '') + '">' + ci.prepCount + ' / ' + ci.prepMax + '</b> <span class="muted small">(you can change these after each long rest)</span>';
      if (cs.mode === 'spellbook') counts += ' · Spellbook: <b>' + ci.leveledCount + '</b> (' + ci.bookFree + ' free) · Prepared: <b class="' + (ci.prepCount > ci.prepMax ? 'bad' : '') + '">' + ci.prepCount + ' / ' + ci.prepMax + '</b>';
      counts += ' · Max spell level: <b>' + (ci.maxSpellLvl || 0) + '</b>';
      html += '<p>' + counts + '</p>';
      if (ci.always.length) html += '<div class="small"><b>Always prepared / bonus (don\'t count):</b> ' + ci.always.map(function (a) { return h(a.name); }).join(', ') + '</div>';
      // chosen
      var chosen = (ch.spells[ci.cls] || []).map(function (x, i) { return { x: x, i: i, s: E.spell(x.n) }; }).filter(function (o) { return o.s; })
        .sort(function (a, b) { return a.s.lvl - b.s.lvl || (a.s.name < b.s.name ? -1 : 1); });
      var lvOpts = []; for (var i = 1; i <= ch.levels.length; i++) lvOpts.push({ v: i, t: 'from lvl ' + i });
      html += '<h4>Chosen</h4>' + (chosen.length ? chosen.map(function (o) {
        var future = (o.x.at || 1) > L;
        var ctl = ' <span class="ctl">' + select('data-act="spat" data-c="' + ci.cls + '" data-i="' + o.i + '"', lvOpts, o.x.at || 1, false) +
          (cs.mode === 'spellbook' && o.s.lvl > 0 ? ' <label><input type="checkbox" data-act="spprep" data-c="' + ci.cls + '" data-i="' + o.i + '"' + (o.x.prep ? ' checked' : '') + '> prepared</label>' : '') +
          ' <button data-act="spdel" data-c="' + ci.cls + '" data-i="' + o.i + '">Remove</button></span>' + (future ? ' <span class="muted small">(not yet at this level)</span>' : '');
        return spellRow(o.s, ctl);
      }).join('') : '<p class="muted">None yet.</p>');
      // browser
      var pool = E.spellPool(ch, d, ci.cls, ui.any).filter(function (s) {
        if (s.lvl > (ci.maxSpellLvl || 0)) return false;
        if (s.lvl === 0 && !ci.cantripsMax) return false;
        if (ui.lvl !== '' && s.lvl !== +ui.lvl) return false;
        if (ui.q && s.name.toLowerCase().indexOf(ui.q.toLowerCase()) < 0 && s.desc.toLowerCase().indexOf(ui.q.toLowerCase()) < 0) return false;
        return !(ch.spells[ci.cls] || []).some(function (x) { return x.n === s.name; });
      }).sort(function (a, b) { return a.lvl - b.lvl || (a.name < b.name ? -1 : 1); });
      var lvChoices = [{ v: '', t: 'All levels' }]; for (var l = 0; l <= (ci.maxSpellLvl || 0); l++) lvChoices.push({ v: l, t: l ? 'Level ' + l : 'Cantrips' });
      html += '<h4>Add spells</h4><div class="crow">' + select('data-act="spfilt" data-c="' + ci.cls + '" data-f="lvl"', lvChoices, ui.lvl, false) +
        ' <input placeholder="Search name or text" data-act="spq" data-c="' + ci.cls + '" value="' + h(ui.q) + '">' +
        (ci.cls === 'bard' ? ' <label title="Magical Secrets lets bards learn spells from any class"><input type="checkbox" data-act="spany" data-c="' + ci.cls + '"' + (ui.any ? ' checked' : '') + '> any class (Magical Secrets)</label>' : '') +
        ' <span class="muted small">New spells are added "from level ' + L + '" (change with the dropdown).</span></div>';
      html += '<div class="spellpool">' + (pool.length ? pool.map(function (s) { return spellRow(s, ' <button data-act="spadd" data-c="' + ci.cls + '" data-n="' + h(s.name) + '">Add</button>'); }).join('') : '<p class="muted">No spells match.</p>') + '</div>';
      html += '</div>';
    });
    if (d.granted.length) html += '<div class="box"><h3>Other spells (race, features, feats)</h3>' + d.granted.map(function (g) { var s = E.spell(g.name); return s ? spellRow(s, ' <span class="muted small">' + h(g.src) + (g.note ? ' — ' + h(g.note) : '') + '</span>') : '<div>' + h(g.name) + '</div>'; }).join('') + '</div>';
    html += warnBox(d, function (w) { return /cantrip|spell|prepared/i.test(w); });
    if (!ch.created) html += '<div class="next"><button class="primary" data-act="finish">Finish level 1 → Level Plan</button></div>';
    return html + '</section>';
  }

  // ---------- LEVEL PLAN ----------
  function tabPlan(ch) {
    var d = E.compute(ch, ch.levels.length);
    var html = '<section><h2>Level plan</h2><p class="muted small">Level 1 is set in the creation steps. Add levels to plan your character up to 20; choose the class for each level (multiclassing is checked against prerequisites). Use "Show level" at the top to view the sheet at any planned level.</p>';
    var c1 = E.cls(ch.levels[0].cls);
    html += '<div class="lvl"><div class="lvlhead"><b>Level 1</b> — ' + h(c1 ? c1.name : 'no class') + ' 1 <span class="muted small">(edit in the Class step)</span></div></div>';
    for (var n = 2; n <= ch.levels.length; n++) {
      var lv = ch.levels[n - 1], c = E.cls(lv.cls), cl = c ? E.classLevelAt(ch, c.id, n) : 0;
      html += '<div class="lvl"><div class="lvlhead"><b>Level ' + n + '</b> ' + select('data-act="lvcls" data-n="' + n + '"', DB.CLASSES.map(function (x) { return { v: x.id, t: x.name }; }), lv.cls) +
        (c ? ' → ' + h(c.name) + ' ' + cl : '');
      if (c) {
        var avg = c.hd / 2 + 1;
        html += ' &nbsp; HP: ' + select('data-act="hpmode" data-n="' + n + '"', [{ v: 'avg', t: 'Average (' + avg + ')' }, { v: 'roll', t: 'Rolled' }], lv.hp == null ? 'avg' : 'roll', false) +
          (lv.hp != null ? ' <input type="number" min="1" max="' + c.hd + '" class="n" data-act="hproll" data-n="' + n + '" value="' + h(lv.hp) + '"> <span class="muted small">(1–' + c.hd + ', + CON)</span>' : '');
      }
      html += '</div>';
      if (c) {
        html += featureList(E.levelFeatures(ch, n).map(function (f) { return { name: f.name, text: f.text }; }));
        if (cl === c.subLevel) html += subclassSelect(ch, c) + subclassBlurb(ch, c);
        if (c.asi.indexOf(cl) >= 0) html += asiWidget(ch, n);
        E.levelChoices(ch, n).forEach(function (oc) { html += renderChoice(oc, ch); });
      }
      html += '</div>';
    }
    html += '<div class="crow">' + (ch.levels.length < 20 ? '<button class="primary" data-act="addlvl">Add level ' + (ch.levels.length + 1) + '</button>' : '') +
      (ch.levels.length > 1 ? ' <button data-act="dellvl">Remove level ' + ch.levels.length + '</button>' : '') + '</div>';
    html += warnBox(d);
    return html + '</section>';
  }

  // ---------- SHEET ----------
  function tabSheet(ch) {
    var L = vlevel(ch), d = E.compute(ch, L);
    var r = E.race(ch.race), sr = E.subrace(r, ch.subrace), b = E.bg(ch.bg);
    var classes = d.classOrder.map(function (cid) { var c = E.cls(cid), s = d.subclassOf[cid]; return c.name + ' ' + d.classLevels[cid] + (s ? ' (' + s.name + ')' : ''); }).join(' / ');
    var html = '<section class="sheet">';
    html += warnBox(d);
    html += '<div class="shead"><div><div class="big">' + h(ch.name) + '</div><div>' + h(classes || 'No class') + '</div></div>' +
      '<div class="small">Level ' + L + ' · ' + h(sr ? sr.name : r ? r.name : 'No race') + ' · ' + h(b ? b.name : 'No background') + ' · ' + h(ch.alignment || 'No alignment') + (ch.player ? ' · Player: ' + h(ch.player) : '') + '</div></div>';
    // abilities
    html += '<div class="abilrow">' + DB.ABILS.map(function (a) {
      var x = d.abil[a], sv = d.saves[a];
      return '<div class="abox"><div class="aname">' + a + '</div><div class="amod">' + fmt(x.mod) + '</div><div class="ascore">' + x.total + '</div><div class="small">Save ' + fmt(sv.bonus) + (sv.prof ? ' ●' : '') + '</div></div>';
    }).join('') + '</div>';
    // combat
    var hd = Object.keys(d.hitDice).map(function (k) { return d.hitDice[k] + k; }).join(' + ');
    html += '<div class="stats">' + stat('AC', d.ac, d.acSource) + stat('Initiative', fmt(d.init)) + stat('Speed', d.speed + ' ft') + stat('HP max', d.hpMax) + stat('Hit dice', hd) + stat('Proficiency', fmt(d.pb)) +
      stat('Passive Perception', d.passive.Perception) + stat('Passive Insight', d.passive.Insight) + stat('Passive Investigation', d.passive.Investigation) + (d.darkvision ? stat('Darkvision', d.darkvision + ' ft') : '') + '</div>';
    if (d.auraBonus) html += '<div class="small muted">Saves include Aura of Protection +' + d.auraBonus + '.</div>';
    html += '<div class="cols3"><div><h3>Skills</h3><table class="skills">' + Object.keys(d.skills).map(function (s) {
      var x = d.skills[s]; return '<tr><td>' + (x.prof === 2 ? '◆' : x.prof ? '●' : '○') + '</td><td>' + h(s) + ' <span class="muted small">' + x.abil + '</span></td><td>' + fmt(x.bonus) + (x.half ? '<sup title="' + (x.half === 'J' ? 'Jack of All Trades' : 'Remarkable Athlete') + '">' + x.half + '</sup>' : '') + '</td></tr>';
    }).join('') + '</table><div class="small muted">● proficient ◆ expertise' + (d.thievesExpertise ? ' · Expertise: thieves\' tools' : '') + '</div></div>';
    html += '<div><h3>Proficiencies</h3><p class="small"><b>Armor:</b> ' + h(d.armorList.join(', ') || 'none') + '<br><b>Weapons:</b> ' + h(d.weaponsList.join(', ') || 'none') + '<br><b>Tools:</b> ' + h(d.toolsList.join(', ') || 'none') + '<br><b>Languages:</b> ' + h(d.languagesList.join(', ')) +
      (d.resistList.length ? '<br><b>Resistances:</b> ' + h(d.resistList.join(', ')) : '') + '</p>';
    if (d.resources.length) html += '<h3>Class resources</h3><table class="small">' + d.resources.map(function (x) { return '<tr><td>' + h(x.label) + '</td><td><b>' + h(x.value) + '</b></td></tr>'; }).join('') + '</table>';
    if (d.dcs.length) html += '<h3>Save DCs</h3><table class="small">' + d.dcs.map(function (x) { return '<tr><td>' + h(x.label) + '</td><td><b>' + x.dc + '</b></td></tr>'; }).join('') + '</table>';
    html += '</div><div><h3>Attacks</h3>' + attacksTable(d) + '<h3>Equipment</h3><ul class="small">' + (ch.inventory || []).map(function (it) { return '<li>' + h(it.name) + (it.qty > 1 ? ' ×' + it.qty : '') + (it.eq ? ' (equipped)' : '') + (it.bonus ? ' +' + it.bonus : '') + (it.note ? ' — ' + h(it.note) : '') + '</li>'; }).join('') + '</ul>' +
      '<div class="small">' + ['pp', 'gp', 'ep', 'sp', 'cp'].filter(function (k) { return +ch.coins[k]; }).map(function (k) { return ch.coins[k] + ' ' + k; }).join(', ') + '</div></div></div>';
    // spellcasting
    if (d.casting.length || d.granted.length) {
      html += '<h3>Spellcasting</h3>';
      if (d.slots.length || d.pact) html += '<p>Slots: ' + d.slots.map(function (n2, i) { return (i + 1) + ': ' + '☐'.repeat(n2); }).join(' &nbsp; ') + (d.pact ? ' &nbsp; Pact: ' + '☐'.repeat(d.pact.n) + ' (level ' + d.pact.lvl + ')' : '') + '</p>';
      d.casting.forEach(function (ci) {
        var list = ci.chosen.map(function (x) { return { s: E.spell(x.n), prep: x.prep } }).filter(function (o) { return o.s; });
        ci.always.forEach(function (a) { var s = E.spell(a.name); if (s) list.push({ s: s, always: true }); });
        list.sort(function (a, b2) { return a.s.lvl - b2.s.lvl || (a.s.name < b2.s.name ? -1 : 1); });
        html += '<div class="box"><b>' + h(ci.name) + '</b> — ' + ci.abil + ' · DC ' + ci.dc + ' · attack ' + fmt(ci.atk) +
          (ci.caster.mode === 'prepared' ? ' · prepare ' + ci.prepMax : ci.caster.mode === 'spellbook' ? ' · prepare ' + ci.prepMax + ' from spellbook' : '') +
          '<div class="spellgrid">' + groupByLevel(list).map(function (g) { return '<div><b>' + (g.lvl ? 'Level ' + g.lvl : 'Cantrips') + '</b><br>' + g.items.map(function (o) { return h(o.s.name) + (o.always ? ' <small>(always)</small>' : '') + (ci.caster.mode === 'spellbook' && o.s.lvl ? (o.prep ? ' ●' : ' ○') : '') + (o.s.conc ? ' <small>C</small>' : '') + (o.s.ritual ? ' <small>R</small>' : ''); }).join('<br>') + '</div>'; }).join('') + '</div></div>';
      });
      if (d.granted.length) html += '<div class="small"><b>Other spells:</b> ' + d.granted.map(function (g) { return h(g.name) + ' <span class="muted">(' + h(g.src) + (g.note ? ', ' + h(g.note) : '') + ')</span>'; }).join('; ') + '</div>';
    }
    // features
    html += '<h3>Features &amp; traits</h3>';
    if (d.choiceNames.length) html += '<ul class="feats">' + d.choiceNames.map(function (x) { return '<li><b>' + h(x.label.replace(/\s*\(.*\)$/, '')) + ': ' + h(x.name) + '.</b> ' + h(x.text) + '</li>'; }).join('') + '</ul>';
    var groups = {}; d.features.forEach(function (f) { (groups[f.src] = groups[f.src] || []).push(f); });
    Object.keys(groups).forEach(function (g) { html += '<h4>' + h(g) + '</h4>' + featureList(groups[g].map(function (f) { return { name: f.name + (f.lvl ? ' (' + f.lvl + ')' : ''), text: f.text }; })); });
    var nt = ch.notes || {};
    var nts = [['Personality traits', nt.traits], ['Ideals', nt.ideals], ['Bonds', nt.bonds], ['Flaws', nt.flaws], ['Appearance', nt.appearance], ['Backstory', nt.backstory], ['Other notes', nt.other]].filter(function (x) { return x[1]; });
    if (nts.length) html += '<h3>Notes</h3>' + nts.map(function (x) { return '<p><b>' + x[0] + ':</b> ' + h(x[1]).replace(/\n/g, '<br>') + '</p>'; }).join('');
    return html + '</section>';
  }
  function stat(label, val, sub) { return '<div class="stat"><div class="small">' + h(label) + '</div><div class="sval">' + h(val) + '</div>' + (sub ? '<div class="tiny muted">' + h(sub) + '</div>' : '') + '</div>'; }
  function groupByLevel(list) { var g = {}; list.forEach(function (o) { (g[o.s.lvl] = g[o.s.lvl] || []).push(o); }); return Object.keys(g).sort(function (a, b) { return a - b; }).map(function (k) { return { lvl: +k, items: g[k] }; }); }

  // ---------- NOTES ----------
  function tabNotes(ch) {
    var f = [['traits', 'Personality traits'], ['ideals', 'Ideals'], ['bonds', 'Bonds'], ['flaws', 'Flaws'], ['appearance', 'Appearance'], ['backstory', 'Backstory'], ['other', 'Other notes (extra proficiencies, DM rulings, items)']];
    return '<section><h2>Notes</h2>' + f.map(function (x) { return '<label class="block">' + x[1] + '<textarea data-act="note" data-f="' + x[0] + '" rows="' + (x[0] === 'backstory' || x[0] === 'other' ? 6 : 2) + '">' + h(ch.notes[x[0]] || '') + '</textarea></label>'; }).join('') + '</section>';
  }

  // ---------- render ----------
  function render() {
    var ch = cur();
    var root = document.getElementById('app');
    var y = window.scrollY;
    if (APP.tab === 'plan' && !ch.created) APP.tab = 'race';
    var body = { race: tabRace, 'class': tabClass, abilities: tabAbilities, background: tabBackground, equipment: tabEquipment, spells: tabSpells, plan: tabPlan, sheet: tabSheet, notes: tabNotes }[APP.tab] || tabRace;
    root.innerHTML = renderHeader(ch) + '<main>' + body(ch) + '</main>';
    window.scrollTo(0, y);
  }
  APP.render = render;

  function setChoice(ch, key, idx, val) {
    var arr = (ch.choices[key] || []).slice(); arr[idx] = val; ch.choices[key] = arr;
  }
  function clearChoicesWithPrefix(ch, prefix) { Object.keys(ch.choices).forEach(function (k) { if (k.indexOf(prefix) === 0) delete ch.choices[k]; }); }

  // ---------- events ----------
  function onChange(e) {
    var t = e.target, act = t.getAttribute('data-act'); if (!act) return;
    var ch = cur(), v = t.value;
    switch (act) {
      case 'pick': APP.cur = v; break;
      case 'view': ch.viewLevel = +v; break;
      case 'field': ch[t.getAttribute('data-f')] = v; break;
      case 'race': ch.race = v; ch.subrace = ''; clearChoicesWithPrefix(ch, 'race:'); clearChoicesWithPrefix(ch, 'subrace:'); clearChoicesWithPrefix(ch, 'rfeat:');
        var r = E.race(v); if (r && r.subraces.length === 1) ch.subrace = r.subraces[0].id; break;
      case 'subrace': ch.subrace = v; clearChoicesWithPrefix(ch, 'subrace:'); clearChoicesWithPrefix(ch, 'rfeat:'); break;
      case 'choice':
        var key = t.getAttribute('data-key');
        setChoice(ch, key, +t.getAttribute('data-idx'), v);
        if (key === 'subrace:feat') clearChoicesWithPrefix(ch, 'rfeat:');
        if (/:cls$/.test(key)) { var pre = key.replace(/:cls$/, ':'); Object.keys(ch.choices).forEach(function (k) { if (k.indexOf(pre) === 0 && k !== key && k !== pre + 'asi') delete ch.choices[k]; }); }
        break;
      case 'cls1':
        var old = ch.levels[0].cls; ch.levels[0].cls = v;
        if (old && old !== v) { clearChoicesWithPrefix(ch, old + '@1:'); if (!ch.levels.some(function (l) { return l.cls === old; })) delete ch.subclasses[old]; ch.startApplied = ch.startApplied && false; ch.startChoices = {}; }
        break;
      case 'subclass': ch.subclasses[t.getAttribute('data-c')] = v; break;
      case 'method':
        ch.abil.method = v;
        DB.ABILS.forEach(function (a, i) { ch.abil.base[a] = v === 'pointbuy' ? 8 : v === 'array' ? DB.STANDARD_ARRAY[i] : (ch.abil.base[a] || 10); });
        break;
      case 'base':
        var ab = t.getAttribute('data-a'), nv = +v || 0;
        if (ch.abil.method === 'array') {
          var other = DB.ABILS.filter(function (b) { return b !== ab && +ch.abil.base[b] === nv; })[0];
          if (other) ch.abil.base[other] = ch.abil.base[ab];
        }
        ch.abil.base[ab] = nv; break;
      case 'bg': ch.bg = v; clearChoicesWithPrefix(ch, 'bg:'); break;
      case 'startgrp': ch.startChoices['g' + t.getAttribute('data-g')] = +v; break;
      case 'starttok': ch.startChoices[t.getAttribute('data-k')] = v; break;
      case 'inv': var it = ch.inventory[+t.getAttribute('data-i')], f = t.getAttribute('data-f'); it[f] = f === 'note' ? v : +v; break;
      case 'inveq': ch.inventory[+t.getAttribute('data-i')].eq = t.checked; break;
      case 'addcat': APP.addCat = v; break;
      case 'coin': ch.coins[t.getAttribute('data-k')] = +v || 0; break;
      case 'spat': ch.spells[t.getAttribute('data-c')][+t.getAttribute('data-i')].at = +v; break;
      case 'spprep': ch.spells[t.getAttribute('data-c')][+t.getAttribute('data-i')].prep = t.checked; break;
      case 'spfilt': APP.spellUi[t.getAttribute('data-c')].lvl = v; break;
      case 'spany': APP.spellUi[t.getAttribute('data-c')].any = t.checked; break;
      case 'lvcls':
        var n = +t.getAttribute('data-n'), prevCls = ch.levels[n - 1].cls;
        ch.levels[n - 1].cls = v;
        // Choices keyed by class level shift when class changes; clear this level's ASI if no longer an ASI level
        if (prevCls !== v) delete ch.asi[n];
        break;
      case 'hpmode': var lv = ch.levels[+t.getAttribute('data-n') - 1]; lv.hp = v === 'avg' ? null : (lv.hp || 1); break;
      case 'hproll': ch.levels[+t.getAttribute('data-n') - 1].hp = Math.max(1, +v || 1); break;
      case 'asimode': var n2 = t.getAttribute('data-n'); ch.asi[n2] = v === 'feat' ? { mode: 'feat', feat: '' } : { mode: 'asi', a: ['', ''] }; clearChoicesWithPrefix(ch, 'feat@' + n2 + ':'); break;
      case 'asifeat': var n3 = t.getAttribute('data-n'); ch.asi[n3] = { mode: 'feat', feat: v }; clearChoicesWithPrefix(ch, 'feat@' + n3 + ':'); break;
      case 'asiab': var n4 = t.getAttribute('data-n'), rec = ch.asi[n4] || { mode: 'asi', a: ['', ''] }; rec.mode = 'asi'; rec.a = (rec.a || ['', '']).slice(); rec.a[+t.getAttribute('data-i')] = v; ch.asi[n4] = rec; break;
      case 'import': importFile(t.files[0]); return;
      case 'note': case 'spq': return; // handled on input
      default: return;
    }
    save(); render();
  }
  function onInput(e) {
    var t = e.target, act = t.getAttribute('data-act'); if (!act) return;
    var ch = cur();
    if (act === 'note') { ch.notes[t.getAttribute('data-f')] = t.value; save(); }
    else if (act === 'field' && t.tagName === 'INPUT') { ch[t.getAttribute('data-f')] = t.value; save(); }
    else if (act === 'spq') {
      APP.spellUi[t.getAttribute('data-c')].q = t.value;
      clearTimeout(APP.qTimer); var pos = t.selectionStart, c = t.getAttribute('data-c');
      APP.qTimer = setTimeout(function () { render(); var el = document.querySelector('input[data-act="spq"][data-c="' + c + '"]'); if (el) { el.focus(); el.setSelectionRange(pos, pos); } }, 250);
    }
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t || t.tagName === 'SELECT' || t.tagName === 'INPUT' && t.type !== 'button') return;
    var act = t.getAttribute('data-act'), ch = cur();
    switch (act) {
      case 'tab': APP.tab = t.getAttribute('data-t'); window.scrollTo(0, 0); render(); return;
      case 'new': var c = E.newCharacter(); APP.chars.push(c); APP.cur = c.id; APP.tab = 'race'; break;
      case 'dup': var cp = JSON.parse(JSON.stringify(ch)); cp.id = E.newCharacter().id; cp.name = ch.name + ' (copy)'; APP.chars.push(cp); APP.cur = cp.id; break;
      case 'del':
        if (!confirm('Delete "' + ch.name + '"? This can\'t be undone (export it first if you want a backup).')) return;
        APP.chars = APP.chars.filter(function (x) { return x.id !== ch.id; });
        if (!APP.chars.length) APP.chars.push(E.newCharacter());
        APP.cur = APP.chars[0].id; break;
      case 'export': exportFile(ch); return;
      case 'print': APP.tab = 'sheet'; render(); setTimeout(function () { window.print(); }, 50); return;
      case 'roll':
        APP.rolls = []; for (var i = 0; i < 6; i++) { var r = [0, 0, 0, 0].map(function () { return 1 + Math.floor(Math.random() * 6); }).sort(); APP.rolls.push(r[1] + r[2] + r[3]); }
        render(); return;
      case 'applystart': applyStart(ch); break;
      case 'invdel': ch.inventory.splice(+t.getAttribute('data-i'), 1); break;
      case 'additem':
        var name = APP.addCat === 'custom' ? (document.getElementById('customitem') || {}).value : (document.getElementById('additem') || {}).value;
        if (!name) return; addInv(ch, name, 1); break;
      case 'spadd': var cl = t.getAttribute('data-c'); (ch.spells[cl] = ch.spells[cl] || []).push({ n: t.getAttribute('data-n'), at: vlevel(ch), prep: false }); break;
      case 'spdel': ch.spells[t.getAttribute('data-c')].splice(+t.getAttribute('data-i'), 1); break;
      case 'finish': ch.created = true; if (ch.levels.length < 2) { ch.levels.push({ cls: ch.levels[0].cls, hp: null }); } ch.viewLevel = ch.levels.length; APP.tab = 'plan'; break;
      case 'addlvl': if (ch.levels.length < 20) { ch.levels.push({ cls: ch.levels[ch.levels.length - 1].cls, hp: null }); ch.viewLevel = ch.levels.length; } break;
      case 'dellvl':
        if (ch.levels.length > 1) {
          var gone = ch.levels.length; ch.levels.pop(); delete ch.asi[gone]; clearChoicesWithPrefix(ch, 'feat@' + gone + ':');
          ch.viewLevel = Math.min(ch.viewLevel, ch.levels.length);
        }
        break;
      default: return;
    }
    save(); render();
  }
  function addInv(ch, name, qty, eq) {
    var ex = ch.inventory.filter(function (x) { return x.name === name; })[0];
    var item = DB.findItem(name);
    var stack = !item || item.kind === 'gear' || /dart|javelin|handaxe|dagger/i.test(name);
    if (ex && stack) ex.qty = (+ex.qty || 0) + qty;
    else ch.inventory.push({ name: name, qty: qty, eq: !!eq, bonus: 0, note: '' });
  }
  function applyStart(ch) {
    var c = E.cls(ch.levels[0].cls), b = E.bg(ch.bg);
    if (c && c.start) c.start.forEach(function (grp, gi) {
      var oi = ch.startChoices['g' + gi] || 0, opt = grp[oi] || grp[0];
      opt.split(' + ').forEach(function (p, pi) {
        var name = p, qty = 1;
        if (p.charAt(0) === '{') { name = ch.startChoices['g' + gi + 'o' + oi + 'p' + pi]; if (!name) return; }
        var m = /^(.*) x(\d+)$/.exec(name); if (m) { name = m[1]; qty = +m[2]; }
        var it = DB.findItem(name);
        addInv(ch, name, qty, it && (it.kind === 'armor' || it.kind === 'weapon'));
      });
    });
    if (b) { b.equip.forEach(function (n) { addInv(ch, n, 1); }); ch.coins.gp = (+ch.coins.gp || 0) + b.gp; }
    // Only one body armor stays equipped
    var seen = false; ch.inventory.forEach(function (it) { var a = DB.findItem(it.name); if (a && a.kind === 'armor' && a.type !== 'shield' && it.eq) { if (seen) it.eq = false; seen = true; } });
    ch.startApplied = true;
  }
  function exportFile(ch) {
    var blob = new Blob([JSON.stringify(ch, null, 2)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (ch.name || 'character').replace(/[^\w\- ]+/g, '') + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 100);
  }
  function importFile(file) {
    if (!file) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var c = JSON.parse(rd.result);
        if (!c || !c.levels || !c.abil) throw new Error('not a character file');
        migrate(c); c.id = E.newCharacter().id; APP.chars.push(c); APP.cur = c.id; save(); render();
      } catch (err) { alert('Could not import: ' + err.message); }
    };
    rd.readAsText(file);
  }

  document.addEventListener('DOMContentLoaded', function () {
    load();
    var root = document.getElementById('app');
    root.addEventListener('change', onChange);
    root.addEventListener('input', onInput);
    root.addEventListener('click', onClick);
    render();
  });
})(window.DB, window.ENGINE);
