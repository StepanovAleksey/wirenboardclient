/**
 * Список всех пользователей
 */
export enum EUser {
  /** по умолчанию видит всё */
  Admin = 'Admin',
  Shower = 'Shower',
}

/**
 * Список паролей
 */
export const Users: Record<EUser, string> = {
  [EUser.Admin]: '0123456789',
  [EUser.Shower]: 'shower',
};
