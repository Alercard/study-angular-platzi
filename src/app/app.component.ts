import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  imgParent: string = '';
  showImage = true;
  token: string = '';
  imgRta = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private filesService: FilesService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getProfile().subscribe()
    }
  }

  onLoaded(img: string) {
    console.log(`load Padre ${img}`)
  }

  toogleImg() {
    this.showImage=!this.showImage;
  }

  createUser() {
    this.usersService.create({
      name: 'Frank',
      email: 'frank@email.com',
      password: '123123',
      role: 'customer'
    })
    .subscribe(rta => {
      console.log(rta)
    });
  }

  login() {
    this.authService.login('frank@email.com', '123123')
    .subscribe(rta => {
      this.token = rta.access_token;
    });
  }

  getProfile() {
    this.authService.getProfile()
    .subscribe(profile => {
      console.log(profile)
    })
  }

  downloadPDF() {
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    // no necesito programar en el suscribe, solo quiero ejecutarlo
    .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);

    if (file) {
      this.filesService.uploadFile(file)
      .subscribe(rta => {
        this.imgRta = rta.location;
      })
    }
  }

}
