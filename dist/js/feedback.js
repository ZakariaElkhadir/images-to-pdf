'use strict';

function initializeFeedback(t) {
  const motionPreference = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const vibrationAvailable = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
  const hapticsToggle = document.querySelector('#haptics-toggle');
  let hapticsEnabled = preferences.read('haptics') !== 'off';
  let lastHaptic = -Infinity;

  function haptic(kind = 'tap') {
    if (!vibrationAvailable || !hapticsEnabled || document.visibilityState === 'hidden') return;
    const now = performance.now();
    if (now - lastHaptic < 60 && kind === 'tap') return;
    const patterns = { tap: 8, move: 12, remove: 16, success: [12, 35, 20], error: [20, 35, 20] };
    try {
      navigator.vibrate(patterns[kind] || patterns.tap);
      lastHaptic = now;
    } catch {}
  }

  function updateHaptics() {
    hapticsToggle.hidden = !vibrationAvailable;
    hapticsToggle.textContent = t(hapticsEnabled ? 'hapticsOn' : 'hapticsOff');
    hapticsToggle.setAttribute('aria-pressed', String(hapticsEnabled));
  }

  hapticsToggle.addEventListener('click', () => {
    hapticsEnabled = !hapticsEnabled;
    updateHaptics();
    preferences.write('haptics', hapticsEnabled ? 'on' : 'off');
    if (hapticsEnabled) haptic();
    else if (vibrationAvailable) { try { navigator.vibrate(0); } catch {} }
    void playSound();
  });


  const AudioEngine = globalThis.AudioContext || globalThis.webkitAudioContext;
  const audioAvailable = typeof AudioEngine === 'function';
  const soundToggle = document.querySelector('#sound-toggle');
  let soundEnabled = preferences.read('sound') !== 'off';
  let audioContext = null;
  let lastSound = -Infinity;

  async function playSound(kind = 'tap') {
    if (!audioAvailable || !soundEnabled || document.visibilityState === 'hidden') return;
    const now = performance.now();
    if (kind === 'tap' && now - lastSound < 60) return;
    lastSound = now;
    try {
      if (!audioContext || audioContext.state === 'closed') audioContext = new AudioEngine();
      if (audioContext.state === 'suspended') await audioContext.resume();
      if (!soundEnabled || document.visibilityState === 'hidden' || audioContext.state !== 'running') return;
      const sequences = {
        tap: [[520, 0, .035]], move: [[420, 0, .04], [610, .04, .05]],
        remove: [[330, 0, .045], [240, .04, .05]],
        success: [[523, 0, .06], [659, .065, .06], [784, .13, .09]],
        error: [[240, 0, .07], [180, .08, .09]]
      };
      const started = audioContext.currentTime;
      for (const [frequency, offset, duration] of sequences[kind] || sequences.tap) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const when = started + offset;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, when);
        gain.gain.setValueAtTime(.0001, when);
        gain.gain.linearRampToValueAtTime(.035, when + .008);
        gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        oscillator.start(when);
        oscillator.stop(when + duration + .01);
      }
    } catch {}
  }

  function updateSound() {
    soundToggle.hidden = !audioAvailable;
    soundToggle.textContent = t(soundEnabled ? 'soundOn' : 'soundOff');
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  }

  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    updateSound();
    preferences.write('sound', soundEnabled ? 'on' : 'off');
    haptic();
    if (soundEnabled) void playSound();
    else if (audioContext) { try { void audioContext.suspend().catch(() => {}); } catch {} }
  });

  function play(kind = 'tap') {
    haptic(kind);
    void playSound(kind);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') return;
    if (audioContext) { try { void audioContext.suspend().catch(() => {}); } catch {} }
    if (vibrationAvailable) { try { navigator.vibrate(0); } catch {} }
  });

  function animateElement(element, keyframes, options = {}) {
    if (motionPreference.matches || typeof element?.animate !== 'function') return null;
    try { return element.animate(keyframes, { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)', ...options }); }
    catch { return null; }
  }

  function refreshLabels() {
    updateHaptics();
    updateSound();
  }

  return { play, refreshLabels, animateElement };
}
