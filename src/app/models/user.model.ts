/**
 * Список всех пользователей
 */
export enum EUser {
  /** по умолчанию видит всё */
  Admin = 'Admin',
  Shower = 'Shower',
}

/**
 * Список паролей,
 * пароли не должны совпадать
 */
export const Users: Record<EUser, string> = {
  [EUser.Admin]: '0123456789',
  [EUser.Shower]: 'shower',
};
