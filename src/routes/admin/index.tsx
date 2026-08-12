import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/')({
   loader: () => {
      throw redirect({ to: '/admin/badges' });
   }
});
