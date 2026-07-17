import { createFileRoute } from '@tanstack/react-router';

type RequiredEnvKey = 'NEXT_PUBLIC_API_URL' | 'NEXT_PUBLIC_ARCVIEWER_URL';

const requiredEnv: RequiredEnvKey[] = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_ARCVIEWER_URL'];

export const Route = createFileRoute('/health')({
   server: {
      handlers: {
         GET: () => checkHealth()
      }
   }
});

function checkHealth() {
   const missingEnv = requiredEnv.filter((key) => !process.env[key]);
   const isHealthy = missingEnv.length === 0;

   return Response.json(
      {
         status: isHealthy ? 'ok' : 'error',
         service: 'website-staging',
         timestamp: new Date().toISOString(),
         checks: {
            env: isHealthy ? 'ok' : 'error'
         },
         missingEnv
      },
      { status: isHealthy ? 200 : 503 }
   );
}
