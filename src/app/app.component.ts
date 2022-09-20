import { Component } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FilesService } from './services/files.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token= '';

  constructor(
    private usersService: UsersService
    ,private filesService: FilesService
  ) {}


  onLoaded(img: string) {
    // console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser() {
    this.usersService.create({
        name: 'Mauro',
        email: 'mauro@mail.com',
        password: '1234'
      })
      .subscribe(rta => {
        console.log(rta);
      })
  }

  downloadPDF(){              //nombre de como lo quiero descargar, url del pdf                      ,tipo de contenido
    this.filesService.getFile('my.pdf','https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }


}
