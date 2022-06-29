import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-menu',
  template: `
      <div class="layout-menu-container">
          <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
              <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                  <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                  <ul role="menu">
                      <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                  </ul>
              </li>
          </ul>
      </div>
  `
})

export class MenuComponent implements OnInit, OnDestroy {

  model: MenuItem[] = [];
  menuSubscription: Subscription;

  constructor(
    public appMain: LayoutComponent,
    public sessionService: SessionService
  ) {
    this.menuSubscription = this.sessionService.menu$.subscribe(menu => {
      this.model = menu;
    })
  }

  ngOnInit(): void {
    this.sessionService.refreshMenu()
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = (<HTMLDivElement>event.target);
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
  }
}