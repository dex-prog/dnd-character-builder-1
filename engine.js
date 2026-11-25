// Rules engine: turns a saved character (choices + level plan) into computed stats at a given level.
(function (DB) {
  var E = {};
  window.ENGINE = E;

  // ---------- lookups ----------
  E.cls = function (id) { for (var i = 0; i < DB.CLASSES.length; i++) if (DB.CLASSES[i].id === id) return DB.CLASSES[i]; return null; };
  E.sub = function (clsId, subId) { var c = E.cls(clsId); if (!c || !subId) return null; for (var i = 0; i < c.subclasses.length; i++) if (c.subclasses[i].id === subId) return c.subclasses[i]; return null; };
  E.race = function (id) { for (var i = 0; i < DB.RACES.length; i++) if (DB.RACES[i].id === id) return DB.RACES[i]; return null; };
  E.subrace = function (race, id) { if (!race || !race.subraces) return null; for (var i = 0; i < race.subraces.length; i++) if (race.subraces[i].id === id) return race.subraces[i]; return null; };
  E.bg = function (id) { for (var i = 0; i < DB.BACKGROUNDS.length; i++) if (DB.BACKGROUNDS[i].id === id) return DB.BACKGROUNDS[i]; return null; };
  E.feat = function (id) { for (var i = 0; i < DB.FEATS.length; i++) if (DB.FEATS[i].id === id) return DB.FEATS[i]; return null; };
  E.spell = function (name) { return DB.SPELL_INDEX[(name || '').toLowerCase()] || null; };
  E.mod = function (score) { return Math.floor((score - 10) / 2); };
  E.fmt = function (n) { return (n >= 0 ? '+' : '') + n; };
  E.prof = function (level) { return 2 + Math.floor((Math.max(1, level) - 1) / 4); };

  // Resolve an option list (string key into DB.OPTS, or an array)
  E.opts = function (o) {
    if (!o) return [];
    if (typeof o === 'string') return DB.OPTS[o] || [];
    return o.map(function (x) { return typeof x === 'string' ? { id: x, name: x } : x; });
  };
  // Resolve a "from" for skills/tools
  E.fromList = function (def) {
    var f = def.from;
    if (!f || f === 'any') return def.type === 'tool' ? DB.ALL_TOOLS : DB.ALL_SKILLS;
    if (f === 'ARTISAN_OR_INSTRUMENT') return DB.ARTISAN_TOOLS.concat(DB.INSTRUMENTS);
    if (typeof f === 'string') return DB[f] || [];
    return f;
  };

  E.newCharacter = function () {
    return {
      id: 'c' + Date.now() + Math.floor(Math.random() * 1000),
      name: 'New Character', player: '', alignment: '', created: false,
      race: '', subrace: '', bg: '',
      abil: { method: 'pointbuy', base: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 } },
      choices: {}, levels: [{ cls: '', hp: null }], subclasses: {}, asi: {},
      spells: {}, inventory: [], coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, startApplied: false, startChoices: {},
      notes: { traits: '', ideals: '', bonds: '', flaws: '', appearance: '', backstory: '', other: '' },
      viewLevel: 1
    };
  };

  // Class level of class `clsId` at character level `n` (1-based, inclusive)
  E.classLevelAt = function (ch, clsId, n) {
    var c = 0;
    for (var i = 0; i < Math.min(n, ch.levels.length); i++) if (ch.levels[i].cls === clsId) c++;
    return c;
  };

  // ---------- Choice definitions available at each character level ----------
  // Returns [{key, def, src}] for everything chosen at character level n (1-based).
  E.levelChoices = function (ch, n) {
    var out = [];
    var lv = ch.levels[n - 1];
    if (!lv || !lv.cls) return out;
    var c = E.cls(lv.cls); if (!c) return out;
    var cl = E.classLevelAt(ch, lv.cls, n);
    var first = n === 1;
    var srcLabel = c.name + ' ' + cl;
    if (cl === 1) {
      if (first) {
        var sk = c.skills; var from = sk.from;
        out.push({ key: c.id + '@1:skills', def: { id: 'skills', label: 'Class skills (' + sk.n + ')', type: 'skill', n: sk.n, from: from }, src: srcLabel });
        if (c.toolChoice) out.push({ key: c.id + '@1:tools', def: { id: 'tools', label: c.toolChoice.label, type: 'tool', n: c.toolChoice.n, from: c.toolChoice.from }, src: srcLabel });
      } else {
        var mc = DB.MULTICLASS[c.id] || {};
        if (mc.skills) out.push({ key: c.id + '@1:mcskills', def: { id: 'mcskills', label: 'Multiclass skill (' + mc.skills + ')', type: 'skill', n: mc.skills, from: c.skills.from }, src: srcLabel });
        if (mc.tools === 1) out.push({ key: c.id + '@1:mctools', def: { id: 'mctools', label: 'Multiclass instrument', type: 'tool', n: 1, from: mc.toolFrom }, src: srcLabel });
      }
    }
    (c.choices || []).forEach(function (d) { if (d.lvl === cl) out.push({ key: c.id + '@' + cl + ':' + d.id, def: d, src: srcLabel }); });
    var s = E.sub(c.id, ch.subclasses[c.id]);
    if (s && cl >= c.subLevel) (s.choices || []).forEach(function (d) { if (d.lvl === cl) out.push({ key: c.id + '.' + s.id + '@' + cl + ':' + d.id, def: d, src: s.name + ' ' + cl }); });
    // ASI / feat choices
    var asiRec = ch.asi[n];
    if (c.asi.indexOf(cl) >= 0 && asiRec && asiRec.mode === 'feat' && asiRec.feat) {
      var f = E.feat(asiRec.feat);
      if (f) (f.choices || []).forEach(function (d) { out.push({ key: 'feat@' + n + ':' + d.id, def: d, src: f.name, featPrefix: 'feat@' + n }); });
    }
    return out;
  };

  // Race / subrace / background / variant-human feat choices
  E.originChoices = function (ch) {
    var out = [];
    var r = E.race(ch.race), sr = E.subrace(r, ch.subrace), b = E.bg(ch.bg);
    if (r) (r.choices || []).forEach(function (d) { out.push({ key: 'race:' + d.id, def: d, src: r.name }); });
    if (sr) (sr.choices || []).forEach(function (d) { out.push({ key: 'subrace:' + d.id, def: d, src: sr.name }); });
    if (b) {
      if (b.langs) out.push({ key: 'bg:langs', def: { id: 'langs', label: 'Background languages (' + b.langs + ')', type: 'language', n: b.langs }, src: b.name });
      if (b.toolChoice) out.push({ key: 'bg:tools', def: { id: 'tools', label: 'Background tool', type: 'tool', n: b.toolChoice.n, from: b.toolChoice.from }, src: b.name });
      if (b.skillChoice) out.push({ key: 'bg:skills', def: { id: 'skills', label: 'Background skills (' + b.skillChoice + ')', type: 'skill', n: b.skillChoice, from: 'any' }, src: b.name });
      (b.choices || []).forEach(function (d) { out.push({ key: 'bg:' + d.id, def: d, src: b.name }); });
    }
    var vf = (ch.choices['subrace:feat'] || [])[0];
    if (vf) {
      var f = E.feat(vf);
      if (f) (f.choices || []).forEach(function (d) { out.push({ key: 'rfeat:' + d.id, def: d, src: f.name, featPrefix: 'rfeat' }); });
    }
    return out;
  };

  E.allChoices = function (ch, L) {
    var out = E.originChoices(ch);
    for (var n = 1; n <= Math.min(L, ch.levels.length); n++) out = out.concat(E.levelChoices(ch, n));
    return out;
  };

  // Features gained at a given character level n: [{name, text, src}]
  E.levelFeatures = function (ch, n) {
    var lv = ch.levels[n - 1]; if (!lv || !lv.cls) return [];
    var c = E.cls(lv.cls); if (!c) return [];
    var cl = E.classLevelAt(ch, c.id, n);
    var out = c.features.filter(function (f) { return f[0] === cl; }).map(function (f) { return { name: f[1], text: f[2], src: c.name + ' ' + cl }; });
    var s = E.sub(c.id, ch.subclasses[c.id]);
    if (s && cl >= c.subLevel) s.features.filter(function (f) { return f[0] === cl; }).forEach(function (f) { out.push({ name: f[1], text: f[2], src: s.name }); });
    return out;
  };

  // ---------- Feat application ----------
  function featAsi(ch, f, prefix) {
    var res = {};
    if (f.asi) Object.keys(f.asi).forEach(function (k) { res[k] = (res[k] || 0) + f.asi[k]; });
    if (f.asiChoice) { var a = (ch.choices[prefix + ':asi'] || [])[0]; if (a) res[a] = (res[a] || 0) + 1; }
    return res;
  }

  // ---------- MAIN COMPUTE ----------
  E.compute = function (ch, L) {
    L = Math.max(1, Math.min(L || ch.levels.length, ch.levels.length));
    var d = {
      level: L, pb: E.prof(L), classLevels: {}, classOrder: [], warnings: [], features: [],
      armor: {}, weapons: {}, tools: {}, languages: {}, skillProf: {}, skillExp: {}, saveProf: {},
      resist: {}, fx: { acFormulas: [], speed: 0, init: 0, initAbils: [], hpPerLevel: 0, hpPerClassLevel: 0, passiveBonus: 0 },
      granted: [], choiceNames: [], dcs: []
    };
    var r = E.race(ch.race), sr = E.subrace(r, ch.subrace), b = E.bg(ch.bg);
    var choices = ch.choices || {};
    function add(map, list) { (list || []).forEach(function (x) { if (x) map[x] = true; }); }
    function applyFx(fx, scope) {
      if (!fx) return;
      if (fx.acFormula) d.fx.acFormulas.push(fx.acFormula);
      if (fx.speed) d.fx.speed += fx.speed;
      if (fx.init) d.fx.init += fx.init;
      if (fx.initAbil) d.fx.initAbils.push(fx.initAbil);
      if (fx.hpPerLevel) d.fx.hpPerLevel += fx.hpPerLevel;
      if (fx.hpPerClassLevel && scope) d.fx.hpPerClassLevel += fx.hpPerClassLevel * (d.classLevels[scope] || 0);
      if (fx.passiveBonus) d.fx.passiveBonus += fx.passiveBonus;
      if (fx.acBonus) d.fx.acBonus = (d.fx.acBonus || 0) + fx.acBonus;
      if (fx.extraAttack) (d.fx.extraAttacks = d.fx.extraAttacks || []).push(fx.extraAttack);
      if (fx.armor) add(d.armor, fx.armor);
      if (fx.weapons) add(d.weapons, fx.weapons);
      if (fx.skills) fx.skills.forEach(function (s) { d.skillProf[s] = true; });
      if (fx.expertise) fx.expertise.forEach(function (s) { d.skillExp[s] = true; });
      if (fx.resist) add(d.resist, fx.resist);
      if (fx.saveProf) { if (fx.saveProf === 'all') DB.ABILS.forEach(function (a) { d.saveProf[a] = true; }); else add(d.saveProf, fx.saveProf); }
      ['saveBonusAbil', 'jackOfAllTrades', 'remarkableAthlete', 'martialArts', 'unarmoredMovement', 'primalChampion', 'mediumDexCap', 'intWeapon', 'chaWeapon', 'unarmedDie', 'darkvisionPlus', 'acBonusHeavy'].forEach(function (k) { if (fx[k]) d.fx[k] = fx[k]; });
    }

    // ---- class levels ----
    for (var i = 0; i < L; i++) {
      var cid = ch.levels[i].cls; if (!cid) continue;
      if (!d.classLevels[cid]) { d.classLevels[cid] = 0; d.classOrder.push(cid); }
      d.classLevels[cid]++;
    }
    var firstCls = E.cls(ch.levels[0] && ch.levels[0].cls);

    // ---- ability scores ----
    var abil = {};
    DB.ABILS.forEach(function (a) { abil[a] = { base: +ch.abil.base[a] || 8, racial: 0, asi: 0 }; });
    function racial(obj) { if (obj) Object.keys(obj).forEach(function (k) { abil[k].racial += obj[k]; }); }
    if (r) racial(r.asi);
    if (sr) racial(sr.asi);
    var racialPicks = [];
    E.originChoices(ch).forEach(function (oc) { if (oc.def.type === 'ability') (choices[oc.key] || []).forEach(function (a) { if (a) { abil[a].racial += (oc.def.amt || 1); racialPicks.push(a); } }); });
    if (racialPicks.some(function (a, i) { return racialPicks.indexOf(a) !== i; })) d.warnings.push('Racial ability increases must go to different abilities.');
    // Variant human feat ASI
    var vfId = (choices['subrace:feat'] || [])[0];
    var vf = vfId && E.feat(vfId);
    if (vf) { var va = featAsi(ch, vf, 'rfeat'); Object.keys(va).forEach(function (k) { abil[k].racial += va[k]; }); }
    // ASIs and feats in level order (capped at 20)
    var featsTaken = [];
    if (vf) featsTaken.push({ feat: vf, prefix: 'rfeat', at: 1 });
    for (var n = 1; n <= L; n++) {
      var lv = ch.levels[n - 1]; var c = E.cls(lv.cls); if (!c) continue;
      var cl = E.classLevelAt(ch, c.id, n);
      if (c.asi.indexOf(cl) < 0) continue;
      var rec = ch.asi[n];
      if (!rec || (!rec.feat && !(rec.a && (rec.a[0] || rec.a[1])))) { d.warnings.push('Level ' + n + ': choose an Ability Score Improvement or feat.'); continue; }
      var inc = {};
      if (rec.mode === 'feat') {
        var f = E.feat(rec.feat);
        if (f) { featsTaken.push({ feat: f, prefix: 'feat@' + n, at: n }); inc = featAsi(ch, f, 'feat@' + n); }
      } else (rec.a || []).forEach(function (a) { if (a) inc[a] = (inc[a] || 0) + 1; });
      Object.keys(inc).forEach(function (k) {
        var cur = abil[k].base + abil[k].racial + abil[k].asi;
        var room = Math.max(0, 20 - cur);
        if (inc[k] > room) d.warnings.push('Level ' + n + ': ' + k + ' can\'t go above 20 with an ASI (' + (inc[k] - room) + ' point(s) wasted).');
        abil[k].asi += Math.min(inc[k], room);
      });
    }

    // ---- features & fx (need class levels first) ----
    d.subclassOf = {};
    d.classOrder.forEach(function (cid) {
      var c = E.cls(cid), lvl = d.classLevels[cid];
      var s = E.sub(cid, ch.subclasses[cid]);
      if (lvl >= c.subLevel) {
        if (!s) d.warnings.push(c.name + ': choose a ' + c.subName + ' (class level ' + c.subLevel + ').');
        else d.subclassOf[cid] = s;
      } else s = null;
      c.features.forEach(function (f) { if (f[0] <= lvl) { d.features.push({ name: f[1], text: f[2], src: c.name, lvl: f[0] }); applyFx(f[3], cid); } });
      if (s) {
        s.features.forEach(function (f) { if (f[0] <= lvl) { d.features.push({ name: f[1], text: f[2], src: s.name, lvl: f[0] }); applyFx(f[3], cid); } });
        if (s.armor) add(d.armor, s.armor);
        if (s.weapons) add(d.weapons, s.weapons);
        if (s.tools) add(d.tools, s.tools);
        if (s.languages) add(d.languages, s.languages);
        (s.grantedSpells || []).forEach(function (g) { if (lvl >= (g.at || 1)) d.granted.push({ name: g.name, src: s.name, note: g.note || '', cls: cid }); });
        if (s.dc) d.dcs.push({ label: s.dc.label, abil: s.dc.abil });
      }
      (c.grantedSpells || []).forEach(function (g) { if (lvl >= (g.at || 1)) d.granted.push({ name: g.name, src: c.name, note: g.note || '', cls: cid }); });
      if (c.dc) d.dcs.push({ label: c.dc.label, abil: c.dc.abil });
      // proficiencies
      if (cid === (firstCls && firstCls.id)) {
        add(d.armor, c.armor); add(d.weapons, c.weapons); add(d.tools, c.tools); add(d.saveProf, c.saves);
        (c.fixedSkills || []).forEach(function (s2) { d.skillProf[s2] = true; });
      } else {
        var mc = DB.MULTICLASS[cid] || {};
        add(d.armor, mc.armor); add(d.weapons, mc.weapons);
        if (Array.isArray(mc.tools)) add(d.tools, mc.tools);
      }
      add(d.languages, c.languages);
    });
    if (cidIs('monk')) d.fx.martialArtsDie = colVal(E.cls('monk'), 'Martial Arts', d.classLevels.monk);

    // ---- race / background ----
    if (r) {
      add(d.languages, r.languages); add(d.weapons, r.weapons); add(d.armor, r.armor); add(d.tools, r.tools); add(d.resist, r.resist);
      (r.skills || []).forEach(function (s2) { d.skillProf[s2] = true; });
      r.traits.forEach(function (t) { d.features.push({ name: t[0], text: t[1], src: r.name, race: true }); });
      (r.grantedSpells || []).forEach(function (g) { if (L >= g.at) d.granted.push({ name: g.name, src: r.name, note: g.note || '', abil: r.spellAbil }); });
      applyFx(r.fx);
    }
    if (sr) {
      add(d.weapons, sr.weapons); add(d.armor, sr.armor); add(d.tools, sr.tools); add(d.resist, sr.resist);
      (sr.skills || []).forEach(function (s2) { d.skillProf[s2] = true; });
      (sr.traits || []).forEach(function (t) { d.features.push({ name: t[0], text: t[1], src: sr.name, race: true }); });
      (sr.grantedSpells || []).forEach(function (g) { if (L >= g.at) d.granted.push({ name: g.name, src: sr.name, note: g.note || '', abil: sr.spellAbil }); });
      applyFx(sr.fx);
      if (ch.subrace === 'instinct' && !d.classLevels.barbarian) d.warnings.push('Creature of Instinct Bearkin is meant for barbarians only.');
    }
    if (r && ch.race === 'dragonborn') {
      var anc = (choices['race:ancestry'] || [])[0];
      if (anc && DB.DRAGON_TYPES[anc]) { d.resist[DB.DRAGON_TYPES[anc].dmg] = true; d.breath = DB.DRAGON_TYPES[anc]; }
    }
    if (b) {
      (b.skills || []).forEach(function (s2) { if (d.skillProf[s2]) d.warnings.push('Background skill ' + s2 + ' duplicates another proficiency; the PHB lets you pick a replacement skill (use Notes or a Custom background).'); d.skillProf[s2] = true; });
      add(d.tools, b.tools);
      d.features.push({ name: b.feature[0], text: b.feature[1], src: 'Background: ' + b.name });
    }

    // ---- feats ----
    featsTaken.forEach(function (ft) {
      var f = ft.feat;
      d.features.push({ name: f.name, text: f.text, src: 'Feat' });
      applyFx(f.fx);
      if (f.saveFromAsi) { var sa = (choices[ft.prefix + ':asi'] || [])[0]; if (sa) d.saveProf[sa] = true; }
      // prerequisites
      var pre = f.prereq;
      if (pre) {
        if (pre.abil) Object.keys(pre.abil).forEach(function (k) { if (abil[k].base + abil[k].racial < pre.abil[k] && (abil[k].base + abil[k].racial + abil[k].asi) < pre.abil[k]) d.warnings.push(f.name + ' needs ' + k + ' ' + pre.abil[k] + '.'); });
        if (pre.abilAny) { var ok = Object.keys(pre.abilAny).some(function (k) { return abil[k].base + abil[k].racial + abil[k].asi >= pre.abilAny[k]; }); if (!ok) d.warnings.push(f.name + ' prerequisite not met.'); }
        if (pre.armor && !d.armor[pre.armor]) d.warnings.push(f.name + ' needs proficiency with ' + pre.armor.toLowerCase() + '.');
        if (pre.cls) Object.keys(pre.cls).forEach(function (k) { if ((d.classLevels[k] || 0) < pre.cls[k]) d.warnings.push(f.name + ' needs ' + k + ' level ' + pre.cls[k] + '.'); });
      }
      if (!f.repeatable && featsTaken.filter(function (x) { return x.feat.id === f.id; }).length > 1 && f.id !== 'elementaladept') d.warnings.push('Feat ' + f.name + ' taken more than once.');
    });

    // ---- generic choices ----
    var all = E.allChoices(ch, L);
    var expertisePending = [];
    all.forEach(function (oc) {
      var def = oc.def, vals = (choices[oc.key] || []).filter(Boolean);
      if (vals.length < def.n && !def.optional) d.warnings.push(oc.src + ': ' + def.label + ' (' + vals.length + '/' + def.n + ' chosen).');
      switch (def.type) {
        case 'skill':
          vals.forEach(function (v) {
            if (def.expertiseIfProf && d.skillProf[v]) d.skillExp[v] = true;
            else { if (d.skillProf[v] && !def.expertise) d.warnings.push(oc.src + ': ' + v + ' is already proficient from another source.'); d.skillProf[v] = true; }
            if (def.expertise) d.skillExp[v] = true;
          });
          break;
        case 'expertise': expertisePending.push({ vals: vals, src: oc.src }); break;
        case 'tool': add(d.tools, vals); break;
        case 'language': add(d.languages, vals); break;
        case 'save': add(d.saveProf, vals); break;
        case 'weapon': add(d.weapons, vals); break;
        case 'spell':
          var clsSrc = oc.key.split('@')[0].split('.')[0];
          vals.forEach(function (v) { d.granted.push({ name: v, src: oc.src, note: def.spellLvl >= 6 && oc.key.indexOf('warlock') === 0 ? 'Mystic Arcanum, 1/long rest' : '', cls: E.cls(clsSrc) ? clsSrc : null }); });
          break;
        case 'list':
          var os = E.opts(def.opts);
          vals.forEach(function (v) {
            var o = os.filter(function (x) { return x.id === v; })[0];
            if (o) {
              d.choiceNames.push({ label: def.label, name: o.name, text: o.text || '', src: oc.src, id: o.id, optsKey: typeof def.opts === 'string' ? def.opts : null });
              applyFx(o.fx);
              if (o.req && o.req.lvl) { var clsId = oc.key.split('@')[0].split('.')[0]; if ((d.classLevels[clsId] || 0) < o.req.lvl) d.warnings.push(o.name + ' requires class level ' + o.req.lvl + '.'); }
              if (o.req && o.req.pact) { var pact = d.choiceNames.filter(function (x) { return x.optsKey === 'pactBoon'; })[0]; if (!pact || pact.id !== o.req.pact) d.warnings.push(o.name + ' requires Pact of the ' + o.req.pact + '.'); }
            }
          });
          var dupe = vals.filter(function (v, idx) { return vals.indexOf(v) !== idx; });
          if (dupe.length && def.opts !== 'aegis') d.warnings.push(oc.src + ': duplicate selection in ' + def.label + '.');
          break;
      }
    });
    // fighting style duplicates across sources
    var styles = d.choiceNames.filter(function (x) { return x.optsKey && x.optsKey.indexOf('fightingStyle') === 0; }).map(function (x) { return x.id; });
    d.styles = {}; styles.forEach(function (s2) { if (d.styles[s2]) d.warnings.push('You have the ' + s2 + ' fighting style twice; pick a different one.'); d.styles[s2] = true; });
    expertisePending.forEach(function (ep) {
      ep.vals.forEach(function (v) {
        if (v !== "Thieves' tools" && !d.skillProf[v]) d.warnings.push(ep.src + ': expertise in ' + v + ' needs proficiency in it.');
        if (v === "Thieves' tools") d.thievesExpertise = true; else d.skillExp[v] = true;
      });
    });

    // ---- final abilities ----
    d.abil = {};
    DB.ABILS.forEach(function (a) {
      var t = abil[a].base + abil[a].racial + abil[a].asi;
      if (d.fx.primalChampion && (a === 'STR' || a === 'CON')) t = Math.min(24, t + 4);
      d.abil[a] = { base: abil[a].base, racial: abil[a].racial, asi: abil[a].asi, total: t, mod: E.mod(t) };
    });
    var M = function (a) { return d.abil[a].mod; };

    // ---- multiclass prerequisites ----
    for (var m = 2; m <= L; m++) {
      var lvm = ch.levels[m - 1], prev = ch.levels.slice(0, m - 1).map(function (x) { return x.cls; });
      if (lvm.cls && prev.indexOf(lvm.cls) < 0) {
        var sc = scoresAt(ch, m - 1);
        [lvm.cls].concat(prev.filter(function (x, i2) { return prev.indexOf(x) === i2; })).forEach(function (cc) {
          var mcr = DB.MULTICLASS[cc]; if (!mcr) return;
          var ok2 = mcr.req.some(function (alt) { return Object.keys(alt).every(function (k) { return sc[k] >= alt[k]; }); });
          if (!ok2) d.warnings.push('Level ' + m + ': multiclassing into ' + E.cls(lvm.cls).name + ' needs ' + reqText(mcr) + ' for ' + E.cls(cc).name + ' (at that point you have ' + DB.ABILS.map(function (k) { return k + ' ' + sc[k]; }).join(', ') + ').' + (mcr.assumed ? ' (Homebrew requirement assumed.)' : ''));
        });
      }
    }

    // ---- HP ----
    var hp = 0, hd = {};
    for (var h = 1; h <= L; h++) {
      var cc2 = E.cls(ch.levels[h - 1].cls); if (!cc2) continue;
      hd['d' + cc2.hd] = (hd['d' + cc2.hd] || 0) + 1;
      var gain = h === 1 ? cc2.hd : (ch.levels[h - 1].hp != null && ch.levels[h - 1].hp !== '' ? +ch.levels[h - 1].hp : cc2.hd / 2 + 1);
      hp += Math.max(1, gain + M('CON'));
    }
    hp += d.fx.hpPerLevel * L + d.fx.hpPerClassLevel;
    d.hpMax = hp; d.hitDice = hd;

    // ---- saves ----
    d.saves = {};
    var auraBonus = d.fx.saveBonusAbil ? Math.max(1, M(d.fx.saveBonusAbil)) : 0;
    DB.ABILS.forEach(function (a) { d.saves[a] = { prof: !!d.saveProf[a], bonus: M(a) + (d.saveProf[a] ? d.pb : 0) + auraBonus }; });
    d.auraBonus = auraBonus;

    // ---- skills ----
    d.skills = {};
    var skillList = DB.ALL_SKILLS.concat(Object.keys(DB.EXTRA_SKILLS).filter(function (s2) { return d.skillProf[s2]; }));
    skillList.forEach(function (s2) {
      var ab = DB.SKILLS[s2] || DB.EXTRA_SKILLS[s2];
      var p = d.skillExp[s2] && d.skillProf[s2] ? 2 : (d.skillProf[s2] ? 1 : 0);
      var bonus = M(ab) + p * d.pb;
      var half = '';
      if (!p && d.fx.jackOfAllTrades) { bonus += Math.floor(d.pb / 2); half = 'J'; }
      if (!p && d.fx.remarkableAthlete && ['STR', 'DEX', 'CON'].indexOf(ab) >= 0) { bonus = M(ab) + Math.ceil(d.pb / 2); half = 'R'; }
      d.skills[s2] = { abil: ab, prof: p, bonus: bonus, half: half };
    });
    d.passive = {
      Perception: 10 + d.skills.Perception.bonus + d.fx.passiveBonus,
      Investigation: 10 + d.skills.Investigation.bonus + d.fx.passiveBonus,
      Insight: 10 + d.skills.Insight.bonus
    };

    // ---- armor / AC ----
    var inv = ch.inventory || [];
    var body = null, shield = null;
    inv.forEach(function (it) {
      if (!it.eq) return; var a = DB.findItem(it.name);
      if (a && a.kind === 'armor') { if (a.type === 'shield') shield = { a: a, it: it }; else if (!body) body = { a: a, it: it }; }
    });
    var shieldAC = shield ? 2 + (+shield.it.bonus || 0) : 0;
    var cands = [];
    if (body) {
      var a = body.a, dexAdd = a.type === 'light' ? M('DEX') : a.type === 'medium' ? Math.min(M('DEX'), d.fx.mediumDexCap || 2) : 0;
      var val = a.ac + dexAdd + (+body.it.bonus || 0) + shieldAC + (d.styles.defense ? 1 : 0);
      cands.push({ val: val, name: a.name + (shieldAC ? ' + shield' : '') + (d.styles.defense ? ' + Defense style' : '') });
      var profKey = { light: 'Light armor', medium: 'Medium armor', heavy: 'Heavy armor' }[a.type];
      if (!d.armor[profKey]) d.warnings.push('Not proficient with ' + a.name + ' (' + profKey.toLowerCase() + '): disadvantage on STR/DEX rolls and no spellcasting.');
      if (a.str && d.abil.STR.total < a.str) d.warnings.push(a.name + ' needs STR ' + a.str + ': speed -10 ft.');
      d.heavyArmor = a.type === 'heavy';
      d.stealthDis = a.stealthDis && !(a.type === 'medium' && d.fx.mediumDexCap);
    } else {
      cands.push({ val: 10 + M('DEX') + shieldAC, name: 'Unarmored (10 + DEX)' + (shieldAC ? ' + shield' : '') });
      d.fx.acFormulas.forEach(function (f) {
        if (!f.shield && shield) return;
        var v = f.base; f.add.forEach(function (ab) { v += M(ab); });
        cands.push({ val: v + (f.shield ? shieldAC : 0), name: f.name + ' (' + f.base + ' + ' + f.add.join(' + ') + ')' + (f.shield && shieldAC ? ' + shield' : '') });
      });
    }
    if (shield && !d.armor.Shields) d.warnings.push('Not proficient with shields.');
    var noble = d.subclassOf.warlord && d.subclassOf.warlord.nobleAC && d.classLevels.warlord >= 3;
    if (noble && !shield && !d.heavyArmor) cands.forEach(function (c2) { c2.val += Math.min(2, Math.max(0, M('CHA'))); c2.name += ' + Divine Right'; });
    if (d.fx.acBonusHeavy && d.heavyArmor) cands.forEach(function (c2) { c2.val += d.fx.acBonusHeavy; c2.name += ' + Soul of the Forge'; });
    if (d.fx.acBonus) cands.forEach(function (c2) { c2.val += d.fx.acBonus; c2.name += ' + ' + d.fx.acBonus + ' racial'; });
    cands.sort(function (x, y) { return y.val - x.val; });
    d.ac = cands[0].val; d.acSource = cands[0].name;
    d.wearingArmor = !!body; d.hasShield = !!shield;

    // ---- speed / initiative ----
    var speed = (sr && sr.speed) || (r ? r.speed : 30);
    var extra = d.fx.speed;
    if (d.classLevels.barbarian >= 5 && d.heavyArmor) extra -= 10; // Fast Movement doesn't work in heavy armor
    if (d.fx.unarmoredMovement && !body && !shield) { var um = colVal(E.cls('monk'), 'Unarmored Movement', d.classLevels.monk); if (um && um !== '-') extra += parseInt(um, 10); }
    if (body && body.a.str && d.abil.STR.total < body.a.str && ch.race !== 'dwarf') extra -= 10;
    d.speed = speed + extra;
    var init = M('DEX') + d.fx.init;
    d.fx.initAbils.forEach(function (ab) { init += Math.max(0, M(ab)); });
    if (d.fx.jackOfAllTrades) init += Math.floor(d.pb / 2);
    else if (d.fx.remarkableAthlete) init += Math.ceil(d.pb / 2);
    d.init = init;
    d.darkvision = Math.max((sr && sr.darkvision) || 0, (r && r.darkvision) || 0);
    if (d.fx.darkvisionPlus) d.darkvision = d.darkvision ? d.darkvision + 30 : 60;

    // ---- resources (class table columns) ----
    d.resources = [];
    d.classOrder.forEach(function (cid) {
      var c = E.cls(cid), lvl = d.classLevels[cid];
      var cols = Object.assign({}, c.cols || {}, (d.subclassOf[cid] && d.subclassOf[cid].cols) || {});
      Object.keys(cols).forEach(function (k) { var v = cols[k][lvl - 1]; if (v !== '-' && v !== undefined && v !== 0) d.resources.push({ label: k, value: v, src: c.name }); });
    });

    // ---- spellcasting ----
    computeCasting(ch, d, M);

    // ---- attacks ----
    computeAttacks(ch, d, M, inv);

    // ---- class DCs ----
    d.dcs = d.dcs.map(function (x) { return { label: x.label, dc: 8 + d.pb + M(x.abil), atk: d.pb + M(x.abil), abil: x.abil }; });
    if (d.classLevels.monk >= 2) d.dcs.push({ label: 'Ki save DC', dc: 8 + d.pb + M('WIS'), abil: 'WIS' });
    if (d.subclassOf.fighter && d.subclassOf.fighter.id === 'battlemaster') d.dcs.push({ label: 'Maneuver save DC', dc: 8 + d.pb + Math.max(M('STR'), M('DEX')), abil: 'STR/DEX' });
    if (d.breath) {
      var dl = L, dice = dl >= 16 ? '5d6' : dl >= 11 ? '4d6' : dl >= 6 ? '3d6' : '2d6';
      d.dcs.push({ label: 'Breath weapon (' + d.breath.area + ', ' + d.breath.save + ' save, ' + dice + ' ' + d.breath.dmg + ')', dc: 8 + d.pb + M('CON'), abil: 'CON' });
    }

    // dedupe lists
    ['armor', 'weapons', 'tools', 'languages', 'resist'].forEach(function (k) { d[k + 'List'] = Object.keys(d[k]).sort(); });
    d.warnings = d.warnings.filter(function (w, i3) { return d.warnings.indexOf(w) === i3; });
    return d;

    function cidIs(id) { return !!d.classLevels[id]; }
  };

  function reqText(mcr) { return mcr.req.map(function (alt) { return Object.keys(alt).map(function (k) { return k + ' ' + alt[k]; }).join(' and '); }).join(' or '); }
  function colVal(c, name, lvl) { if (!c || !c.cols || !c.cols[name] || !lvl) return null; return c.cols[name][lvl - 1]; }
  E.colVal = colVal;

  // Ability scores (before class-level-n ASIs), used for multiclass checks at level n+1.
  function scoresAt(ch, n) {
    var tmp = JSON.parse(JSON.stringify(ch));
    tmp.levels = ch.levels.slice(0, Math.max(1, n));
    var dd = E.computeAbilitiesOnly(tmp);
    return dd;
  }
  E.computeAbilitiesOnly = function (ch) {
    var res = {}, r = E.race(ch.race), sr = E.subrace(r, ch.subrace);
    DB.ABILS.forEach(function (a) { res[a] = +ch.abil.base[a] || 8; });
    [r && r.asi, sr && sr.asi].forEach(function (o) { if (o) Object.keys(o).forEach(function (k) { res[k] += o[k]; }); });
    E.originChoices(ch).forEach(function (oc) { if (oc.def.type === 'ability') (ch.choices[oc.key] || []).forEach(function (a) { if (a) res[a] += (oc.def.amt || 1); }); });
    var vf = E.feat((ch.choices['subrace:feat'] || [])[0]);
    if (vf) { var va = featAsi(ch, vf, 'rfeat'); Object.keys(va).forEach(function (k) { res[k] += va[k]; }); }
    for (var n = 1; n <= ch.levels.length; n++) {
      var c = E.cls(ch.levels[n - 1].cls); if (!c) continue;
      if (c.asi.indexOf(E.classLevelAt(ch, c.id, n)) < 0) continue;
      var rec = ch.asi[n]; if (!rec) continue;
      var inc = {};
      if (rec.mode === 'feat') { var f = E.feat(rec.feat); if (f) inc = featAsi(ch, f, 'feat@' + n); }
      else (rec.a || []).forEach(function (a) { if (a) inc[a] = (inc[a] || 0) + 1; });
      Object.keys(inc).forEach(function (k) { res[k] = Math.min(20, res[k] + inc[k]) > res[k] ? Math.min(20, res[k] + inc[k]) : res[k]; });
    }
    return res;
  };

  // ---------- spellcasting ----------
  function ownSlots(type, lvl) {
    if (type === 'full') return DB.FULL_SLOTS[lvl - 1] || [];
    if (type === 'half') return lvl >= 2 ? DB.FULL_SLOTS[Math.ceil(lvl / 2) - 1] : [];
    if (type === 'third') return lvl >= 3 ? DB.FULL_SLOTS[Math.ceil(lvl / 3) - 1] : [];
    return [];
  }
  E.ownSlots = ownSlots;

  function computeCasting(ch, d, M) {
    d.casting = [];
    var casterLevel = 0, nonPact = [];
    d.classOrder.forEach(function (cid) {
      var c = E.cls(cid), lvl = d.classLevels[cid], s = d.subclassOf[cid];
      var cs = c.caster || (s && s.caster);
      if (!cs) return;
      var info = { cls: cid, name: c.name, caster: cs, lvl: lvl, abil: cs.abil, mod: M(cs.abil) };
      info.dc = 8 + d.pb + info.mod; info.atk = d.pb + info.mod;
      if (cid === 'fighter' && s && s.id === 'kt_crusader' && lvl >= 10) { var sf = Math.floor(Math.max(M('STR'), M('DEX')) / 2); info.dc += sf; info.atk += sf; info.note = 'Includes Strength of Faith +' + sf; }
      info.cantripsMax = cs.cantrips ? (cs.cantrips[lvl - 1] || 0) : 0;
      if (s && s.cantripBonus && lvl >= c.subLevel) info.cantripsMax += s.cantripBonus;
      if (cs.mode === 'known') {
        info.knownMax = cs.known[lvl - 1] || 0;
        if (s && s.knownBonus) Object.keys(s.knownBonus).forEach(function (k) { if (lvl >= +k) info.knownMax += s.knownBonus[k]; });
      }
      if (cs.mode === 'prepared' || cs.mode === 'spellbook') {
        info.prepMax = Math.max(1, info.mod + (cs.prepHalf ? Math.floor(lvl / 2) : lvl));
        if (s && s.prepBonus) Object.keys(s.prepBonus).forEach(function (k) { if (lvl >= +k) info.prepMax += s.prepBonus[k]; });
      }
      if (cs.mode === 'spellbook') info.bookFree = 6 + 2 * (lvl - 1);
      if (cs.type === 'pact') {
        var p = DB.PACT_SLOTS[lvl - 1]; info.pact = { n: p[0], lvl: p[1] }; info.maxSpellLvl = p[1];
      } else {
        var os = ownSlots(cs.type, lvl); info.maxSpellLvl = os.length; info.ownSlots = os;
        if (os.length) nonPact.push(info);
        casterLevel += cs.type === 'full' ? lvl : cs.type === 'half' ? Math.floor(lvl / 2) : Math.floor(lvl / 3);
      }
      if (cs.type === 'half' && lvl < 2) info.notYet = 'Spell slots start at class level 2.';
      if (cs.type === 'third' && lvl < 3) info.notYet = 'Spellcasting starts at class level 3.';
      // always-prepared / bonus spells
      info.always = [];
      if (s && s.spells && lvl >= c.subLevel) Object.keys(s.spells).forEach(function (k) { if (lvl >= +k) s.spells[k].forEach(function (n2) { info.always.push({ name: n2, at: +k }); }); });
      if (s && s.landSpells) {
        var t = (ch.choices[cid + '.' + s.id + '@2:terrain'] || [])[0];
        if (t && DB.LAND_SPELLS[t]) Object.keys(DB.LAND_SPELLS[t]).forEach(function (k) { if (lvl >= +k) DB.LAND_SPELLS[t][k].forEach(function (n2) { info.always.push({ name: n2, at: +k }); }); });
      }
      info.expanded = [];
      if (s && s.expanded) Object.keys(s.expanded).forEach(function (k) { s.expanded[k].forEach(function (n2) { info.expanded.push(n2); }); });
      // chosen spells counted up to this character level
      var list = (ch.spells[cid] || []).filter(function (x) { return (x.at || 1) <= d.level; });
      info.chosen = list;
      var cantrips = list.filter(function (x) { var sp = E.spell(x.n); return sp && sp.lvl === 0; });
      var leveled = list.filter(function (x) { var sp = E.spell(x.n); return sp && sp.lvl > 0; });
      info.cantripCount = cantrips.length; info.leveledCount = leveled.length;
      info.prepCount = cs.mode === 'spellbook' ? leveled.filter(function (x) { return x.prep; }).length : leveled.length;
      var tooHigh = leveled.filter(function (x) { var sp = E.spell(x.n); return sp.lvl > info.maxSpellLvl; });
      if (tooHigh.length) d.warnings.push(c.name + ': ' + tooHigh.map(function (x) { return x.n; }).join(', ') + ' above your max spell level (' + info.maxSpellLvl + ') at this level.');
      if (info.cantripCount > info.cantripsMax) d.warnings.push(c.name + ': ' + info.cantripCount + ' cantrips chosen, max ' + info.cantripsMax + '.');
      if (cs.mode === 'known' && info.leveledCount > info.knownMax) d.warnings.push(c.name + ': ' + info.leveledCount + ' spells known, max ' + info.knownMax + '.');
      if (cs.mode !== 'known' && info.prepCount > info.prepMax) d.warnings.push(c.name + ': ' + info.prepCount + ' spells prepared, max ' + info.prepMax + '.');
      if (cs.mode === 'spellbook' && info.leveledCount < info.bookFree) info.bookNote = 'Spellbook has ' + info.leveledCount + ' spells; you get ' + info.bookFree + ' free by this level.';
      d.casting.push(info);
    });
    // slots
    if (nonPact.length === 1) d.slots = nonPact[0].ownSlots.slice();
    else if (nonPact.length > 1) d.slots = (DB.FULL_SLOTS[casterLevel - 1] || []).slice();
    else d.slots = [];
    d.multiclassCaster = nonPact.length > 1;
    d.pact = null;
    d.casting.forEach(function (ci) { if (ci.pact) d.pact = ci.pact; });
  }

  // ---------- attacks ----------
  function profWith(d, w) {
    var base = w.name.replace(' (KT)', '');
    if (w.cat.indexOf('simple') === 0 && d.weapons['Simple weapons']) return true;
    if (w.cat.indexOf('martial') === 0 && d.weapons['Martial weapons']) return true;
    if (d.weapons[base] || d.weapons[base + 's'] || d.weapons[w.name]) return true;
    if (base === 'Shortsword' && d.weapons.Shortswords) return true;
    return false;
  }
  function computeAttacks(ch, d, M, inv) {
    d.attacks = [];
    var mainHandWeapons = inv.filter(function (it) { var w = DB.findItem(it.name); return it.eq && w && w.kind === 'weapon'; });
    var ma = d.fx.martialArts && !d.wearingArmor && !d.hasShield;
    mainHandWeapons.forEach(function (it) {
      var w = DB.findItem(it.name);
      var props = w.props || '';
      var ranged = w.cat.indexOf('ranged') > 0;
      var finesse = props.indexOf('finesse') >= 0;
      var monkWeapon = ma && (w.name === 'Shortsword' || (w.cat === 'simple-melee' && props.indexOf('heavy') < 0 && props.indexOf('two-handed') < 0));
      var abil = ranged ? 'DEX' : 'STR';
      if (finesse || monkWeapon) abil = M('DEX') > M('STR') ? 'DEX' : 'STR';
      var mod = M(abil);
      var note = [];
      if (d.fx.intWeapon && !ranged && M('INT') > mod) { mod = M('INT'); abil = 'INT'; note.push('INT (Spellblade technique)'); }
      if (d.fx.chaWeapon && props.indexOf('two-handed') < 0 && M('CHA') > mod) { mod = M('CHA'); abil = 'CHA'; note.push('CHA (Hex Warrior, if this is your hex weapon)'); }
      var pr = profWith(d, w);
      var bonus = +it.bonus || 0;
      var hit = mod + (pr ? d.pb : 0) + bonus + (ranged && d.styles.archery ? 2 : 0);
      var die = w.dmg;
      if (monkWeapon && d.fx.martialArtsDie) { if (dieAvg(d.fx.martialArtsDie) > dieAvg(die)) die = d.fx.martialArtsDie; }
      var dmgBonus = mod + bonus + (!ranged && d.styles.dueling && props.indexOf('two-handed') < 0 ? 2 : 0);
      var dmg = die === '—' ? '—' : die + (dmgBonus ? ' ' + E.fmt(dmgBonus) : '') + ' ' + w.type;
      var vers = /versatile \((\w+)\)/.exec(props);
      if (vers) note.push('two-handed: ' + vers[1] + (mod + bonus ? ' ' + E.fmt(mod + bonus) : ''));
      if (!pr) note.push('not proficient');
      if (d.classLevels.barbarian && !ranged && abil === 'STR') note.push('+rage damage while raging');
      if (d.styles.gwf && !ranged && (props.indexOf('two-handed') >= 0 || vers)) note.push('GWF: reroll 1s and 2s');
      var rng = /\((\d+\/\d+)\)/.exec(props);
      d.attacks.push({ name: it.name + (bonus ? ' +' + bonus : ''), hit: hit, dmg: dmg, abil: abil, range: ranged ? (rng ? rng[1] + ' ft' : '') : (props.indexOf('reach') >= 0 ? '10 ft' : '5 ft') + (props.indexOf('thrown') >= 0 && rng ? ', thrown ' + rng[1] : ''), notes: note.join('; '), props: props });
    });
    (d.fx.extraAttacks || []).forEach(function (x) {
      var die = x.die === 'MA' ? (d.fx.martialArtsDie || '1d4') : x.die, am = M(x.abil);
      d.attacks.push({ name: x.name, hit: am + d.pb, dmg: die + (am ? ' ' + E.fmt(am) : '') + ' ' + x.type, abil: x.abil, range: x.range || '5 ft', notes: x.notes || '' });
    });
    // Unarmed
    var uDie = '1', uType = 'bludgeoning', uAbil = 'STR', uName = 'Unarmed strike';
    var r = E.race(ch.race);
    if (r && r.unarmed) { uDie = r.unarmed.die; uType = r.unarmed.type; uName = r.unarmed.name; }
    if (d.fx.unarmedDie && dieAvg(d.fx.unarmedDie) > dieAvg(uDie)) uDie = d.fx.unarmedDie;
    if (ma && d.fx.martialArtsDie && dieAvg(d.fx.martialArtsDie) > dieAvg(uDie)) uDie = d.fx.martialArtsDie;
    if (ma) uAbil = M('DEX') > M('STR') ? 'DEX' : 'STR';
    var um = M(uAbil);
    d.attacks.push({ name: uName, hit: um + d.pb, dmg: (uDie === '1' ? Math.max(1, 1 + um) + '' : uDie + (um ? ' ' + E.fmt(um) : '')) + ' ' + uType, abil: uAbil, range: '5 ft', notes: ma ? 'Martial Arts' : '' });
  }
  function dieAvg(s) { var m = /(\d*)d(\d+)/.exec(s || ''); if (!m) return +s || 0; return (+(m[1] || 1)) * (+m[2] + 1) / 2; }

  // Available spells for a class's picker: list + subclass expansions
  E.spellPool = function (ch, d, cid, anyClass) {
    var c = E.cls(cid), info = (d.casting || []).filter(function (x) { return x.cls === cid; })[0];
    if (!info) return [];
    var code = info.caster.list;
    var extra = {}; (info.expanded || []).forEach(function (n) { extra[n.toLowerCase()] = true; });
    return DB.SPELLS.filter(function (s) {
      if (anyClass) return s.classes.length > 0 || extra[s.name.toLowerCase()];
      return s.classes.indexOf(code) >= 0 || extra[s.name.toLowerCase()];
    });
  };
})(window.DB);
