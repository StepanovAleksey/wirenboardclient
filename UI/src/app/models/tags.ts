export enum ETags {
  'Lighting' = 'Lighting',
  'Garage' = 'Garage',
  'Cellar' = 'Cellar',
  '1st_floor' = '1st_floor',
  'Tabmbur' = 'Tabmbur',
  'Hall' = 'Hall',
  'Living_room' = 'Living_room',
  'Dining_room' = 'Dining_room',
  'Kitchen' = 'Kitchen',
  'Pool' = 'Pool',
  '2nd_floor' = '2nd_floor',
  '3rd_floor' = '3rd_floor',
  'Street' = 'Street',
}

export const TAG_TRANSLATE: Record<ETags, string> = {
  Lighting: 'Освещение',
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

export const TAGS_INHERITANCE: Partial<Record<ETags, Array<ETags>>> = {
  [ETags.Lighting]: Object.values(ETags).filter((t) => t !== ETags.Lighting),
  [ETags['1st_floor']]: [
    ETags.Tabmbur,
    ETags.Hall,
    ETags['Living_room'],
    ETags.Kitchen,
    ETags.Pool,
  ],
};
