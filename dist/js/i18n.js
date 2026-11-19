'use strict';

const localization = (() => {
  const translations = {
    "en": {
      "appName": "Images to PDF",
      "description": "Combine your images into one PDF. Add, arrange and download. Private, offline, and free.",
      "darkMode": "Dark mode",
      "privacyTag": "NO UPLOADS. NO SIGN-UP.",
      "headlineStart": "Images in.",
      "headlineEnd": "PDF out.",
      "intro": "Add images. Arrange pages. Download.",
      "images": "Your images",
      "clearAll": "Clear all",
      "languageLabel": "Language",
      "pickEmpty": "Drop your images here",
      "pickMore": "Add more images",
      "chooseImages": "Choose images",
      "supportedTypes": "JPG, PNG, WebP · Max 25 MB each",
      "galleryEmpty": "Choose multiple images at once, or add more later.",
      "galleryOrder": "Each image becomes a page. Use the chevrons to change the order.",
      "galleryLabel": "Images in PDF page order",
      "createPdfLabel": "Create your PDF",
      "pageOne": "page",
      "pageMany": "pages",
      "pageLabel": "Page {n}",
      "pdfSettings": " · A4 · No cropping",
      "download": "Download PDF",
      "start": "Add images to get started.",
      "ready": "Ready when you are.",
      "privateOffline": "Private & offline.",
      "createdBy": "Created by",
      "hapticsOn": "Haptics on",
      "hapticsOff": "Haptics off",
      "hapticsLabel": "Haptic feedback",
      "hapticsHint": "Toggle vibration feedback",
      "soundOn": "Sound on",
      "soundOff": "Sound off",
      "soundLabel": "Sound effects",
      "soundHint": "Toggle sound effects",
      "creatingTitle": "Creating your PDF",
      "preparingImages": "Preparing your images…",
      "progressLabel": "Conversion progress",
      "progressAria": "PDF conversion progress",
      "localNote": "Everything happens on your device.",
      "percent": "{n}%",
      "addingImages": "Adding images…",
      "addingProgress": "Adding image {n} of {total}…",
      "previewAlt": "Preview of {name}",
      "moveEarlier": "Move {name} earlier",
      "moveLater": "Move {name} later",
      "removeImage": "Remove {name}",
      "pageMoved": "Page moved to position {n}.",
      "skipOne": "1 file was skipped. Choose valid JPG, PNG or WebP files up to 25 MB each.",
      "skipMany": "{n} files were skipped. Choose valid JPG, PNG or WebP files up to 25 MB each.",
      "processingUnavailable": "Your browser could not process this image.",
      "encodingFailed": "Image conversion failed. Please try a smaller image.",
      "unexpectedError": "Try smaller images or another browser.",
      "creatingButton": "Creating PDF…",
      "preparingPage": "Preparing page {n} of {total}…",
      "preparedPages": "Prepared {n} of {total} pages",
      "building": "Building your PDF…",
      "finishing": "Finishing your PDF…",
      "pdfReady": "Your PDF is ready",
      "readyOne": "1 page, ready to download.",
      "readyMany": "{n} pages, ready to download.",
      "downloaded": "Your {n}-page PDF is ready. Check your downloads.",
      "conversionError": "Could not create the PDF. {reason}",
      "bytes": "B",
      "kilobytes": "KB",
      "megabytes": "MB"
    },
    "fr": {
      "appName": "Images en PDF",
      "description": "Réunissez vos images en un PDF. Ajoutez, organisez et téléchargez. Privé, gratuit et hors ligne.",
      "darkMode": "Mode sombre",
      "privacyTag": "SANS ENVOI. SANS INSCRIPTION.",
      "headlineStart": "Vos images.",
      "headlineEnd": "Un PDF.",
      "intro": "Ajoutez, classez, téléchargez.",
      "images": "Vos images",
      "clearAll": "Tout effacer",
      "languageLabel": "Langue",
      "pickEmpty": "Déposez vos images ici",
      "pickMore": "Ajouter des images",
      "chooseImages": "Choisir des images",
      "supportedTypes": "JPG, PNG, WebP · 25 Mo/image",
      "galleryEmpty": "Choisissez plusieurs images ou ajoutez-en plus tard.",
      "galleryOrder": "Une image par page. Utilisez les chevrons pour changer l’ordre.",
      "galleryLabel": "Images dans l’ordre des pages du PDF",
      "createPdfLabel": "Créer votre PDF",
      "pageOne": "page",
      "pageMany": "pages",
      "pageLabel": "Page {n}",
      "pdfSettings": " · A4 · Sans recadrage",
      "download": "Télécharger",
      "start": "Ajoutez des images pour commencer.",
      "ready": "Tout est prêt.",
      "privateOffline": "Privé et hors ligne.",
      "createdBy": "Créé par",
      "hapticsOn": "Vibrations oui",
      "hapticsOff": "Vibrations non",
      "hapticsLabel": "Retour haptique",
      "hapticsHint": "Activer ou couper les vibrations",
      "soundOn": "Son activé",
      "soundOff": "Son coupé",
      "soundLabel": "Effets sonores",
      "soundHint": "Activer ou couper les effets sonores",
      "creatingTitle": "Création de votre PDF",
      "preparingImages": "Préparation des images…",
      "progressLabel": "Progression",
      "progressAria": "Progression de la conversion PDF",
      "localNote": "Tout se passe sur votre appareil.",
      "percent": "{n} %",
      "addingImages": "Ajout des images…",
      "addingProgress": "Ajout de l’image {n} sur {total}…",
      "previewAlt": "Aperçu de {name}",
      "moveEarlier": "Avancer {name}",
      "moveLater": "Reculer {name}",
      "removeImage": "Supprimer {name}",
      "pageMoved": "Page déplacée en position {n}.",
      "skipOne": "1 fichier ignoré. Choisissez une image JPG, PNG ou WebP valide de 25 Mo maximum.",
      "skipMany": "{n} fichiers ignorés. Choisissez des images JPG, PNG ou WebP valides de 25 Mo maximum chacune.",
      "processingUnavailable": "Votre navigateur n’a pas pu traiter cette image.",
      "encodingFailed": "La conversion a échoué. Essayez une image plus petite.",
      "unexpectedError": "Essayez des images plus petites ou un autre navigateur.",
      "creatingButton": "Création…",
      "preparingPage": "Préparation de la page {n} sur {total}…",
      "preparedPages": "{n} pages préparées sur {total}",
      "building": "Assemblage du PDF…",
      "finishing": "Finalisation du PDF…",
      "pdfReady": "Votre PDF est prêt",
      "readyOne": "1 page prête à télécharger.",
      "readyMany": "{n} pages prêtes à télécharger.",
      "downloaded": "Votre PDF de {n} pages est prêt. Consultez vos téléchargements.",
      "conversionError": "Impossible de créer le PDF. {reason}",
      "bytes": "o",
      "kilobytes": "Ko",
      "megabytes": "Mo"
    },
    "ar": {
      "appName": "صور إلى PDF",
      "description": "اجمع صورك في ملف PDF واحد. أضف الصور ورتّبها وحمّل الملف. مجاني وخاص ويعمل دون اتصال.",
      "darkMode": "الوضع الداكن",
      "privacyTag": "دون رفع ملفات. دون تسجيل.",
      "headlineStart": "صورك هنا.",
      "headlineEnd": "ملف PDF واحد.",
      "intro": "أضف الصور، رتّب الصفحات، وحمّل الملف.",
      "images": "الصور",
      "clearAll": "حذف الكل",
      "languageLabel": "اللغة",
      "pickEmpty": "أفلت صورك هنا",
      "pickMore": "إضافة صور أخرى",
      "chooseImages": "اختيار الصور",
      "supportedTypes": "JPG، PNG، WebP · حتى ٢٥ م.ب",
      "galleryEmpty": "اختر عدة صور معًا أو أضف المزيد لاحقًا.",
      "galleryOrder": "صورة لكل صفحة. استخدم الأزرار لتغيير الترتيب.",
      "galleryLabel": "الصور حسب ترتيب صفحات PDF",
      "createPdfLabel": "إنشاء ملف PDF",
      "pageOne": "صفحة",
      "pageMany": "صفحات",
      "pageLabel": "صفحة {n}",
      "pdfSettings": " · A4 · دون اقتصاص",
      "download": "تحميل PDF",
      "start": "أضف الصور للبدء.",
      "ready": "كل شيء جاهز.",
      "privateOffline": "خاص ويعمل دون اتصال.",
      "createdBy": "إنشاء",
      "hapticsOn": "الاهتزاز مفعّل",
      "hapticsOff": "الاهتزاز مكتوم",
      "hapticsLabel": "الاهتزاز التفاعلي",
      "hapticsHint": "تفعيل الاهتزاز أو كتمه",
      "soundOn": "الصوت مفعّل",
      "soundOff": "الصوت مكتوم",
      "soundLabel": "المؤثرات الصوتية",
      "soundHint": "تفعيل المؤثرات الصوتية أو كتمها",
      "creatingTitle": "جارٍ إنشاء ملف PDF",
      "preparingImages": "جارٍ تجهيز الصور…",
      "progressLabel": "تقدّم التحويل",
      "progressAria": "تقدّم تحويل ملف PDF",
      "localNote": "كل شيء يتم على جهازك.",
      "percent": "{n}٪",
      "addingImages": "جارٍ إضافة الصور…",
      "addingProgress": "إضافة الصورة {n} من {total}…",
      "previewAlt": "معاينة {name}",
      "moveEarlier": "تقديم {name}",
      "moveLater": "تأخير {name}",
      "removeImage": "حذف {name}",
      "pageMoved": "نُقلت الصفحة إلى الموضع {n}.",
      "skipOne": "تم تخطّي ملف واحد. اختر صور JPG أو PNG أو WebP صالحة بحد أقصى ٢٥ م.ب للصورة.",
      "skipMany": "تم تخطّي {n} ملفات. اختر صور JPG أو PNG أو WebP صالحة بحد أقصى ٢٥ م.ب للصورة.",
      "processingUnavailable": "تعذّر على المتصفح معالجة هذه الصورة.",
      "encodingFailed": "تعذّر تحويل الصورة. جرّب صورة أصغر.",
      "unexpectedError": "جرّب صورًا أصغر أو متصفحًا آخر.",
      "creatingButton": "جارٍ الإنشاء…",
      "preparingPage": "تجهيز الصفحة {n} من {total}…",
      "preparedPages": "تم تجهيز {n} من {total} صفحات",
      "building": "جارٍ تجميع ملف PDF…",
      "finishing": "جارٍ إنهاء ملف PDF…",
      "pdfReady": "ملف PDF جاهز",
      "readyOne": "صفحة واحدة جاهزة للتحميل.",
      "readyMany": "{n} صفحات جاهزة للتحميل.",
      "downloaded": "ملف PDF المكوّن من {n} صفحات جاهز. راجع التنزيلات.",
      "conversionError": "تعذّر إنشاء ملف PDF. {reason}",
      "bytes": "بايت",
      "kilobytes": "ك.ب",
      "megabytes": "م.ب"
    }
  };

  let language = document.documentElement.lang;
  let numberFormatter;
  let sizeFormatter;

  function setLanguage(value) {
    language = preferences.setLanguage(value);
    numberFormatter = new Intl.NumberFormat(language);
    sizeFormatter = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function t(key, params = {}) {
    const text = translations[language][key] || translations.en[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, name) => {
      if (name === 'reason') return t(params.reasonKey || 'unexpectedError');
      const value = params[name];
      return typeof value === 'number' ? numberFormatter.format(value) : String(value ?? '');
    });
  }

  function translatePage() {
    document.title = t('appName');
    document.querySelector('meta[name="description"]').content = t('description');
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      element.title = t(element.dataset.i18nTitle);
    });
  }

  function formatNumber(value) {
    return numberFormatter.format(value);
  }

  function formatSize(bytes) {
    if (bytes < 1024) return `${formatNumber(bytes)} ${t('bytes')}`;
    if (bytes < 1024 ** 2) return `${sizeFormatter.format(bytes / 1024)} ${t('kilobytes')}`;
    return `${sizeFormatter.format(bytes / 1024 ** 2)} ${t('megabytes')}`;
  }

  setLanguage(language);
  return { setLanguage, translatePage, t, formatNumber, formatSize };
})();
