#!/usr/bin/env node
// Genera juego/firebase-rules.json a partir del catálogo de juego/tienda.js, para que los precios
// de la tienda también los valide Firebase (no se puede "comprar" sin gastar las monedas).
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'tienda.js'), 'utf8'), ctx);
const T = ctx.window.TIENDA;

const defaults = { bg: T.bg[0].id, pad: T.pad[0].id, ball: T.ball[0].id };
const own = {};
for (const cat of ['bg', 'pad', 'ball'])
  for (const it of T[cat].filter(i => i.price > 0)) {
    own[`${cat}_${it.id}`] = {
      '.validate': `newData.val() === true && (data.exists() || newData.parent().parent().child('sp').val() - root.child('wallets').child(auth.uid).child('sp').val() >= ${it.price})`
    };
  }
own['$other'] = { '.validate': false };
const eq = {};
for (const cat of ['bg', 'pad', 'ball'])
  eq[cat] = { '.validate': `newData.isString() && (newData.val() === '${defaults[cat]}' || newData.parent().parent().child('own').child('${cat}_' + newData.val()).val() === true)` };
eq['$other'] = { '.validate': false };

const rules = {
  rules: {
    '.read': false,
    '.write': false,
    // Marcadores: cada cuenta escribe solo su propio registro y su puntaje nunca baja.
    scores: {
      '.read': true,
      '.indexOn': ['s'],
      $uid: {
        '.write': "auth != null && auth.uid === $uid && (!data.exists() || newData.child('s').val() >= data.child('s').val())",
        '.validate': "newData.hasChildren(['n', 'k', 's', 't']) && auth.token.email === newData.child('k').val() + '@tio-pato.invalid'",
        n: { '.validate': 'newData.isString() && newData.val().length >= 1 && newData.val().length <= 16' },
        k: { '.validate': "newData.isString() && newData.val().matches(/^[a-z0-9.]{3,24}$/)" },
        s: { '.validate': 'newData.isNumber() && newData.val() >= 0 && newData.val() <= 100000 && newData.val() % 1 === 0' },
        t: { '.validate': 'newData.val() === now' },
        $other: { '.validate': false }
      }
    },
    // Monedas y compras: solo la propia cuenta las ve y las cambia.
    // c = monedas ganadas en total (solo sube, hasta 500 por escritura) · sp = monedas gastadas (solo sube y nunca pasa de c)
    // own = lo comprado (cada cosa exige gastar al menos su precio) · eq = lo que tienes puesto (solo cosas tuyas)
    wallets: {
      $uid: {
        '.read': 'auth != null && auth.uid === $uid',
        '.write': 'auth != null && auth.uid === $uid',
        '.validate': "newData.hasChildren(['c', 'sp']) && newData.child('sp').val() <= newData.child('c').val()",
        c: { '.validate': 'newData.isNumber() && newData.val() % 1 === 0 && newData.val() >= 0 && newData.val() <= 10000000 && (!data.exists() ? newData.val() <= 500 : (newData.val() >= data.val() && newData.val() - data.val() <= 500))' },
        sp: { '.validate': 'newData.isNumber() && newData.val() % 1 === 0 && newData.val() >= 0 && (!data.exists() || newData.val() >= data.val())' },
        own, eq,
        $other: { '.validate': false }
      }
    }
  }
};
fs.writeFileSync(path.join(dir, 'firebase-rules.json'), JSON.stringify(rules, null, 2) + '\n');
console.log('firebase-rules.json generado con', Object.keys(own).length - 1, 'artículos de pago');
