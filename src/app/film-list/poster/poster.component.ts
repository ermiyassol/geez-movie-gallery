import { MovieService } from './../../services/movie.service';
import { AccountService } from './../../services/account.service';
import { Movie } from './../../models/movie.model';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
	selector: 'app-poster',
	templateUrl: './poster.component.html',
	styleUrls: ['./poster.component.css'],
})
export class PosterComponent implements OnInit {
	@Input() movie: Movie;
	loginStatus = false;

	onEdit() {
		console.log(this.movie.title);
		const id = this.movieService.getIndex(this.movie.key);
		// console.log(id);
		this.routes.navigate(['../' + id + '/movie_edit'], {
			relativeTo: this.route,
		});
	}

	onDelete() {
		console.log(this.movie.title);
		this.movieService.deleteMovie(this.movie.key);
	}

	constructor(
		private accountService: AccountService,
		private movieService: MovieService,
		private route: ActivatedRoute,
		private routes: Router,
	) {}

	ngOnInit(): void {
		this.accountService.accountNotification.subscribe(
			(status) => (this.loginStatus = status),
		);
		this.loginStatus = this.accountService.logStatus();
	}
}
