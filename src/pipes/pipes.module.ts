import { NgModule } from '@angular/core';
import { SearchGroupsPipe } from './search-groups/search-groups';
import {RestService} from "../services";
@NgModule({
	declarations: [SearchGroupsPipe],
	imports: [],
  providers:[RestService],
	exports: [SearchGroupsPipe]
})
export class PipesModule {}
