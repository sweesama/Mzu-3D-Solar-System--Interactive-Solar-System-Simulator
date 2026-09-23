(function (root) {
    'use strict';
    function create() {
        const AudioContextClass = root.AudioContext || root.webkitAudioContext;
        let context = null, master = null, enabled = true, noise = null;
        let gustTimer = 0;
        function noiseBuffer() {
            if (!noise) {
                noise = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
                const data = noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            return noise;
        }
        function gust() {
            if (!context) return;
            gustTimer = setTimeout(gust, 9000 + Math.random() * 26000);
            if (!enabled || context.state !== 'running') return;
            const time = context.currentTime;
            const duration = 3 + Math.random() * 3.5;
            const source = context.createBufferSource();
            source.buffer = noiseBuffer();
            source.loop = true;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 120 + Math.random() * 160;
            filter.Q.value = 0.5;
            const gain = context.createGain();
            const peak = 0.022 + Math.random() * 0.028;
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + duration * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            source.start(time);
            source.stop(time + duration + 0.05);
        }
        function start() {
            if (!AudioContextClass) return false;
            if (!context) {
                try { context = new AudioContextClass(); } catch (error) { return false; }
                master = context.createGain();
                master.gain.value = enabled ? 1 : 0;
                master.connect(context.destination);
                const fan = context.createOscillator();
                fan.type = 'triangle';
                fan.frequency.value = 132;
                const fanNoise = context.createBufferSource();
                fanNoise.buffer = noiseBuffer();
                fanNoise.loop = true;
                fanNoise.playbackRate.value = 0.4;
                const fanBand = context.createBiquadFilter();
                fanBand.type = 'bandpass';
                fanBand.frequency.value = 260;
                fanBand.Q.value = 1.6;
                const fanGain = context.createGain();
                fanGain.gain.value = 0.007;
                fan.connect(fanGain);
                fanNoise.connect(fanBand);
                fanBand.connect(fanGain);
                fanGain.connect(master);
                fan.start();
                fanNoise.start();
            }
            if (context.state === 'suspended') context.resume();
            clearTimeout(gustTimer);
            gustTimer = setTimeout(gust, 5000 + Math.random() * 15000);
            return true;
        }
        function suspend() {
            clearTimeout(gustTimer);
            if (context && context.state === 'running') context.suspend();
        }
        function thud(frequency, duration, peak) {
            const time = context.currentTime;
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, time);
            osc.frequency.exponentialRampToValueAtTime(Math.max(28, frequency * 0.5), time + duration);
            const gain = context.createGain();
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            osc.connect(gain);
            gain.connect(master);
            osc.start(time);
            osc.stop(time + duration + 0.05);
        }
        function burst(frequency, q, duration, peak) {
            const time = context.currentTime;
            const source = context.createBufferSource();
            source.buffer = noiseBuffer();
            const filter = context.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = frequency;
            filter.Q.value = q;
            const gain = context.createGain();
            gain.gain.setValueAtTime(peak, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            source.start(time);
            source.stop(time + duration + 0.05);
        }
        function blip(frequency, delay, duration, peak) {
            const time = context.currentTime + delay;
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = frequency;
            const gain = context.createGain();
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            osc.connect(gain);
            gain.connect(master);
            osc.start(time);
            osc.stop(time + duration + 0.05);
        }
        const ready = () => Boolean(context && enabled);
        return {
            start,
            suspend,
            setEnabled(value) {
                enabled = Boolean(value);
                if (master) master.gain.setTargetAtTime(enabled ? 1 : 0, context.currentTime, 0.05);
            },
            isEnabled: () => enabled,
            step(intensity = 1) {
                if (!ready()) return;
                const peak = 0.04 + Math.min(1, Math.max(0, intensity)) * 0.05;
                thud(66 + Math.random() * 14, 0.14, peak);
                burst(700 + Math.random() * 420, 1.1, 0.07, peak * 0.65);
            },
            jump() {
                if (!ready()) return;
                burst(560, 0.8, 0.14, 0.05);
            },
            land(intensity = 1) {
                if (!ready()) return;
                const peak = Math.min(0.32, 0.07 + intensity * 0.16);
                thud(55, 0.3, peak);
                burst(300, 0.8, 0.2, peak * 0.7);
            },
            chime() {
                if (!ready()) return;
                blip(880, 0, 0.1, 0.05);
                blip(1174.66, 0.13, 0.16, 0.045);
            }
        };
    }
    root.MarsAudio = Object.freeze({ create });
    if (typeof module !== 'undefined' && module.exports) module.exports = root.MarsAudio;
}(typeof globalThis !== 'undefined' ? globalThis : this));
