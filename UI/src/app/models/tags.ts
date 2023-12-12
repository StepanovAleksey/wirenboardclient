/** местонахождение реле в доме*/
export enum EPath {
  /**Гараж */
  'Garage' = 'Garage',

  /**Погреб */
  'Cellar' = 'Cellar',

  /**1 этаж */
  '1st_floor' = '1st_floor',

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

  /**Бассейн */
  'Pool' = 'Pool',

  /**2 этаж */
  '2nd_floor' = '2nd_floor',

  /**3 этаж */
  '3rd_floor' = '3rd_floor',

  /**Улица */
  'Street' = 'Street',
}

/** перевод пути */
export const PATH_TRANSLATE: Record<EPath, string> = {
  Garage: 'Гараж',
  Cellar: 'Погреб',
  '1st_floor': '1 этаж',
  Tabmbur: 'Табмбур',
  Hall: 'Холл',
  Living_room: 'Гостинная',
  Dining_room: 'Столовая',
  Kitchen: 'Кухня',
  Pool: 'Бассейн',
  '2nd_floor': '2 этаж',
  '3rd_floor': '3 этаж',
  Street: 'Улица',
};

/** иерархия путей, задаётся абсолютное метонахождение реле*/
export const PATHES_INHERITANCE: Partial<Record<EPath, Array<EPath>>> = {
  [EPath['1st_floor']]: [
    EPath.Tabmbur,
    EPath.Hall,
    EPath['Living_room'],
    EPath.Kitchen,
    EPath.Pool,
  ],
};

export const ALL_TAGS = Object.values(EPath);
