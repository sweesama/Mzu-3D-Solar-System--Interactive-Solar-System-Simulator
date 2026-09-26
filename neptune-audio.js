(function (root) {
    'use strict';
    // Neptune storm-layer audio: a restless wind howl under the cabin hum, ice pings off
    // the hull, gusts of supersonic wind, and a thruster whoosh. Same interface as the other modules.
    function create() {
        const AudioContextClass = root.AudioContext || root.webkitAudioContext;
        let context = null, master = null, enabled = true, noise = null;
        let humGain = null, humFilter = null, pingTimer = 0;
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
                // Wind buffet — a restless mid-band howl, the fastest winds in the Solar System.
                const humSource = context.createBufferSource();
                humSource.buffer = noiseBuffer();
                humSource.loop = true;
                humFilter = context.createBiquadFilter();
                humFilter.type = 'bandpass';
                humFilter.frequency.value = 320;
                humFilter.Q.value = 0.8;
                humGain = context.createGain();
                humGain.gain.value = 0.02;
                humSource.connect(humFilter);
                humFilter.connect(humGain);
                humGain.connect(master);
                humSource.start();
                // Deep electrical hum of the RTG.
                const rumble = context.createOscillator();
                rumble.type = 'sine';
                rumble.frequency.value = 48;
                const rumbleGain = context.createGain();
                rumbleGain.gain.value = 0.012;
                rumble.connect(rumbleGain);
                rumbleGain.connect(master);
                rumble.start();
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
            const delay = 3500 + Math.random() * 9000;
            setTimeout(() => {
                if (context && context.state === 'running' && enabled) {
                    const time = context.currentTime;
                    const source = context.createBufferSource();
                    source.buffer = noiseBuffer();
                    const filter = context.createBiquadFilter();
                    filter.type = 'bandpass';
                    filter.frequency.value = 1800 + Math.random() * 2200;
                    filter.Q.value = 11;
                    const gain = context.createGain();
                    gain.gain.setValueAtTime(0.0001, time);
                    gain.gain.linearRampToValueAtTime(0.014 + Math.random() * 0.018, time + 0.03);
                    gain.gain.linearRampToValueAtTime(0.0001, time + 0.12);
                    source.connect(filter);
                    filter.connect(gain);
                    gain.connect(master);
                    source.start(time);
                    source.stop(time + 0.3);
                }
                scheduleStatic();
            }, delay);
        }
        function ping(frequency, duration, peak) {
            // Ice grain ticking off the hull — a tiny bright blip.
            const time = context.currentTime;
            const osc = context.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(frequency, time);
            const gain = context.createGain();
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            osc.connect(gain);
            gain.connect(master);
            osc.start(time);
            osc.stop(time + duration + 0.05);
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
                if (!context || !humGain) return;
                const level = Math.min(0.06, 0.02 + Math.abs(rate) * 0.01);
                humGain.gain.setTargetAtTime(level, context.currentTime, 0.3);
                humFilter.frequency.setTargetAtTime(280 + Math.abs(rate) * 140, context.currentTime, 0.35);
            },
            step(intensity = 1) {
                if (!ready()) return;
                ping(2200 + Math.random() * 1800, 0.06, 0.012 + Math.random() * 0.02 * intensity);
            },
            icePing() {
                if (!ready()) return;
                ping(1600 + Math.random() * 2400, 0.08, 0.02 + Math.random() * 0.03);
            },
            jump() {
                if (!ready()) return;
                burst(300, 0.6, 0.45, 0.05);
                burst(1100, 1.4, 0.25, 0.025);
            },
            land(intensity = 1) {
                if (!ready()) return;
                thud(60, 0.3, Math.min(0.25, 0.06 + intensity * 0.12));
            },
            thunder() {
                if (!ready()) return;
                thud(50, 0.8, 0.07);
            },
            chime() {
                if (!ready()) return;
                blip(880, 0, 0.1, 0.05);
                blip(1174.66, 0.13, 0.16, 0.045);
            }
        };
    }
    root.NeptuneAudio = Object.freeze({ create });
}(typeof globalThis !== 'undefined' ? globalThis : this));
