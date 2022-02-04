import {User} from './user';

export class RoleValidator {
  isEditor(user: User): boolean {
    return user.roles.editor === true;
  }
  isAdmin(user: User): boolean {
    return user.roles === 'ADMIN';
  }
  isVerified(user: User): boolean {
    return user.emailVerified === true;
  }
}
