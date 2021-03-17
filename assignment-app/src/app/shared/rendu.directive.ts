import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appRendu]'
})
export class RenduDirective {

  constructor(el: ElementRef) {
    el.nativeElement.style.color = 'black';
    el.nativeElement.style.backgroundColor = '#8ad9ff';

    // ici on pourrait modifier le contenu de l'élément
    // par ex : el.nativeElement.innerHTML = ....
    // mettre des ecouteurs, appeler des méthodes...
  }

}
