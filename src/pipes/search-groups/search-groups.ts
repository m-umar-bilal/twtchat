import {Pipe, PipeTransform} from '@angular/core';
import {RestService} from "../../services";
import {environment} from "../../env";

/**
 * Generated class for the SearchGroupsPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchGroups',
})
export class SearchGroupsPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  public serverURL: string = environment.API_URL;

  constructor(private svc: RestService) {

  }

  transform(items: any[], terms: string, loading: boolean[]): any[] {
    if (!terms) {
      loading[0] = true;
      loading[0] = false;
      return items;

    }
    loading[0] = true;

    terms = terms.toLowerCase();
    this.svc.searchGroups(this.currentUser.email, this.currentUser.password, terms.toLowerCase()).subscribe((data: any) => {
      loading[0] = false;

      if (data.error_message === "") {
        console.log("bnvbnvbnvbnvbnv")
        items.push(...data.groups);
        return items;
      } else {
        return [];
      }
    }, error2 => {
      loading[0] = false;

      return [];

    })
    // return items.filter(it => {
    //   return it.name.toLowerCase().includes(terms); // only filter country name
    // });
  }
}
