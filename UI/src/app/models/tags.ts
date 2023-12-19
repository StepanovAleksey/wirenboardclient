/** местонахождение реле в доме*/
export enum EPath {
  /**Освещение */
  'Lighting' = 'Lighting',

  /**Гараж */
  'Garage' = 'Garage',

  /**Погреб */
  'Cellar' = 'Cellar',

  /**1 этаж */
  '1st_floor' = '1st_floor',

  /**1 этаж сан узел*/
  '1st_floor_su' = '1st_floor_su',

  /**Табмбур */
  'Tabmbur' = 'Tabmbur',

  /**Холл */
  'Hall' = 'Hall',

  /**Гостинная */
  'Living_room' = 'Living_room',

  /**Столовая */
  'Dining_room' = 'Dining_room',

  /**Кухня */
  'Kitchen' = 'Kitchen',

  /**2 этаж */
  '2nd_floor' = '2nd_floor',

  /**3 этаж */
  '3rd_floor' = '3rd_floor',

  /**Улица */
  'Street' = 'Street',

  /**Винный погреб */
  'Wine_Vault' = 'Wine_Vault',

  /**Винный погреб зал*/
  'Wine_Vault_Hall' = 'Wine_Vault_Hall',

  /**Винный погреб сан узел*/
  'Wine_Vault_SU' = 'Wine_Vault_SU',

  /**СПА */
  'SPA' = 'SPA',

  /**СПА бассейн*/
  'SPA_Pool' = 'SPA_Pool',

  /**СПА душевая*/
  'SPA_Shower_Room' = 'SPA_Shower_Room',

  /**СПА сауна*/
  'SPA_Saun' = 'SPA_Saun',

  /**СПА сан узел*/
  'SPA_SU' = 'SPA_SU',

  /**Бойлерная */
  'Boiler_Room' = 'Boiler_Room',

  /**Камин */
  'Fireplace' = 'Fireplace',
}

/** перевод пути */
export const PATH_TRANSLATE: Record<EPath, string> = {
  Lighting: 'Освещение',
  Garage: 'Гараж',
  Cellar: 'Погреб',
  '1st_floor': '1 этаж',
  Tabmbur: 'Тамбур Прихожая',
  Hall: 'Холл',
  Living_room: 'Гостинная',
  Dining_room: 'Столовая',
  Kitchen: 'Кухня',
  '2nd_floor': '2 этаж',
  '3rd_floor': '3 этаж',
  Street: 'Улица',
  ['1st_floor_su']: 'Сан. узел',
  ['Wine_Vault']: 'Винный погреб',
  SPA: 'СПА',
  ['Boiler_Room']: 'Бойлерная',
  Fireplace: 'Камин',
  [EPath['Wine_Vault_Hall']]: 'Зал',
  [EPath['Wine_Vault_SU']]: 'Сан. узел',
  [EPath['SPA_Pool']]: 'Бассейн',
  [EPath['SPA_Shower_Room']]: 'Душевая',
  [EPath['SPA_Saun']]: 'Сауна',
  [EPath['SPA_SU']]: 'Сан. узел',
};
