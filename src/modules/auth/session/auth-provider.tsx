'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { useRouter } from '@tanstack/react-router';

import type { UserControllerGetMeResponse } from '@/shared/api/generated/ApiParams';

type AuthContextValue = {
   user: UserControllerGetMeResponse | null;
   avatarCacheBust: string | null;
   bustOwnAvatar: () => void;
};

const ownAvatarCacheBustKey = 'scoresaber-own-avatar-cache-bust';
const ownAvatarCacheBustTtlMs = 60 * 60 * 1000;

const AuthContext = createContext<AuthContextValue>({ user: null, avatarCacheBust: null, bustOwnAvatar: () => {} });

function readStoredAvatarCacheBust() {
   if (typeof window === 'undefined') {
      return null;
   }

   const raw = window.localStorage.getItem(ownAvatarCacheBustKey);
   const value = raw ? Number(raw) : NaN;
   if (!Number.isFinite(value) || Date.now() - value > ownAvatarCacheBustTtlMs) {
      window.localStorage.removeItem(ownAvatarCacheBustKey);
      return null;
   }

   return raw;
}

export function AuthProvider({ initialUser, children }: { initialUser: UserControllerGetMeResponse | null; children: React.ReactNode }) {
   const router = useRouter();
   const prevUser = useRef(initialUser);
   const [avatarCacheBust, setAvatarCacheBust] = useState<string | null>(null);

   useEffect(() => {
      if (prevUser.current?.id !== initialUser?.id) {
         router.invalidate();
      }
      prevUser.current = initialUser;
   }, [initialUser, router]);

   useEffect(() => {
      setAvatarCacheBust(readStoredAvatarCacheBust());
   }, []);

   const bustOwnAvatar = useCallback(() => {
      const value = Date.now().toString();
      window.localStorage.setItem(ownAvatarCacheBustKey, value);
      setAvatarCacheBust(value);
   }, []);

   return <AuthContext value={{ user: initialUser, avatarCacheBust, bustOwnAvatar }}>{children}</AuthContext>;
}

export function useAuth() {
   return useContext(AuthContext);
}
