import { lazy, Suspense } from 'react';
import type { ComponentType, ReactNode } from 'react';

type DynamicOptions = {
   loading?: ComponentType;
   ssr?: boolean;
};

export function dynamic<TProps extends object>(
   loader: () => Promise<ComponentType<TProps> | { default: ComponentType<TProps> }>,
   options: DynamicOptions = {}
) {
   const LazyComponent = lazy(async () => {
      const mod = await loader();
      return 'default' in mod ? mod : { default: mod };
   });

   return function DynamicComponent(props: TProps) {
      const fallback = options.loading ? <options.loading /> : null;
      return (
         <Suspense fallback={fallback as ReactNode}>
            <LazyComponent {...props} />
         </Suspense>
      );
   };
}
