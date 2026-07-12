import React, { useState, useEffect } from 'react';
import { type Country } from '../../../types/index';
import "./AtlasPage.css";
import CountryDetailCard from './CountryDetailCard';
import CountriesListAside from './CountriesListAside';
import { quizService } from '../../../services/quiz.service';
import { SimpleGlobe } from '../../quiz/components/SimpleGlobe';

export const AtlasPage: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    useEffect(() => {
        quizService.getCountries()
            .then((data) => {
                setCountries(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div className="at-layout">
            <CountriesListAside
                countries={countries}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
            />

            <main className="at-main-content">
                {selectedCountry ?
                    <div className="at-globe-zone">
                        <SimpleGlobe size={400} selectedCountryId={selectedCountry?.codeCCN3} />
                        <CountryDetailCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />
                    </div>
                    :
                    <div className="at-empty-profile">
                        <p>Sélectionnez un pays pour afficher sa fiche détaillée.</p>
                        <SimpleGlobe size={400} />
                    </div>
                }
            </main>
        </div>
    );
};