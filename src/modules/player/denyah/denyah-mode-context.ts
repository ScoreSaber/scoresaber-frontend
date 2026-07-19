'use client';

import { createContext, useContext } from 'react';

const DenyahModeContext = createContext(false);

export const DenyahModeProvider = DenyahModeContext.Provider;
export const useDenyahMode = () => useContext(DenyahModeContext);
