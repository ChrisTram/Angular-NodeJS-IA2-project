import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRendu]'
})
export class RenduDirective {

  constructor(el:ElementRef) {
    el.nativeElement.style.color = 'green';
    el.nativeElement.style.border = '1px dashed green';
    el.nativeElement.style.backgroundColor = 'yellow';

    // ici on pourrait modifier le contenu de l'élément
    // par ex : el.nativeElement.innerHTML = ....
    // mettre des ecouteurs, appeler des méthodes...
  }

}
