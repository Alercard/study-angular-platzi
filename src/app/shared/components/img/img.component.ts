import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.scss']
})
export class ImgComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  img: string = '';
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('img')
  set changeImg(newImg: string) {
    this.img = newImg;
    console.log('change just img => ', newImg)
    // code cuando cambia img
  }

  @Input() alt: string = '';

  @Output() loaded = new EventEmitter<string>();
  imageDefault = './assets/images/noimage.png';
  counter = 0;
  counterFx: number | undefined;

  constructor() {
    // before render
    // no ejecutar cosas async, se ejecuta una vez
    console.log('constructor', 'imgValue => ', this.img)
  }

  ngOnChanges(changes: SimpleChanges): void {
      // before render
      // changes on inputs
      console.log('ngOnChanges', 'imgValue => ', this.img)
      console.log('Changes:', changes);
  }

  ngOnInit(): void {
      // before render
      // se puede ejecutar asyncs, fetch, calls to apis. Once time
      // un error muy comun es validar los cambios en esta funcion
      console.log('ngOnInit', 'imgValue => ', this.img)
      /*
      this.counterFx = window.setInterval(()=>{
        this.counter++;
        console.log(this.counter);
      }, 1000);
      */
  }

  ngAfterViewInit(): void {
      // after render
      // ideal para manipular hijos
      console.log('ngAfterViewInit', 'imgValue => ', this.img)
  }

  ngOnDestroy() {
    // delete
    console.log('ngOnDestroy')
    //window.clearInterval(this.counterFx);
  }

  imgError() {
    this.img = this.imageDefault;
  }

  imgLoaded() {
    console.log('load Hijo!')
    this.loaded.emit(this.img);
  }

}
