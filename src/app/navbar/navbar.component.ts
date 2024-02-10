import { Component, OnInit, inject } from '@angular/core';

import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ButtonModule, MenuModule, AvatarModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        items: [
          {
            label: 'Polls',
            icon: 'pi pi-chart-bar',
            routerLink: '/dashboard',
          },
        ],
      },
      {
        label: 'Account',
        items: [
          {
            label: 'Log out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authService.logOut().then(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Successfully logged out',
                  detail: 'See you soon',
                });
                this.router.navigate(['/auth']);
              });
            },
          },
        ],
      },
    ];
  }
}
