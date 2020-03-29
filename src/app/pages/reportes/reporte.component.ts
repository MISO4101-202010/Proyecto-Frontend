import { Component, OnInit,ViewChild } from '@angular/core';
import { ContenidoService } from 'src/app/services/contenido.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-report',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReporteComponent implements OnInit {
    displayedColumns: string[] = ['nombre', 'descripcion'];
    displayedColumnsChild: string[]= ['nombre','id'];
   
    dataSourceChild:any[]; 

    dataSource = new MatTableDataSource(); 

    expandedElement ;

    @ViewChild('scheduledOrdersPaginator', {static:false}) paginator: MatPaginator;

    constructor(private contenidoService: ContenidoService) {}
    
    capitalize = (s) => {
                            if (typeof s !== 'string') return ''
                            return s.charAt(0).toUpperCase() + s.slice(1)
                        };
    ngOnInit() 
    {
        this.contenidoService.getCursosList().subscribe
        (data => 
        {   
            setTimeout(()=>{this.dataSource.data = data;this.dataSource.paginator = this.paginator;});
        });
    }


    ClickDetail(element:any){
        this.contenidoService.getCursosIdList(element.id).subscribe
        (data => 
        {   
            if(Object.keys(data).length !== 0)
            {
                this.dataSourceChild=[];
                data.forEach((el)=>this.dataSourceChild.push(el));
                this.expandedElement = this.expandedElement === element ? null : element;
            }
        });
    }
}




