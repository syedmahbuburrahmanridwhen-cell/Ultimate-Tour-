"""Synthesises the small SFX kit into public/sfx/*.wav (44.1 kHz, 16-bit mono).
Needs: python3 + numpy + scipy.  Run: python3 scripts/make_sfx.py"""
import wave, os
import numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'sfx')
os.makedirs(OUT, exist_ok=True)

def t_(d): return np.arange(int(SR * d)) / SR
def lp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, 'low', fs=SR, output='sos'), x)
def hp(x, fc, o=2): return signal.sosfilt(signal.butter(o, fc, 'high', fs=SR, output='sos'), x)

def reverb(x, wet=0.12, tail=0.06):
    n = int(SR * tail)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (n / 5))
    ir[0] = 0
    ir = lp(ir, 5000, 1)
    y = signal.fftconvolve(x, ir)[: len(x)]
    y = y / (np.max(np.abs(y)) + 1e-9) * np.max(np.abs(x))
    return x * (1 - wet) + y * wet

def fade_out(x, ms=12):
    n = int(SR * ms / 1000)
    x[-n:] *= np.linspace(1, 0, n)
    return x

def pop():
    t = t_(0.2)
    f = 190 + 520 * np.exp(-t * 38)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(t / 0.004, 1) * np.exp(-t * 26)
    return lp(np.sin(ph) * env, 4200)

def click():
    t = t_(0.1)
    n = hp(rng.standard_normal(len(t)), 2200) * np.exp(-t * 95)
    tick = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 120) * 0.5
    return lp((n * 0.6 + tick) * np.minimum(t / 0.001, 1), 8000)

def whoosh():
    d = 0.75
    t = t_(d)
    x = rng.standard_normal(len(t))
    fc = 350 * (7.0 ** (t / d))                      # 350 -> 2450 Hz sweep
    q, y, low, band = 0.9, np.zeros(len(t)), 0.0, 0.0
    for i in range(len(t)):                           # state-variable band-pass
        f = 2 * np.sin(np.pi * min(fc[i], 9000) / SR)
        low += f * band
        high = x[i] - low - q * band
        band += f * high
        y[i] = band
    env = np.where(t < d * 0.4, np.sin(np.pi / 2 * t / (d * 0.4)) ** 2,
                   np.cos(np.pi / 2 * (t - d * 0.4) / (d * 0.6)) ** 2)
    return lp(y * env, 6000)

def chime():
    t = t_(0.5)
    f0 = 784.0
    x = (np.sin(2 * np.pi * f0 * t) * 1.0
         + np.sin(2 * np.pi * f0 * 2.003 * t) * 0.32 * np.exp(-t * 6)
         + np.sin(2 * np.pi * f0 * 3.01 * t) * 0.1 * np.exp(-t * 9))
    env = np.minimum(t / 0.006, 1) * np.exp(-t * 9)
    return lp(x * env, 6500)

def thud():
    t = t_(0.3)
    f = 46 + 70 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.minimum(t / 0.008, 1) * np.exp(-t * 14)
    return lp(np.sin(ph) * env, 420)

KIT = {'pop': pop, 'click': click, 'whoosh': whoosh, 'chime': chime, 'thud': thud}
TARGET_RMS = 0.085          # same perceived level for every sound
PEAK_CAP = 0.89             # no clipping, headroom for the 0.2-0.35 volume props

print(f"{'file':<12}{'dur(s)':>8}{'peak':>8}{'rms':>8}{'clip':>6}")
for name, fn in KIT.items():
    x = fade_out(reverb(fn()))
    x = x[: int(SR * (0.8 if name == 'whoosh' else 0.5))]
    x = x * (TARGET_RMS / (np.sqrt(np.mean(x ** 2)) + 1e-9))
    pk = np.max(np.abs(x))
    if pk > PEAK_CAP:
        x = x * (PEAK_CAP / pk)
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype('<i2')
    with wave.open(os.path.join(OUT, f'{name}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    clipped = int(np.sum(np.abs(pcm) >= 32767))
    print(f"{name+'.wav':<12}{len(x)/SR:>8.2f}{np.max(np.abs(x)):>8.2f}{np.sqrt(np.mean(x**2)):>8.3f}{clipped:>6}")
