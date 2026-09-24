(function (root) {
    'use strict';
    function create() {
        const AudioContextClass = root.AudioContext || root.webkitAudioContext;
        let context = null, master = null, enabled = true, noise = null;
        let windGain = null, windFilter = null, rumble = null;
        function noiseBuffer() {
            if (!noise) {
                noise = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
                const data = noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            return noise;
        }
        function start() {
            if (!AudioContextClass) return false;
            if (!context) {
                try { context = new AudioContextClass(); } catch (error) { return false; }
                master = context.createGain();
                master.gain.value = enabled ? 1 : 0;
                master.connect(context.destination);
                // Continuous wind rush — gain follows descent speed via setDescent().
                const windSource = context.createBufferSource();
                windSource.buffer = noiseBuffer();
                windSource.loop = true;
                windFilter = context.createBiquadFilter();
                windFilter.type = 'bandpass';
                windFilter.frequency.value = 420;
                windFilter.Q.value = 0.6;
                windGain = context.createGain();
                windGain.gain.value = 0.012;
                windSource.connect(windFilter);
                windFilter.connect(windGain);
                windGain.connect(master);
                windSource.start();
                // Jupiter's deep background rumble.
                rumble = context.createOscillator();
                rumble.type = 'sine';
                rumble.frequency.value = 41;
                const rumbleGain = context.createGain();
                rumbleGain.gain.value = 0.02;
                rumble.connect(rumbleGain);
                rumbleGain.connect(master);
                rumble.start();
                // Occasional radio-static crackles — Jupiter is a strong radio source.
                scheduleStatic();
            }
            if (context.state === 'suspended') context.resume();
            return true;
        }
        function suspend() {
            if (context && context.state === 'running') context.suspend();
        }
        function scheduleStatic() {
            if (!context) return;
            const delay = 6000 + Math.random() * 14000;
            setTimeout(() => {
                if (context && context.state === 'running' && enabled) {
                    const time = context.currentTime;
                    const source = context.createBufferSource();
                    source.buffer = noiseBuffer();
                    const filter = context.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 1400 + Math.random() * 2400;
                    filter.Q.value = 9;
                    const gain = context.createGain();
                    gain.gain.setValueAtTime(0.0001, time);
                    for (let i = 0; i < 3; i++) {
                        const at = time + i * (0.04 + Math.random() * 0.08);
                        gain.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.025, at);
                        gain.gain.linearRampToValueAtTime(0.0001, at + 0.03);
                    }
                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(master);
                    source.start(time);
                    source.stop(time + 0.5);
                }
                scheduleStatic();
            }, delay);
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
            setDescent(rate) {
                if (!context || !windGain) return;
                const level = Math.min(0.09, 0.012 + Math.abs(rate) * 0.022);
                windGain.gain.setTargetAtTime(level, context.currentTime, 0.25);
                windFilter.frequency.setTargetAtTime(320 + Math.abs(rate) * 130, context.currentTime, 0.3);
            },
            step(intensity = 1) {
                if (!ready()) return;
                const peak = 0.03 + Math.min(1, Math.max(0, intensity)) * 0.04;
                burst(300 + Math.random() * 200, 0.9, 0.1, peak);
            },
            jump() {
                if (!ready()) return;
                // Ascent-thruster burn: a filtered whoosh.
                burst(240, 0.5, 0.5, 0.06);
                burst(900, 1.2, 0.3, 0.03);
            },
            land(intensity = 1) {
                if (!ready()) return;
                thud(52, 0.35, Math.min(0.3, 0.08 + intensity * 0.15));
            },
            thunder() {
                if (!ready()) return;
                thud(46, 0.9, 0.1);
                burst(150, 0.6, 0.8, 0.06);
                burst(700, 0.8, 0.2, 0.03);
            },
            chime() {
                if (!ready()) return;
                blip(880, 0, 0.1, 0.05);
                blip(1174.66, 0.13, 0.16, 0.045);
            }
        };
    }
    root.JupiterAudio = Object.freeze({ create });
}(typeof globalThis !== 'undefined' ? globalThis : this));
