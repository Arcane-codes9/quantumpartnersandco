import { useTranslation } from 'react-i18next';

export const useEnhancedTranslation = () => {
  const { t, i18n } = useTranslation();

  // Helper function to safely get translations with fallback
  const getTranslation = (key: string, fallback: string = '') => {
    try {
      const translation = t(key);
      return translation !== key ? translation : fallback;
    } catch (error) {
      console.warn(`Translation key "${key}" not found, using fallback`);
      return fallback;
    }
  };

  // Helper function to get nested translations safely
  const getNestedTranslation = (baseKey: string, nestedKey: string, fallback: string = '') => {
    const fullKey = `${baseKey}.${nestedKey}`;
    return getTranslation(fullKey, fallback);
  };

  // Helper function to check if a translation exists
  const hasTranslation = (key: string): boolean => {
    try {
      const translation = t(key);
      return translation !== key;
    } catch {
      return false;
    }
  };

  // Helper function to get current language
  const getCurrentLanguage = (): string => {
    return i18n.language;
  };

  // Helper function to change language
  const changeLanguage = async (language: string): Promise<void> => {
    try {
      await i18n.changeLanguage(language);
    } catch (error) {
      console.error(`Failed to change language to ${language}:`, error);
    }
  };

  // Helper function to get available languages
  const getAvailableLanguages = (): string[] => {
    return Object.keys(i18n.options.resources || {});
  };

  return {
    t,
    i18n,
    getTranslation,
    getNestedTranslation,
    hasTranslation,
    getCurrentLanguage,
    changeLanguage,
    getAvailableLanguages
  };
}; 