import confetti from 'canvas-confetti';

/**
 * Fires a sequence of firework bursts using canvas-confetti
 * tuned to the warm, academic, organic CEQHS color palette.
 */
export function triggerStreakFirework() {
  try {
    const colors = ['#4A6B53', '#C88A2E', '#D97706', '#87A987', '#E5B869', '#3F6C8A'];

    // Burst 1: Center fountain
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.65, x: 0.5 },
      colors,
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });

    // Burst 2: Left firework (slight delay)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0.25, y: 0.6 },
        colors,
        ticks: 220,
        gravity: 0.85,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 250);

    // Burst 3: Right firework (slight delay)
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 0.75, y: 0.6 },
        colors,
        ticks: 220,
        gravity: 0.85,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    }, 450);

    // Burst 4: Sparkle shower
    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.45, x: 0.5 },
        colors: ['#FAF9F5', '#E5B869', '#4A6B53'],
        ticks: 250,
        gravity: 0.7,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
    }, 700);
  } catch (err) {
    console.warn('Celebration firework skipped:', err);
  }
}
