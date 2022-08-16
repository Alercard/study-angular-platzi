import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { StoreService } from 'src/app/services/store.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter: number = 0;
  profile: User | null = null;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private categoriesService: CategoriesService,
    private router: Router,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    // RXJS
    // Nos suscribimos en el ngOnInit, pero se puede desde el constructor
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length
    })
    this.getAllCategories();
    this.authService.user$.subscribe(data => { this.profile = data })
  }

  toggleMenu() {
    this.activeMenu=!this.activeMenu;
  }

  login() {
    //this.authService.loginAndGet('admin@mail.com', 'admin123')
    this.authService.loginAndGet('john@mail.com', 'changeme')
    .subscribe(user => {
      this.router.navigate(['/profile'])
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

  getAllCategories() {
    this.categoriesService.getAll()
    .subscribe(categories => {
      this.categories = categories;
    });
  }

  logout() {
    this.authService.logout();
    this.profile = null;
    this.router.navigate(['/home']);
  }
}
