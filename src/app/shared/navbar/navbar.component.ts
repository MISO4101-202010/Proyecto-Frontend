import {Component, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/usuario/auth.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface NavNode {
  name: string;
  children?: NavNode[];
}

const TREE_DATA: NavNode[] = [
  {
    name: 'Contenido Interactivo',
    children: [
      { name: 'Subir Video' },
      { name: 'Ver Contenido Interactivo' },
    ]
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  student: boolean;
  user: any;
  name: string;
  showMenu: boolean;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    private auth: AuthService
  ) {
    this.dataSource.data = TREE_DATA;
    const actualUser = sessionStorage.getItem('userConectaTe');
    this.student = JSON.parse(actualUser).isAlumno;
    this.user = JSON.parse(actualUser);
    this.name = '';
    this.showMenu = false;
  }

  navNodeLinks(pag: string) {
    switch (pag) {
      case 'Subir Video': {
        this.router.navigate(['/load-videos']);
        break;
      }
      case 'Ver Contenido Interactivo': {
        this.router.navigate(['/contenido-interactivo']);
        break;
      }
      default: {
        console.log('Ruta no encontrada para la entrada: ', pag);
        break;
      }
    }
  }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.getName();
  }

  getName() {
    if (this.user.isAlumno) {
      this.name = this.user.dataAlumno.first_name + ' ' + this.user.dataAlumno.last_name;
    } else {
      this.name = this.user.dataProfesor.first_name + ' ' + this.user.dataProfesor.last_name;
    }
  }

  toggleProfileMenu() {
    this.showMenu = !this.showMenu;
  }

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  private _transformer = (node: NavNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
