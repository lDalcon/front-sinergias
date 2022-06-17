import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {

  items: MenuItem[] = [];

  constructor(
    public appMain: LayoutComponent,
    private authService: AuthService
  ) { }

  logOut() {
    this.authService.logOut()
  }
}
