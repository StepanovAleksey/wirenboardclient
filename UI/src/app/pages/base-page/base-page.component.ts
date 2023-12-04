import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ItemCoil } from 'src/app/models/itemCoil';
import { ETags as ETag, TAGS_INHERITANCE } from 'src/app/models/tags';
import { CoilService } from 'src/app/service/coil.service';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.less'],
})
export class BasePageComponent implements OnInit, OnDestroy {
  coils: Array<ItemCoil> = [];
  childTags: Array<ETag> = TAGS_INHERITANCE[ETag.Lighting];

  constructor(
    private route: ActivatedRoute,
    private coilService: CoilService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        tap((params) => {
          this.clearCoils();
          this.setChildTags(params);
        }),
      )
      .subscribe((params) => {
        if (params.tags) {
          this.setCoils(params.tags);
        }
      });
  }

  private setCoils(paramTags: Array<ETag>) {
    this.coils = this.coilService.getDeviceByTags(paramTags).map((c) => {
      c.subscribeTopic();
      return c;
    });
  }

  private clearCoils() {
    this.coils.forEach((c) => c.unsub());
    this.coils = [];
  }

  private setChildTags(params: any) {
    const tags: Array<ETag> = params.tags || [];
    this.childTags = tags.length
      ? TAGS_INHERITANCE[tags.at(-1)] || []
      : TAGS_INHERITANCE[ETag.Lighting];
  }
}
