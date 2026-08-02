import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  // Hook to access translation function
  const { t } = useTranslation(); // defaults to "common" namespace

  return (
    <div>
      {/* This key comes from locales/en/common.json */}
      <h1>{t('welcome_message')}</h1>

      {/* Nested keys also work */}
      <button>{t('buttons.start')}</button>
    </div>
  );
}