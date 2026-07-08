const BASE_URL = 'http://localhost:5000/api/quiz';

export interface QuizConfigPayload {
  type: string;
  count: number;
  difficulty: 'standard' | 'expert';
}

export interface QuizSessionResponse {
  sessionId: string;
  questions: any[];
}

export const quizService = {
  /**
   * Initialise une nouvelle session de quiz auprès du backend Node.js
   */
  async startSession(config: QuizConfigPayload): Promise<QuizSessionResponse> {
    const response = await fetch(`${BASE_URL}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    if (!response.ok) throw new Error(`Erreur startSession: ${response.status}`);
    return response.json();
  },

  async fetchNextQuestion(sessionId: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/session/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Impossible de récupérer la question suivante (Status: ${response.status})`);
    }

    return response.json();
  },

  /**
   * Soumet une réponse au backend pour validation
   */
  async submitAnswer(sessionId: string, questionId: string, answer: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId, answer }),
    });

    if (!response.ok) throw new Error(`Erreur submitAnswer: ${response.status}`);
    return response.json();
  },

  /**
   * Récupère la liste complète des noms de pays triés pour l'autocomplétion
   */
  async getCountriesForAutocomplete(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/countries/names`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Erreur getCountries: ${response.status}`);
    return response.json();
  },

   /**
   * Récupère la liste complète des capitales triées pour l'autocomplétion
   */
  async getCapitalsForAutocomplete(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/capitals`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`Erreur getCapitals: ${response.status}`);
    return response.json();
  },
};