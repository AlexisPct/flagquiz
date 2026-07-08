import { Country } from '../types';
import fs from 'fs';
import path from 'path';

let countriesCache: Country[] = [];

export const initializeCountries = async (): Promise<void> => {
  try {
    console.log('⏳ Chargement de la base de données globale fusionnée...');
    
    const filePath = path.join(__dirname, '..', '..', 'data', 'countries_all.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    countriesCache = JSON.parse(fileContent) as Country[];

    console.log(`✅ Base de données finale initialisée : ${countriesCache.length} pays prêts pour le quiz !`);
  } catch (error) {
    console.error('❌ Erreur lors du chargement du fichier countries_all.json :', error);
  }
};

export const getCountries = (): Country[] => {
  return countriesCache;
};