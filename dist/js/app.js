'use strict';

(() => {
  const { t, formatNumber, formatSize } = localization;
  const { play: feedback, refreshLabels, animateElement } = initializeFeedback(t);
  const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
  const maxImageBytes = 25 * 1024 ** 2;
  const minimumConversionTime = 2000;
  const completionAnimationTime = 400;
  const progressAnimationTime = minimumConversionTime - completionAnimationTime;

  function updateCounter(element, value) {
    if (String(element.textContent) === String(value)) return;
    element.textContent = value;
    animateElement(element, [{ opacity: .5, transform: 'translateY(4px) scale(.85)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }]);
  }

  const themeToggle = document.querySelector('#theme-toggle');

  function applyTheme(theme) {
    preferences.setTheme(theme);
    themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
  }

  applyTheme(document.documentElement.dataset.theme || 'light');
  themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    feedback();
    animateElement(themeToggle, [{ transform: 'translate(2px, 2px)' }, { transform: 'translate(0, 0)' }], { duration: 180 });
    preferences.write('theme', theme);
  });

  const input = document.querySelector('#files');
  const gallery = document.querySelector('#images');
  const download = document.querySelector('#download');
  const downloadLabel = document.querySelector('#download-label');
  const status = document.querySelector('#status');
  const pickerTitle = document.querySelector('#picker-title');
  const dropzone = document.querySelector('#dropzone');
  const clear = document.querySelector('#clear');
  const conversionDialog = document.querySelector('#conversion-dialog');
  const conversionTitle = document.querySelector('#conversion-title');
  const conversionDetail = document.querySelector('#conversion-detail');
  const conversionProgress = document.querySelector('#conversion-progress');
  const conversionPercent = document.querySelector('#conversion-percent');
  const images = [];
  let statusMessage = { key: 'start', params: {}, error: false };
  let busy = false;
  let loadingImages = false;
  let dragDepth = 0;
  let conversionFrame = 0;
  const languageMenu = initializeLanguageMenu(language => {
    applyLanguage(language);
    preferences.write('language', language);
  }, feedback);

  function applyLanguage(value) {
    localization.setLanguage(value);
    localization.translatePage();
    languageMenu.setLanguage(document.documentElement.lang);
    refreshLabels();
    renderImages();
    downloadLabel.textContent = t('download');
    message(statusMessage.key, statusMessage.params, statusMessage.error, false);
  }

  const wait = milliseconds => new Promise(resolve => setTimeout(resolve, Math.max(0, milliseconds)));
  conversionDialog.addEventListener('cancel', event => event.preventDefault());

  function displayProgress(value) {
    conversionProgress.value = value;
    const percent = t('percent', { n: Math.floor(value) });
    conversionProgress.textContent = percent;
    conversionPercent.textContent = percent;
  }

  function startConversion(started) {
    let target = 0;
    let displayed = 0;
    let previous = started;
    conversionDialog.classList.remove('is-complete');
    conversionTitle.textContent = t('creatingTitle');
    conversionDetail.textContent = t('preparingImages');
    displayProgress(0);
    conversionDialog.showModal();
    function tick(now) {
      const elapsed = Math.min(1, (now - started) / progressAnimationTime);
      const timeLimit = 96 * (1 - Math.pow(1 - elapsed, 3));
      const smoothing = 1 - Math.exp(-Math.max(0, now - previous) / 90);
      displayed += (Math.min(target, timeLimit) - displayed) * smoothing;
      previous = now;
      displayProgress(displayed);
      conversionFrame = requestAnimationFrame(tick);
    }
    conversionFrame = requestAnimationFrame(tick);
    return (percent, detail) => {
      target = percent;
      conversionDetail.textContent = detail;
    };
  }

  function message(key, params = {}, error = false, replay = true) {
    statusMessage = { key, params, error };
    const text = t(key, params);
    const changed = status.textContent !== text;
    status.textContent = text;
    status.classList.toggle('error', error);
    if (changed) animateElement(status, [{ opacity: .35, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 180 });
    if (error && replay) feedback('error');
  }

  function readyMessage() {
    return images.length ? 'ready' : 'start';
  }

  function updateControls() {
    const wasDisabled = download.disabled;
    input.disabled = busy;
    languageMenu.setDisabled(busy);
    input.setAttribute('aria-busy', String(loadingImages));
    download.disabled = busy || !images.length;
    clear.hidden = !images.length;
    clear.disabled = busy;
    gallery.querySelectorAll('button').forEach(button => {
      button.disabled = busy || button.dataset.boundary === 'true';
    });
    pickerTitle.textContent = t(loadingImages ? 'addingImages' : images.length ? 'pickMore' : 'pickEmpty');
    dropzone.classList.toggle('compact', images.length > 0);
    dropzone.classList.toggle('is-loading', loadingImages);
    updateCounter(document.querySelector('#image-count'), formatNumber(images.length));
    updateCounter(document.querySelector('#page-count'), formatNumber(images.length));
    document.querySelector('#page-unit').textContent = t(images.length === 1 || (document.documentElement.lang === 'ar' && images.length > 10) ? 'pageOne' : 'pageMany');
    document.querySelector('#total-size').textContent = images.length ? formatSize(images.reduce((sum, image) => sum + image.size, 0)) : '—';
    document.querySelector('#gallery-hint').textContent = t(images.length ? 'galleryOrder' : 'galleryEmpty');
    gallery.setAttribute('aria-busy', String(busy));
    if (wasDisabled && !download.disabled) animateElement(download, [{ transform: 'translateY(3px)' }, { transform: 'translateY(0)' }], { duration: 220 });
  }

  function actionButton(path, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'icon-button ' + className;
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
    return button;
  }

  function createImageCard(image) {
    const card = document.createElement('div');
    card.className = 'slot';
    const previewWrap = document.createElement('div');
    previewWrap.className = 'preview-wrap';
    const title = document.createElement('p');
    title.className = 'slot-title';
    const preview = document.createElement('img');
    preview.src = image.url;
    previewWrap.append(preview, title);
    const info = document.createElement('div');
    info.className = 'card-info';
    const name = document.createElement('p');
    name.className = 'name';
    name.dir = 'auto';
    name.textContent = image.name;
    name.title = image.name;
    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';
    const size = document.createElement('span');
    size.className = 'file-size';
    const actions = document.createElement('div');
    actions.className = 'card-actions';
    [-1, 1].forEach(direction => {
      const earlier = direction === -1;
      const move = actionButton(earlier ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6', earlier ? 'earlier' : 'later');
      move.addEventListener('click', () => {
        const index = images.indexOf(image);
        const target = index + direction;
        if (busy || index < 0 || target < 0 || target >= images.length) return;
        feedback('move');
        [images[index], images[target]] = [images[target], images[index]];
        renderImages();
        message('pageMoved', { n: target + 1 });
        const card = gallery.children[target];
        const sameControl = card.querySelector(earlier ? '.earlier' : '.later');
        (sameControl.disabled ? card.querySelector('.remove') : sameControl).focus();
      });
      actions.append(move);
    });
    const remove = actionButton('M6 6l12 12M6 18 18 6', 'remove');
    remove.addEventListener('click', () => {
      const index = images.indexOf(image);
      if (busy || index < 0) return;
      feedback('remove');
      image.motion?.cancel();
      images.splice(index, 1);
      URL.revokeObjectURL(image.url);
      renderImages();
      message(readyMessage());
      const remaining = gallery.querySelectorAll('.remove');
      (remaining[Math.min(index, remaining.length - 1)] || input).focus();
    });
    actions.append(remove);
    bottom.append(size, actions);
    info.append(name, bottom);
    card.append(previewWrap, info);
    return card;
  }

  function updateImageCard(image, index) {
    const card = image.card;
    card.querySelector('.slot-title').textContent = t('pageLabel', { n: index + 1 });
    card.querySelector('img').alt = t('previewAlt', { name: image.name });
    card.querySelector('.file-size').textContent = formatSize(image.size);
    card.querySelector('.earlier').dataset.boundary = String(index === 0);
    card.querySelector('.later').dataset.boundary = String(index === images.length - 1);
    for (const [selector, key] of [['.earlier', 'moveEarlier'], ['.later', 'moveLater'], ['.remove', 'removeImage']]) {
      const button = card.querySelector(selector);
      const label = t(key, { name: image.name });
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }

  function renderImages() {
    const scrollTop = gallery.scrollTop;
    const previous = new Map();
    const cards = images.map((image, index) => {
      if (image.card) {
        previous.set(image, image.card.getBoundingClientRect());
        image.motion?.cancel();
      } else {
        image.card = createImageCard(image);
      }
      updateImageCard(image, index);
      return image.card;
    });
    gallery.replaceChildren(...cards);
    updateControls();
    gallery.scrollTop = scrollTop;
    let entering = 0;
    images.forEach(image => {
      const before = previous.get(image);
      if (before) {
        const after = image.card.getBoundingClientRect();
        const x = before.left - after.left;
        const y = before.top - after.top;
        if (Math.abs(x) + Math.abs(y) > 1) image.motion = animateElement(image.card, [{ transform: 'translate(' + x + 'px,' + y + 'px)' }, { transform: 'translate(0,0)' }], { duration: 320 });
      } else {
        image.motion = animateElement(image.card, [{ opacity: 0, transform: 'translateY(14px) scale(.97)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }], { duration: 320, delay: Math.min(entering++ * 35, 140) });
      }
    });
  }

  async function addFiles(files) {
    if (!files.length || busy) return;
    busy = true;
    loadingImages = true;
    updateControls();
    let rejected = 0;
    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        let url;
        message('addingProgress', { n: index + 1, total: files.length });
        try {
          if (!supportedImageTypes.has(file.type) || file.size > maxImageBytes) {
            rejected++;
            continue;
          }
          url = URL.createObjectURL(file);
          const img = new Image();
          img.src = url;
          await img.decode();
          if (!img.naturalWidth || !img.naturalHeight) throw new Error('Empty image');
          images.push({ img, url, name: file.name, size: file.size });
        } catch {
          if (url) URL.revokeObjectURL(url);
          rejected++;
        }
      }
    } finally {
      input.value = '';
      busy = false;
      loadingImages = false;
      renderImages();
    }
    message(rejected ? rejected === 1 ? 'skipOne' : 'skipMany' : readyMessage(), { n: rejected }, rejected > 0);
    if (!rejected) feedback('success');
  }

  input.addEventListener('click', () => { if (!busy) feedback(); });
  input.addEventListener('change', () => addFiles([...input.files]));
  clear.addEventListener('click', () => {
    if (busy) return;
    feedback('remove');
    images.forEach(image => { image.motion?.cancel(); URL.revokeObjectURL(image.url); });
    images.length = 0;
    renderImages();
    message(readyMessage());
    animateElement(dropzone, [{ opacity: .6, transform: 'scale(.985)' }, { opacity: 1, transform: 'scale(1)' }]);
    input.focus();
  });
  dropzone.addEventListener('dragenter', event => {
    event.preventDefault();
    if (!busy) { if (!dragDepth) feedback(); dragDepth++; dropzone.classList.add('dragging'); }
  });
  dropzone.addEventListener('dragover', event => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = busy ? 'none' : 'copy';
  });
  dropzone.addEventListener('dragleave', event => {
    event.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) dropzone.classList.remove('dragging');
  });
  dropzone.addEventListener('drop', event => {
    event.preventDefault();
    dragDepth = 0;
    dropzone.classList.remove('dragging');
    addFiles([...event.dataTransfer.files]);
  });

  download.addEventListener('click', async () => {
    if (busy || !images.length) return;
    feedback();
    busy = true;
    updateControls();
    downloadLabel.textContent = t('creatingButton');
    const started = performance.now();
    try {
      const progress = startConversion(started);
      await wait(0);
      const pages = [];
      for (let index = 0; index < images.length; index++) {
        progress(index / images.length * 92, t('preparingPage', { n: index + 1, total: images.length }));
        pages.push(await pdfGenerator.toJpeg(images[index].img));
        progress((index + 1) / images.length * 92, t('preparedPages', { n: index + 1, total: images.length }));
        await wait(0);
      }
      progress(92, t('building'));
      await wait(0);
      const pdf = pdfGenerator.makePdf(pages);
      progress(96, t('finishing'));
      const settlingTime = progressAnimationTime - (performance.now() - started);
      if (settlingTime > 0) await wait(settlingTime);
      cancelAnimationFrame(conversionFrame);
      displayProgress(100);
      conversionDialog.classList.add('is-complete');
      conversionTitle.textContent = t('pdfReady');
      conversionDetail.textContent = t(images.length === 1 ? 'readyOne' : 'readyMany', { n: images.length });
      feedback('success');
      const remainingTime = minimumConversionTime - (performance.now() - started);
      if (remainingTime > 0) await wait(remainingTime);
      const url = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'images.pdf';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      message('downloaded', { n: images.length });
    } catch (error) {
      message('conversionError', { reasonKey: ['processingUnavailable', 'encodingFailed'].includes(error.message) ? error.message : 'unexpectedError' }, true);
    } finally {
      cancelAnimationFrame(conversionFrame);
      busy = false;
      downloadLabel.textContent = t('download');
      updateControls();
      if (conversionDialog.open) conversionDialog.close();
      download.focus();
    }
  });
  applyLanguage(document.documentElement.lang);
})();
