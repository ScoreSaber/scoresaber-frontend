import { useState } from 'react';

import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { Particles, ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const PARTICLE_OPTIONS = {
   background: {
      color: {
         value: 'transparent'
      }
   },
   detectRetina: true,
   fpsLimit: 60,
   fullScreen: {
      enable: false
   },
   interactivity: {
      events: {
         onClick: {
            enable: false
         },
         onHover: {
            enable: false
         },
         resize: {
            enable: true
         }
      }
   },
   particles: {
      color: {
         value: ['#8feaff', '#39f4ff', '#ff4869']
      },
      links: {
         enable: false
      },
      move: {
         direction: 'top',
         enable: true,
         outModes: {
            default: 'out'
         },
         random: true,
         speed: {
            min: 0.08,
            max: 0.36
         },
         straight: false
      },
      number: {
         density: {
            enable: true,
            height: 900,
            width: 1100
         },
         value: 96
      },
      opacity: {
         animation: {
            enable: true,
            minimumValue: 0.08,
            speed: 0.45,
            sync: false
         },
         value: {
            min: 0.16,
            max: 0.85
         }
      },
      shape: {
         type: 'circle'
      },
      size: {
         animation: {
            enable: true,
            minimumValue: 0.2,
            speed: 1.8,
            sync: false
         },
         value: {
            min: 0.7,
            max: 2.3
         }
      },
      zIndex: {
         opacityRate: 0.7,
         sizeRate: 1,
         value: {
            min: 0,
            max: 8
         }
      }
   },
   pauseOnBlur: true,
   pauseOnOutsideViewport: true
} satisfies ISourceOptions;

const STATIC_PARTICLE_OPTIONS = {
   ...PARTICLE_OPTIONS,
   particles: {
      ...PARTICLE_OPTIONS.particles,
      move: {
         ...PARTICLE_OPTIONS.particles.move,
         enable: false
      },
      opacity: {
         ...PARTICLE_OPTIONS.particles.opacity,
         animation: {
            ...PARTICLE_OPTIONS.particles.opacity.animation,
            enable: false
         }
      },
      size: {
         ...PARTICLE_OPTIONS.particles.size,
         animation: {
            ...PARTICLE_OPTIONS.particles.size.animation,
            enable: false
         }
      }
   }
} satisfies ISourceOptions;

async function loadParticles(engine: Engine) {
   await loadSlim(engine);
}

export function BeatSaberParticles() {
   const [options] = useState(() => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? STATIC_PARTICLE_OPTIONS : PARTICLE_OPTIONS));

   return (
      <ParticlesProvider init={loadParticles}>
         <Particles id="home-beat-saber-particles" className="absolute inset-0 opacity-85" options={options} />
      </ParticlesProvider>
   );
}
