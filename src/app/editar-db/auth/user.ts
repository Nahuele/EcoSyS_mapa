export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  password?: string;
  roles?: Roles;
}

export interface Roles {
  editor?: boolean,
  admin?: boolean,
}
