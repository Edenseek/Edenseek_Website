#!/usr/bin/env node
'use strict';
/*
 * Edenseek Canonical Publishing Engine — Milestone 2 · R1 · Commit 1 (scaffold).
 *
 * Loads canonical platform data (/data/*.json), runs schema-lite validation,
 * and prints a DETERMINISTIC execution report to stdout.
 *
 * Guarantees for Commit 1:
 *   - writes NO files and modifies NO website artifacts (writesPerformed: 0);
 *   - deterministic: output is a pure function of the input bytes (sha256), with
 *     stable ordering and no timestamps/randomness;
 *   - exit 0 if all inputs pass schema-lite; exit 1 on any error (fail-closed).
 *
 * Dev/CI tool only — never a site runtime dependency. Node built-ins only.
 * Run:  node _tools/generator/generate.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const config = require('./config');

function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex'); }

function get(obj, dotted) {
  return dotted.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
}

function isEmpty(v) {
  return v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
}

function validateRecord(errors, scope, index, id, rec, required, tierCheck, coverPath) {
  (required || []).forEach(function (f) {
    if (isEmpty(get(rec, f))) {
      errors.push({ scope: scope, index: index, id: id, message: 'missing required field: ' + f });
    }
  });
  if (tierCheck && !isEmpty(get(rec, 'tier')) && config.tiers.indexOf(rec.tier) === -1) {
    errors.push({ scope: scope, index: index, id: id, message: 'invalid tier: ' + String(rec.tier) });
  }
  if (coverPath && isEmpty(get(rec, coverPath))) {
    errors.push({ scope: scope, index: index, id: id, message: 'missing cover reference: ' + coverPath });
  }
}

function run() {
  const inputs = [];
  const errors = [];
  let totalRecords = 0;

  config.collections.forEach(function (coll) {
    const file = path.join(config.dataDir, coll.file);
    let raw;
    try {
      raw = fs.readFileSync(file);
    } catch (e) {
      errors.push({ scope: coll.key, index: -1, id: null, message: 'cannot read file: ' + coll.file });
      inputs.push({ file: coll.file, sha256: null, recordCount: 0 });
      return;
    }
    let json;
    try {
      json = JSON.parse(raw.toString('utf8'));
    } catch (e) {
      errors.push({ scope: coll.key, index: -1, id: null, message: 'invalid JSON: ' + coll.file });
      inputs.push({ file: coll.file, sha256: sha256(raw), recordCount: 0 });
      return;
    }
    const arr = Array.isArray(json[coll.root]) ? json[coll.root] : [];
    arr.forEach(function (rec, i) {
      const id = rec.slug || (rec.number != null ? String(rec.number) : String(i));
      validateRecord(errors, coll.key, i, id, rec, coll.required, !!coll.tier, coll.cover);
      if (coll.issues && Array.isArray(rec[coll.issues.key])) {
        rec[coll.issues.key].forEach(function (iss, j) {
          const iid = id + '#' + (iss.number != null ? iss.number : j);
          validateRecord(errors, coll.key + '.' + coll.issues.key, j, iid, iss, coll.issues.required, false, coll.issues.cover);
        });
      }
    });
    inputs.push({ file: coll.file, sha256: sha256(raw), recordCount: arr.length });
    totalRecords += arr.length;
  });

  // Deterministic ordering.
  inputs.sort(function (a, b) { return a.file < b.file ? -1 : a.file > b.file ? 1 : 0; });
  errors.sort(function (a, b) {
    const ka = a.scope + '|' + String(a.index + 1000000) + '|' + a.message;
    const kb = b.scope + '|' + String(b.index + 1000000) + '|' + b.message;
    return ka < kb ? -1 : ka > kb ? 1 : 0;
  });

  const report = {
    engine: config.engine,
    stage: 'S1-S2 load + schema-lite validate (R1 Commit 1 scaffold)',
    siteOrigin: config.siteOrigin,
    inputs: inputs,
    validation: { valid: errors.length === 0, errorCount: errors.length, errors: errors },
    summary: {
      collections: config.collections.length,
      totalRecords: totalRecords,
      totalErrors: errors.length,
      writesPerformed: 0,
    },
  };

  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  process.exit(report.validation.valid ? 0 : 1);
}

run();
