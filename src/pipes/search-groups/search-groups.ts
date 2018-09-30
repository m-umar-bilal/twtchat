import {Pipe, PipeTransform} from '@angular/core';
import {RestService} from "../../services";
import {environment} from "../../env";

/**
 * Generated class for the SearchGroupsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */

  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
    terms = terms.toLowerCase();
    return items.filter( it => {
      return it.name.toLowerCase().includes(terms); // only filter country name
    });
  }

}
