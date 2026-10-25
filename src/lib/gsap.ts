import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

// Register once; import { gsap, ScrollTrigger, SplitText } from here.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

export { gsap, ScrollTrigger, SplitText }
