(function (root) {
    'use strict';
    function create() {
        const AudioContextClass = root.AudioContext || root.webkitAudioContext;
        let context = null, master = null, enabled = true, noise = null;
        let gustTimer = 0, thunderTimer = 0;
        let thunderListener = null;
        function noiseBuffer() {
            if (!noise) {
                noise = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
                const data = noise.getChannelData(0);
                for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            }
            return noise;
        }
        function swell() {
            if (!context) return;
            gustTimer = setTimeout(swell, 10000 + Math.random() * 24000);
            if (!enabled || context.state !== 'running') return;
            const time = context.currentTime;
            const duration = 4 + Math.random() * 4;
            const source = context.createBufferSource();
            source.buffer = noiseBuffer();
            source.loop = true;
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 70 + Math.random() * 110;
            filter.Q.value = 0.6;
            const gain = context.createGain();
            const peak = 0.04 + Math.random() * 0.04;
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + duration * 0.45);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            source.start(time);
            source.stop(time + duration + 0.05);
        }
        function thunder() {
            if (!context) return;
            thunderTimer = setTimeout(thunder, 40000 + Math.random() * 90000);
            if (!enabled || context.state !== 'running') return;
            if (thunderListener) thunderListener();
            const time = context.currentTime;
            const source = context.createBufferSource();
            source.buffer = noiseBuffer();
            const filter = context.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(240, time);
            filter.frequency.exponentialRampToValueAtTime(45, time + 3.6);
            const gain = context.createGain();
            const peak = 0.05 + Math.random() * 0.04;
            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(peak, time + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 4.2);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            source.start(time);
            source.stop(time + 4.4);
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(58, time);
            osc.frequency.exponentialRampToValueAtTime(27, time + 3.4);
            const oscGain = context.createGain();
            oscGain.gain.setValueAtTime(0.0001, time);
            oscGain.gain.linearRampToValueAtTime(peak * 0.8, time + 0.4);
            oscGain.gain.exponentialRampToValueAtTime(0.0001, time + 3.8);
            osc.connect(oscGain);
            oscGain.connect(master);
            osc.start(time);
            osc.stop(time + 3.9);
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
                const rumble = context.createBufferSource();
                rumble.buffer = noiseBuffer();
                rumble.loop = true;
                rumble.playbackRate.value = 0.25;
                const rumbleFilter = context.createBiquadFilter();
                rumbleFilter.type = 'lowpass';
                rumbleFilter.frequency.value = 85;
                rumbleFilter.Q.value = 0.4;
                const rumbleGain = context.createGain();
                rumbleGain.gain.value = 0.016;
                const rumbleLfo = context.createOscillator();
                rumbleLfo.type = 'sine';
                rumbleLfo.frequency.value = 0.07;
                const rumbleLfoGain = context.createGain();
                rumbleLfoGain.gain.value = 0.006;
                rumbleLfo.connect(rumbleLfoGain);
                rumbleLfoGain.connect(rumbleGain.gain);
                rumble.connect(rumbleFilter);
                rumbleFilter.connect(rumbleGain);
                rumbleGain.connect(master);
                rumble.start();
                rumbleLfo.start();
            }
            if (context.state === 'suspended') context.resume();
            clearTimeout(gustTimer);
            clearTimeout(thunderTimer);
            gustTimer = setTimeout(swell, 4000 + Math.random() * 12000);
            thunderTimer = setTimeout(thunder, 18000 + Math.random() * 40000);
            return true;
        }
        function suspend() {
            clearTimeout(gustTimer);
            clearTimeout(thunderTimer);
            if (context && context.state === 'running') context.suspend();
        }
        function thud(frequency, duration, peak) {
            const time = context.currentTime;
            const osc = context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(frequency, time);
            osc.frequency.exponentialRampToValueAtTime(Math.max(26, frequency * 0.5), time + duration);
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
        const api = {
            start,
            suspend,
            setEnabled(value) {
                enabled = Boolean(value);
                if (master) master.gain.setTargetAtTime(enabled ? 1 : 0, context.currentTime, 0.05);
            },
            isEnabled: () => enabled,
            onThunder(callback) { thunderListener = callback; },
            step(intensity = 1) {
                if (!ready()) return;
                const peak = 0.045 + Math.min(1, Math.max(0, intensity)) * 0.055;
                thud(52 + Math.random() * 12, 0.17, peak);
                burst(520 + Math.random() * 300, 1.2, 0.08, peak * 0.6);
            },
            jump() {
                if (!ready()) return;
                burst(460, 0.8, 0.16, 0.05);
            },
            land(intensity = 1) {
                if (!ready()) return;
                const peak = Math.min(0.34, 0.08 + intensity * 0.17);
                thud(48, 0.34, peak);
                burst(240, 0.8, 0.22, peak * 0.7);
            },
            chime() {
                if (!ready()) return;
                blip(880, 0, 0.1, 0.05);
                blip(1174.66, 0.13, 0.16, 0.045);
            }
        };
        return api;
    }
    root.VenusAudio = Object.freeze({ create });
    if (typeof module !== 'undefined' && module.exports) module.exports = root.VenusAudio;
}(typeof globalThis !== 'undefined' ? globalThis : this));
