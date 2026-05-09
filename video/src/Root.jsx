import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion'
import Intro from './scenes/Intro.jsx'
import PianoDemo from './scenes/PianoDemo.jsx'
import GuitarDemo from './scenes/GuitarDemo.jsx'
import SliderDemo from './scenes/SliderDemo.jsx'
import Outro from './scenes/Outro.jsx'

export function HeroVideo() {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={0} durationInFrames={75}>
        <Intro />
      </Sequence>
      <Sequence from={75} durationInFrames={90}>
        <PianoDemo />
      </Sequence>
      <Sequence from={165} durationInFrames={90}>
        <GuitarDemo />
      </Sequence>
      <Sequence from={255} durationInFrames={90}>
        <SliderDemo />
      </Sequence>
      <Sequence from={345} durationInFrames={150}>
        <Outro />
      </Sequence>
    </AbsoluteFill>
  )
}
