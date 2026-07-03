import { api } from './ApiInstance';

import type { PPCurve } from '@/shared/format/pp-curve';

export interface RealmPPCurveResponse {
   curve: PPCurve;
   positiveModifierCurve: PPCurve;
}

export function getRealmPPCurve(realmId: number) {
   return api.request<RealmPPCurveResponse>({
      path: `/api/v2/realms/${realmId}/pp-curve`,
      method: 'GET',
      format: 'json'
   });
}
