import { FilmListComponent } from './film-list/film-list.component';
import { MovieAddEditComponent } from './movie-add-edit/movie-add-edit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: '/movie_list' },
	// {
	// 	path: 'welcome',
	// 	loadChildren: () =>
	// 		import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule),
	// },
	{
		path: 'movie_list',
		component: FilmListComponent,
	},
	{
		path: 'movie_add',
		component: MovieAddEditComponent,
	},
	{
		path: ':id/movie_edit',
		component: MovieAddEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
