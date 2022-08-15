import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter: number = 0;
  profile: User | null = null;

  constructor(
    private storeService: StoreService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // RXJS
    // Nos suscribimos en el ngOnInit, pero se puede desde el constructor
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length
    })
  }

  toggleMenu() {
    this.activeMenu=!this.activeMenu;
  }

  login() {
    this.authService.loginAndGet('frank@email.com', '123123')
    .subscribe(user => {
      this.profile = user;
    })
    /*
    this.authService.login('frank@email.com', '123123')
    .subscribe(token => {
      this.getProfile();
    })
    */
  }

  getProfile() {
    this.authService.getProfile()
    .subscribe(user => {
      this.profile = user;
    })
  }

}