const permissions = {
   RT: 1,
   QAT: 2,
   QATHead: 4,
   NAT: 8,
   ADMIN: 16,
   PANDA: 32,
   SUPPORTER: 64,
   PPFARMER: 128,
   DEV: 256,
   PPV3: 512,
   CCT: 1024,
   CCTHead: 2048,
   CAT: 4096,
   RTR: 8192
};

const group_permissions = {
   ALL_STAFF:
      permissions.RT |
      permissions.QAT |
      permissions.QATHead |
      permissions.NAT |
      permissions.ADMIN |
      permissions.PANDA |
      permissions.DEV |
      permissions.PPV3 |
      permissions.CCT |
      permissions.CCTHead |
      permissions.CAT |
      permissions.RTR,
   ADMIN: permissions.RT | permissions.QAT | permissions.QATHead | permissions.NAT | permissions.ADMIN,
   NAT: permissions.RT | permissions.NAT,
   QATHead: permissions.QAT | permissions.QATHead,
   QAT: permissions.QAT,
   RT: permissions.RT
};

function checkPermissionNumber(userPermissions: number, permission: number) {
   if (userPermissions === undefined) return false;
   if ((userPermissions & permissions.PANDA) !== 0) return permission !== 0;
   return (userPermissions & permission) !== 0;
}

export default {
   security: permissions,
   groups: group_permissions,
   checkPermissionNumber
};
