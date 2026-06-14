'use client';

import { useCallback, useEffect, useReducer } from 'react';

import { analyzeImage, type ScoredImage } from './analyze-background';

import { Image } from '@/shared/components/image';
import { BackgroundDebugPanel } from '@/shell/background/page-background-debug';

const BASE_OPACITY = 0.2;
const FADE_MS = 700;
const CLEANUP_MS = 1000;
const MAX_DEBUG_BACKGROUND_CANDIDATES = 8;

interface Layer {
   id: string;
   src: string;
   opacity: number;
   loaded: boolean;
   intensity: number;
}

interface PageBackgroundProps {
   src: string;
   candidates?: string[];
   debugPanel: boolean;
}

interface PageBackgroundState {
   layers: Layer[];
   debugResults: ScoredImage[];
   requestKey: string | null;
}

type PageBackgroundAction =
   | { type: 'request-start'; requestKey: string }
   | { type: 'analysis-complete'; requestKey: string; results: ScoredImage[]; pick: ScoredImage; layerId: string }
   | { type: 'debug-results-complete'; requestKey: string; results: ScoredImage[] }
   | { type: 'transition'; src: string; intensity: number; layerId: string }
   | { type: 'loaded'; src: string }
   | { type: 'fade-in'; src: string }
   | { type: 'cleanup' };

const initialState: PageBackgroundState = {
   layers: [],
   debugResults: [],
   requestKey: null
};

// persistent blurred background image with crossfade transitions.
// lives in the layout so it survives page navigations. pages set
// the src via SetPageBackground from page-background-provider.
export function PageBackground({ src, candidates, debugPanel }: PageBackgroundProps) {
   const [{ layers, debugResults }, dispatch] = useReducer(pageBackgroundReducer, initialState);
   const requestKey = JSON.stringify([src, debugPanel ? (candidates ?? []) : []]);

   const transition = useCallback((url: string, intensity: number) => {
      dispatch({ type: 'transition', src: url, intensity, layerId: Math.random().toString(36).slice(2) });
   }, []);

   // analyze + crossfade when the requested background changes
   useEffect(() => {
      let cancelled = false;
      dispatch({ type: 'request-start', requestKey });

      async function analyze() {
         const result = await analyzeImage(src);
         if (cancelled) return;

         const pick = { url: src, ...result };
         dispatch({ type: 'analysis-complete', requestKey, results: [pick], pick, layerId: Math.random().toString(36).slice(2) });

         if (!debugPanel || !candidates || candidates.length <= 1) {
            return;
         }

         // candidate scoring is debug-only so list pages do not re-load every image for canvas analysis.
         const results = await scoreDebugCandidates(src, candidates, pick);
         if (cancelled || results.length === 0) return;

         dispatch({ type: 'debug-results-complete', requestKey, results });
      }

      void analyze();

      return () => {
         cancelled = true;
      };
   }, [requestKey]);

   // two rAFs ensures the browser has painted opacity:0 before we transition to 1
   const fadeIn = useCallback((targetSrc: string) => {
      requestAnimationFrame(() => {
         requestAnimationFrame(() => {
            dispatch({ type: 'fade-in', src: targetSrc });
         });
      });
   }, []);

   function handleLoad(layerSrc: string) {
      dispatch({ type: 'loaded', src: layerSrc });
      fadeIn(layerSrc);
   }

   // remove old layers once the newest has faded in
   useEffect(() => {
      if (layers.length <= 1 || !layers[layers.length - 1]?.loaded) return;

      const timeout = setTimeout(() => {
         dispatch({ type: 'cleanup' });
      }, CLEANUP_MS);
      return () => clearTimeout(timeout);
   }, [layers]);

   return (
      <>
         <div className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-150 overflow-hidden dark:block">
            {layers.map((layer) => (
               <Image
                  key={layer.id}
                  src={layer.src}
                  alt=""
                  fill
                  className="scale-110 object-cover blur-3xl"
                  sizes="100vw"
                  onLoad={() => handleLoad(layer.src)}
                  style={{
                     opacity: layer.opacity * BASE_OPACITY * layer.intensity,
                     transition: `opacity ${FADE_MS}ms ease-in-out`
                  }}
               />
            ))}
            {/* edge vignettes */}
            <div className="from-background/40 to-background/40 absolute inset-0 bg-linear-to-r via-transparent" />
            <div className="to-background absolute inset-0 bg-linear-to-b from-transparent" />
         </div>
         {debugPanel && <BackgroundDebugPanel results={debugResults} onSwap={transition} />}
      </>
   );
}

function pageBackgroundReducer(state: PageBackgroundState, action: PageBackgroundAction): PageBackgroundState {
   switch (action.type) {
      case 'request-start':
         if (state.requestKey === action.requestKey) return state;
         return { ...state, requestKey: action.requestKey, debugResults: [] };
      case 'analysis-complete':
         if (state.requestKey !== action.requestKey) return state;
         return {
            ...state,
            debugResults: action.results,
            layers: addTransitionLayer(state.layers, action.pick.url, action.pick.intensity, action.layerId)
         };
      case 'debug-results-complete':
         if (state.requestKey !== action.requestKey) return state;
         return { ...state, debugResults: action.results };
      case 'transition':
         return { ...state, layers: addTransitionLayer(state.layers, action.src, action.intensity, action.layerId) };
      case 'loaded':
         return { ...state, layers: state.layers.map((layer) => (layer.src === action.src ? { ...layer, loaded: true } : layer)) };
      case 'fade-in':
         if (state.layers.at(-1)?.src !== action.src) return state;
         return { ...state, layers: state.layers.map((layer) => ({ ...layer, opacity: layer.src === action.src ? 1 : 0 })) };
      case 'cleanup': {
         const last = state.layers.findLastIndex((layer) => layer.opacity === 1);
         return last > 0 ? { ...state, layers: state.layers.slice(last) } : state;
      }
   }
}

function addTransitionLayer(layers: Layer[], src: string, intensity: number, layerId: string) {
   const current = layers.find((layer) => layer.opacity === 1);
   if (current?.src === src) {
      return layers.map((layer) => (layer === current ? { ...layer, intensity } : layer));
   }

   return [...layers, { id: layerId, src, opacity: 0, loaded: false, intensity }];
}

async function scoreDebugCandidates(src: string, candidates: string[], srcResult: ScoredImage) {
   const urls = Array.from(new Set([src, ...candidates])).slice(0, MAX_DEBUG_BACKGROUND_CANDIDATES);
   const results = await Promise.all(urls.map(async (url) => (url === src ? srcResult : { url, ...(await analyzeImage(url)) })));
   results.sort((a, b) => b.score - a.score);
   return results;
}
