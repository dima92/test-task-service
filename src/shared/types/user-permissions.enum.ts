export enum UserPermissions {
  //========================== all ===============================
  all = 'all',

  //========================== users =============================
  getAllUsers = 'getAllUsers',
  updateUserProfile = 'updateUserProfile',
  getUserById = 'getUserById',
  deleteUserById = 'deleteUserById',
  assignRoleById = 'assignRoleById',
  getUserProfile = 'getUserProfile',

  //========================== roles ===============================
  createRole = 'createRole',
  getAllRoles = 'getAllRoles',
  getRoleById = 'getRoleById',
  deleteRoleById = 'deleteRoleById',
  updateRoleById = 'updateRoleById',

  //========================== security =============================
  refreshToken = 'refreshToken',
}
