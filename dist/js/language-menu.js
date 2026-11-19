'use strict';

function initializeLanguageMenu(selectLanguage, feedback) {
  const languageControl = document.querySelector('#language');
  const languageOptions = document.querySelector('#language-options');
  const languageValue = document.querySelector('#language-value');
  const languageButtons = [...languageOptions.querySelectorAll('[data-language]')];

  function setLanguage(language) {
    for (const button of languageButtons) {
      const selected = button.dataset.language === language;
      button.setAttribute('aria-pressed', String(selected));
      if (selected) {
        languageValue.textContent = button.textContent;
        languageValue.lang = language;
      }
    }
  }

  function setDisabled(disabled) {
    languageControl.disabled = disabled;
    if (disabled && !languageOptions.hidden) closeLanguageOptions();
  }

  function closeLanguageOptions(restoreFocus = false) {
    languageOptions.hidden = true;
    languageControl.setAttribute('aria-expanded', 'false');
    if (restoreFocus) languageControl.focus();
  }

  function openLanguageOptions(index = languageButtons.findIndex(button => button.dataset.language === document.documentElement.lang)) {
    if (languageControl.disabled) return;
    languageOptions.hidden = false;
    languageControl.setAttribute('aria-expanded', 'true');
    languageButtons[Math.max(0, index)]?.focus();
  }

  languageControl.addEventListener('click', () => {
    if (languageControl.disabled) return;
    feedback();
    if (languageOptions.hidden) openLanguageOptions();
    else closeLanguageOptions();
  });

  languageControl.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    openLanguageOptions(event.key === 'ArrowDown' ? 0 : languageButtons.length - 1);
  });

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (languageControl.disabled) return;
      const language = button.dataset.language;
      feedback();
      selectLanguage(language);
      closeLanguageOptions(true);
    });
  });

  languageOptions.addEventListener('keydown', event => {
    const current = languageButtons.indexOf(event.target);
    const count = languageButtons.length;
    const targets = {
      ArrowDown: (current + 1) % count,
      ArrowUp: (current - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    if (!Object.hasOwn(targets, event.key)) return;
    const next = targets[event.key];
    event.preventDefault();
    languageButtons[next].focus();
  });

  const languagePicker = languageControl.parentElement;
  languagePicker.addEventListener('focusout', event => {
    if (event.relatedTarget && !languagePicker.contains(event.relatedTarget)) closeLanguageOptions();
  });

  document.addEventListener('pointerdown', event => {
    if (!languagePicker.contains(event.target)) closeLanguageOptions();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !languageOptions.hidden) {
      event.preventDefault();
      closeLanguageOptions(true);
    }
  });

  return { setLanguage, setDisabled };
}
