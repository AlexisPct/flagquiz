// mergeCountries.js
const fs = require('fs');
const path = require('path');

const filesToMerge = [
  'europe.json',
  'africa.json',
  'asia.json',
  'america.json',
  'oceania.json'
];

const dataDir = path.join(__dirname, 'data');
const outputFilePath = path.join(dataDir, 'countries_all.json');

let allMergedCountries = [];
let totalRawObjects = 0;

console.log('⏳ Début de la fusion des fichiers JSON v5...');

filesToMerge.forEach((fileName) => {
  const filePath = path.join(dataDir, fileName);

  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Fichier introuvable, ignoré : ${fileName}`);
    return;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonResponse = JSON.parse(fileContent);
    const rawCountries = jsonResponse.data?.objects;

    if (!Array.isArray(rawCountries)) {
      console.warn(`⚠️ Structure invalide dans ${fileName} (data.objects manquant)`);
      return;
    }

    totalRawObjects += rawCountries.length;
    console.log(`🔍 ${fileName} : ${rawCountries.length} objets bruts trouvés.`);

    const cleaned = rawCountries
      .filter((item) => {
        return (
          item.names?.common &&
          item.capitals &&
          item.capitals.length > 0 &&
          item.flag?.url_png &&
          item.codes?.alpha_2 &&
          item.codes?.ccn3 && 
          item.population && 
          item.area.kilometers
        );
      })
      .map((item) => {
        const mainCapital = item.capitals.find(c => c.attributes?.primary) || item.capitals[0];
        
        return {
          name: item.names.common,
          capital: mainCapital.name,
          flagUrl: item.flag.url_png,
          codeAlpha2: item.codes.alpha_2,
          codeCCN3: item.codes.ccn3,
          population: item.population,
          area: item.area.kilometers,
          continent: item.region || 'Inconnu'           
        };
      });

    allMergedCountries = allMergedCountries.concat(cleaned);

  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${fileName} :`, error.message);
  }
});

try {
  fs.writeFileSync(outputFilePath, JSON.stringify(allMergedCountries, null, 2), 'utf-8');
  console.log('\n--------------------------------------------');
  console.log(`🎉 Fusion terminée avec succès !`);
  console.log(`📦 Total objets bruts analysés : ${totalRawObjects}`);
  console.log(`✅ Total pays valides et enregistrés : ${allMergedCountries.length}`);
  console.log(`💾 Fichier créé : src/data/countries_all.json`);
  console.log('--------------------------------------------');
} catch (error) {
  console.error("❌ Impossible d'écrire le fichier final :", error.message);
}