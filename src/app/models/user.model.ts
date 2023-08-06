/**
 * Список всех пользователей
 */
export enum EUserRole {
  /** по умолчанию видит всё */
  Admin = 'Admin',
  Shower = 'Shower',
}

export class UserModel {
  constructor(
    public name: string,
    public login: string,
    public password: string,
    public role: EUserRole,
  ) { }
}

/**
 * Список паролей,
 * пароли не должны совпадать
 */
export const USERS: Array<UserModel> = [
  new UserModel(EUserRole.Admin, EUserRole.Admin, '123', EUserRole.Admin),
  new UserModel(EUserRole.Shower, EUserRole.Shower, 'shower', EUserRole.Admin),
];
