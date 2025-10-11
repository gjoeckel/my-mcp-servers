import fs from 'fs';
const path = `${process.env.HOME}/.clasprc.json`;

if (process.env.CLASPRC_JSON) {
  fs.writeFileSync(path, process.env.CLASPRC_JSON);
  console.log('✅ Clasp credentials restored.');
} else {
  console.error('❌ No CLASPRC_JSON found in environment.');
}