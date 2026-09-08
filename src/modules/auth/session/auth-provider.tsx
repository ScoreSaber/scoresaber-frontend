'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

import { useRouter } from '@tanstack/react-router';

import type { UserControllerGetMeResponse } from '@/shared/api/generated/ApiParams';

type AuthContextValue = {
   user: UserControllerGetMeResponse | null;
};

const AuthContext = createContext<AuthContextValue>({ user: null });

export function AuthProvider({ initialUser, children }: { initialUser: UserControllerGetMeResponse | null; children: React.ReactNode }) {
   const router = useRouter();
   const prevUser = useRef(initialUser);

   useEffect(() => {
      if (prevUser.current?.id !== initialUser?.id) {
         void router.invalidate();
      }
      prevUser.current = initialUser;
   }, [initialUser, router]);

   const value = useMemo(() => ({ user: initialUser }), [initialUser]);

   return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
   return useContext(AuthContext);
}
