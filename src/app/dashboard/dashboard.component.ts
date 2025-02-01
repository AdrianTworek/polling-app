import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-dashboard',
    imports: [RouterModule, TabMenuModule],
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Polls',
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboard/polls',
      },
      {
        label: 'Settings',
        icon: 'pi pi-wrench',
        routerLink: '/dashboard/profile',
      },
    ];
  }
}
