import { BehaviorSubject } from 'rxjs';
import { ALL_TAGS, EPath, PATHES_INHERITANCE, PATH_TRANSLATE } from './tags';
import { EUserRole } from './user.model';
import { MenuItem } from 'primeng/api';

export const LAST_MENU_ITEM$ = new BehaviorSubject<TagMenuItem>(null);

export class TagMenuItem implements MenuItem {
  queryParams: Record<string, any> = {};
  historyTags: Array<EPath> = [];
  items: Array<TagMenuItem>;

  constructor(
    public routerLink: string,
    public label: string,
    tags: Array<EPath>,
    tag: EPath,
    private parent: TagMenuItem,
    public icon?: string,
  ) {
    if (!!tag) {
      this.historyTags = [...tags, tag];
    }
    this.queryParams = {
      tags: this.historyTags,
    };

    const childTags = !!tag ? PATHES_INHERITANCE[tag] : ALL_TAGS;
    this.items = childTags?.map((childTag) => {
      const menuApp = new TagMenuItem(
        routerLink,
        PATH_TRANSLATE[childTag],
        this.historyTags,
        childTag,
        this,
      );
      return menuApp;
    });
  }

  isEqualTagHistory(tags: Array<EPath>): boolean {
    return (
      !tags.length ||
      tags.every((tag, index) => {
        return this.historyTags[index] === tag;
      })
    );
  }

  findByTagHistory(tags: Array<EPath>): TagMenuItem {
    if (this.isEqualTagHistory(tags)) {
      return this;
    }
    let children = this.items;
    while (children?.length) {
      const findElem = children.find((c) => c.isEqualTagHistory(tags));
      if (findElem) {
        return findElem;
      }
      children = children
        .reduce((a, b) => a.concat(b.items), [])
        .filter(Boolean);
    }
    return this;
  }
  getAllHistory() {
    const result: Array<TagMenuItem> = [this];
    let parent = this.parent;
    while (!!parent) {
      result.push(parent);
      parent = parent.parent;
    }
    return result.reverse();
  }
}

export class AppMenuItem implements MenuItem {
  isExpand = false;
  items: Array<TagMenuItem>;
  tagsHistory: Array<EPath> = [];

  constructor(
    public label: string = null,
    public icon: string = null,
    public routerLink: string = '/main/develop',
    public userAcces: Array<EUserRole> = [],
  ) {}

  chekAcces(user: EUserRole) {
    return this.userAcces.includes(user);
  }
}

export const LIGHTING_MENU_ELEM: TagMenuItem = new TagMenuItem(
  '/main/lighting',
  'Освещение',
  [],
  null,
  null,
  'pi pi-sun',
);

export const MenuItems: MenuItem[] = [
  LIGHTING_MENU_ELEM,
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
