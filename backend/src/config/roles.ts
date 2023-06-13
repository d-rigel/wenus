const allRoles = {
  user: [],
  appAdmin: ['getUsers', 'manageUsers'],
  superAdmin: ['getUsers', 'manageUsers', 'manageArticles'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
