'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { useCountdownSeconds } from '@/hooks/use-countdown-seconds';

interface EmailChallenge {
   challengeId: string;
   expiresAt: string;
   resendAvailableAt: string;
}

interface UseEmailChallengeOptions<TChallenge extends EmailChallenge, TVerifyResult> {
   start: (email: string) => Promise<TChallenge>;
   verify: (challengeId: string, code: string) => Promise<TVerifyResult>;
   missingChallengeMessage: string;
   onStartMutate?: () => void;
   onVerifyMutate?: () => void;
   onStarted?: (challenge: TChallenge) => void;
   onVerified?: (result: TVerifyResult) => void;
   onStartError?: (error: Error) => void;
   onVerifyError?: (error: Error) => void;
}

export function useEmailChallenge<TChallenge extends EmailChallenge, TVerifyResult>({
   start,
   verify,
   missingChallengeMessage,
   onStartMutate,
   onVerifyMutate,
   onStarted,
   onVerified,
   onStartError,
   onVerifyError
}: UseEmailChallengeOptions<TChallenge, TVerifyResult>) {
   const [email, setEmail] = useState('');
   const [code, setCode] = useState('');
   const [challenge, setChallenge] = useState<TChallenge | null>(null);
   const resendSeconds = useCountdownSeconds(challenge?.resendAvailableAt);
   const expirySeconds = useCountdownSeconds(challenge?.expiresAt);

   const startMutation = useMutation({
      mutationFn: async () => start(email),
      onMutate: onStartMutate,
      onSuccess: (value) => {
         setChallenge(value);
         setCode('');
         onStarted?.(value);
      },
      onError: (error) => onStartError?.(error)
   });

   const verifyMutation = useMutation({
      mutationFn: async () => {
         if (!challenge) throw new Error(missingChallengeMessage);
         return verify(challenge.challengeId, code);
      },
      onMutate: onVerifyMutate,
      onSuccess: (value) => onVerified?.(value),
      onError: (error) => onVerifyError?.(error)
   });

   function clearChallenge() {
      setChallenge(null);
      setCode('');
   }

   return {
      email,
      setEmail,
      code,
      setCode,
      challenge,
      clearChallenge,
      resendSeconds,
      expirySeconds,
      startMutation,
      verifyMutation
   };
}
