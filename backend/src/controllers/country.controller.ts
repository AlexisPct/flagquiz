import { RequestHandler } from 'express';
import * as countryService from '../services/country.service';

/**
 * GET /api/quiz/countries
 * Récupère la liste de tous les pays
 */
export const getCountries: RequestHandler = async (req, res, next) => {
  try {
    const countries = await countryService.getCountries();
    res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/countries/names
 * Récupère la liste de tous les noms de pays
 */
export const getCountriesNames: RequestHandler = async (req, res, next) => {
  try {
    const countries = await countryService.getCountries().map(c => c.name)
    res.status(200).json(countries);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/capitals
 * Récupère la liste de tous les noms de pays
 */
export const getCapitals: RequestHandler = async (req, res, next) => {
  try {
    const capitals = await countryService.getCountries().map(c => c.capital)
    res.status(200).json(capitals);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/quiz/countries/:code
 * Récupère les détails complets d'un pays spécifique via son code ISO (ex: /api/quiz/countries/fr).
 */
export const getCountryByCode: RequestHandler<{ code: string }> = async (req, res, next) => {
  try {
    const { code } = req.params;

    const countries = await countryService.getCountries();
    const country = countries.find(
      (c) => c.codeAlpha2.toLowerCase() === code.toLowerCase()
    );

    if (!country) {
      res.status(404).json({
        status: 'error',
        message: `Le pays avec le code '${code}' n'existe pas dans notre base de données.`,
      });
      return;
    }

    res.status(200).json(country);
  } catch (error) {
    next(error);
  }
};