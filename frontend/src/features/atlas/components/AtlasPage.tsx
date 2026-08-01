import React, { useState, useEffect } from 'react';
import { type Country } from '../../../types/index';
import "./AtlasPage.css";
import CountryDetailCard from './CountryDetailCard';
import CountriesListAside from './CountriesListAside';
import { quizService } from '../../../services/quiz.service';
import { SimpleGlobe } from '../../globe/SimpleGlobe';

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
                <div className="at-globe-zone">
                    <SimpleGlobe selectedCountryId={selectedCountry?.codeCCN3} onSelectCountry={(countryId) => {
                        const countryClicked = countries.find(c => c.codeCCN3 === countryId)
                        setSelectedCountry(countryClicked || null);
                    }} />
                    {selectedCountry &&
                        <CountryDetailCard country={selectedCountry} onClose={() => setSelectedCountry(null)} />
                    }
                </div>
            </main>
        </div>
    );
};