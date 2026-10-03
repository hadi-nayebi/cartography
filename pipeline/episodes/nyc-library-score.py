#!/usr/bin/env python3
"""Original deterministic 150s instrumental sketch; no external samples or model."""
import numpy as np, wave, pathlib
sr=44100;dur=150;mix=np.zeros(int(sr*dur),dtype=np.float64)
# Warm major-seventh arpeggios; no speech. Intentionally restrained under captions.
chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,59]]
def note(midi,start,length,level):
 n=min(int(length*sr),len(mix)-int(start*sr));t=np.arange(n)/sr;f=440*2**((midi-69)/12)
 env=(1-np.exp(-t*22))*np.exp(-t/1.2)*np.minimum(1,(length-t)/.2)
 sound=(np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2*t)+.05*np.sin(2*np.pi*f*3*t))*env
 mix[int(start*sr):int(start*sr)+n]+=sound*level
for beat in range(180):
 start=beat*5/6
 chord=chords[(beat//12)%4]
 note(chord[[0,2,1,3,2,1][beat%6]]+12,start,3.4,.10)
 if beat%6==0:
  for m in chord:note(m,start,5,.025)
mix*=np.minimum(1,np.arange(len(mix))/sr/2)*np.minimum(1,(len(mix)-np.arange(len(mix)))/sr/4)
mix*=.55/max(abs(mix));pcm=(mix*32767).astype('<i2')
out=pathlib.Path(__file__).resolve().parents[2]/'surface/remotion/public/audio/nyc-library-score.wav'
with wave.open(str(out),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())
print(out)
