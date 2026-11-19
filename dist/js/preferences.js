'use strict';

const preferences = (() => {
  const languages = ['en', 'fr', 'ar'];

  function read(key) {
    try {
      return localStorage.getItem(`images-to-pdf-${key}`);
    } catch {
      return null;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(`images-to-pdf-${key}`, value);
    } catch {}
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#2D2A2E' : '#FFFAEB';
  }

  function setLanguage(value) {
    const language = languages.includes(value) ? value : 'en';
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    return language;
  }

  setTheme(read('theme') === 'dark' ? 'dark' : 'light');
  setLanguage(read('language'));

  return { read, write, setTheme, setLanguage };
})();
