import { ETags, TAGS_INHERITANCE, TAG_TRANSLATE } from './tags';
import { EUserRole } from './user.model';
import { MenuItem } from 'primeng/api';

class TagMenuItem implements MenuItem {
  queryParams: Record<string, any> = {};
  historyTags: Array<ETags> = [];
  items: Array<TagMenuItem>;

  constructor(
    public routerLink: string,
    public label: string,
    tags: Array<ETags>,
    tag: ETags,
  ) {
    this.historyTags = [...tags, tag];
    this.queryParams = {
      tags: this.historyTags,
    };
    this.items = TAGS_INHERITANCE[tag]?.map((childTag) => {
      const menuApp = new TagMenuItem(
        routerLink,
        TAG_TRANSLATE[childTag],
        this.historyTags,
        childTag,
      );
      return menuApp;
    });
  }
}

export class AppMenuItem implements MenuItem {
  isExpand = false;
  items: Array<TagMenuItem>;
  tagsHistory: Array<ETags> = [];

  constructor(
    public label: string = null,
    public icon: string = null,
    public routerLink: string = '/main/develop',
    public userAcces: Array<EUserRole> = [],
    tag: ETags = null,
  ) {
    if (tag) {
      this.items = TAGS_INHERITANCE[tag]?.map((childTag) => {
        const menuApp = new TagMenuItem(
          routerLink,
          TAG_TRANSLATE[childTag],
          [],
          childTag,
        );
        return menuApp;
      });
    }
  }

  chekAcces(user: EUserRole) {
    return this.userAcces.includes(user);
  }
}

export const MenuItems: AppMenuItem[] = [
  new AppMenuItem(
    'Освещение',
    'pi pi-sun',
    '/main/lighting',
    [EUserRole.Admin],
    ETags.Lighting,
  ),
  new AppMenuItem('Полив', 'pi pi-calendar', '/main/watering', [
    EUserRole.Shower,
  ]),
  new AppMenuItem('Шторы', 'pi pi-th-large', '/main/curtains'),
];

export class MenuHelper {
  static getMenuItemByPath(path: string) {
    let menus = MenuItems;
    while (menus?.length) {
      const menu = menus.find((m) => m.routerLink === path);
      if (menu) {
        return menu;
      }
      menus = menus.reduce((a, b) => a.concat(b.items || []), []);
    }
    return null;
  }
}
