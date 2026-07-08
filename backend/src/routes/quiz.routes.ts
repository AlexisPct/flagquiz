import { Router } from 'express';
import { createSession, getCurrentQuestion, submitAnswer } from '../controllers/quiz.controller';
import { getCountries, getCapitals, getCountriesNames, getCountryByCode} from '../controllers/country.controller';

const router = Router();

router.get('/countries', getCountries);
router.get('/countries/names', getCountriesNames);
router.get('/capitals', getCapitals)
router.get('/countries/:code', getCountryByCode);

router.post('/session', createSession);
router.get('/session/:id', getCurrentQuestion);
router.post('/session/:id/submit', submitAnswer);

export default router;