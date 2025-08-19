
const COUNTRY_STORAGE_KEY = 'telecorProjectCountries';

const initialCountries: string[] = [
  'El Salvador', 
  'Bahamas', 
  'Dominica', 
  'St. Maarten', 
  'Curacao',
  'Surinam', 
  'Bonaire', 
  'Barbados', 
  'British Virgin Islands',
  'Islas Caimán', 
  'México', 
  'Nicaragua', 
  'Belize', 
  'República Dominicana'
];

export const getCountries = (): string[] => {
  try {
    const storedCountriesJSON = localStorage.getItem(COUNTRY_STORAGE_KEY);
    if (storedCountriesJSON) {
      const parsed = JSON.parse(storedCountriesJSON);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Could not get countries from localStorage. Using defaults.", e);
  }
  
  // Fallback for first time run or if stored data is corrupt/inaccessible
  try {
    localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(initialCountries));
  } catch(e) {
    console.error("Could not save initial countries to localStorage.", e);
  }
  return initialCountries;
};

export const addCountry = (country: string): string[] => {
  const currentCountries = getCountries();
  if (country && !currentCountries.includes(country)) {
    const newCountries = [...currentCountries, country].sort((a, b) => a.localeCompare(b));
    try {
      localStorage.setItem(COUNTRY_STORAGE_KEY, JSON.stringify(newCountries));
      return newCountries;
    } catch (e) {
      console.error("Could not save new country list to localStorage.", e);
      // Return original list if save fails
      return currentCountries;
    }
  }
  return currentCountries;
};