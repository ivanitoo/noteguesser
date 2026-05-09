import { Composition } from 'remotion'
import { HeroVideo } from './Root.jsx'

export const FPS = 30
export const DURATION_IN_FRAMES = 495
export const WIDTH = 1920
export const HEIGHT = 1080

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="HeroVideo"
        component={HeroVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  )
}
