document.addEventListener('DOMContentLoaded', () => {
  const btnVerify = document.getElementById('btn-verify');
  const btnAccess = document.getElementById('btn-access');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const progressBar = document.getElementById('progress-bar');
  const ambientGlow = document.getElementById('ambient-glow');

  // Check for URL redirect parameter or use default link
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get('redirect') || urlParams.get('dest') || '#';
  if (redirectUrl !== '#') {
    btnAccess.href = redirectUrl;
  }

  // Web Audio API Sound generator for crisp UI feedback
  function playUiSound(type = 'click') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        // High pleasant chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      // Audio context fallback
    }
  }

  // Handle Ripple Effect on Buttons
  function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const existingRipple = button.getElementsByClassName('ripple')[0];
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(circle);
  }

  // Bind ripple effect
  [btnVerify, btnAccess].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', createRipple);
    }
  });

  // Verify Button Click Event
  if (btnVerify) {
    btnVerify.addEventListener('click', () => {
      // Sound feedback
      playUiSound('click');

      // 1. Update Progress Bar to 100%
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.classList.remove('from-red-600', 'via-rose-500', 'to-red-500');
        progressBar.classList.add('from-emerald-500', 'via-teal-400', 'to-emerald-500');
      }

      // 2. Update Ambient Glow
      if (ambientGlow) {
        ambientGlow.classList.remove('bg-rose-600/15');
        ambientGlow.classList.add('bg-emerald-600/20');
      }

      // 3. Fade out Step 1
      step1.classList.add('opacity-0', '-translate-y-4');

      setTimeout(() => {
        step1.classList.add('hidden');
        
        // 4. Show Step 2
        step2.classList.remove('hidden');
        
        // Trigger reflow for smooth animation
        void step2.offsetWidth;

        step2.classList.remove('opacity-0', 'translate-y-4');
        step2.classList.add('opacity-100', 'translate-y-0');

        // Play success chime
        playUiSound('success');

        // 5. Fire Confetti celebration
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#10b981', '#ffffff', '#f43f5e']
          });
        }
      }, 400);
    });
  }

  // Access CTA Button Click Event
  if (btnAccess) {
    btnAccess.addEventListener('click', (e) => {
      playUiSound('click');
      if (btnAccess.getAttribute('href') === '#') {
        e.preventDefault();
        alert('Acesso Liberado! Defina o link final de destino no script.js ou passe ?redirect=URL no navegador.');
      }
    });
  }
});
