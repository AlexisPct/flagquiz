import { Country } from '../types';

let countries: Country[] = [];

export const setCountries = (data: any[]) => {
  countries = data;
  console.log(`✅ ${countries.length} pays chargés en mémoire.`);
};

export const getCountries = (): Country[] => {
  return countries;
};