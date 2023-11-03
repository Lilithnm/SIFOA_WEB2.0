import { Component, Input } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { BaseModel } from 'src/models/catalogos';
import { MaterialModel } from 'src/models/main';
import { CatalogoService } from 'src/services/shared/catalogo.service';
@Component({
  selector: 'app-form-material',
  templateUrl: './form-material.component.html',
  styleUrls: ['./form-material.component.scss'],
})
export class FormMaterialComponent {

  @Input() material: MaterialModel = new MaterialModel(0);



  grupos:BaseModel [] = [];
  gruposFiltrados: Observable<BaseModel[]> | undefined;
  
  grupoControl = new FormControl<string |BaseModel>('');

  // Form 1
  materialForm?: UntypedFormGroup;
  hide = true;

  constructor(private fb: UntypedFormBuilder,private svcCatalogos: CatalogoService) {
    this.cargaCatalogos()
  }
  displayGrupoFn(grupo: BaseModel): string {
    return grupo && grupo.Descripcion ? grupo.Descripcion : '';
  }

  
  cargaCatalogos(){
    //grupo
    this.svcCatalogos.ObtenerCatalogo(new BaseModel(0),3 ).subscribe(respuesta => {

     this.grupos = respuesta;
     // callback function returning the boolean value

     this.gruposFiltrados = this.grupoControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const grupoDesc = typeof value === 'string' ? value : value?.['Descripcion']

        return grupoDesc ? this._filterGrupo(value as string) : this.grupos.slice();
      }))
    }, () => { }, () => {
    });


}
private _filterGrupo(Descripcion: string): BaseModel[] {
  const filterValue = Descripcion.toString().toLowerCase();
  return this.grupos.filter(option => option.Descripcion.toString().toLowerCase().includes(filterValue));
}

}
