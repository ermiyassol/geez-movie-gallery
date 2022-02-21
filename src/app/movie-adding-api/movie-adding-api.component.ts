import { Movie } from './../models/movie.model';
import { MovieService } from './../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-movie-adding-api',
	templateUrl: './movie-adding-api.component.html',
	styleUrls: ['./movie-adding-api.component.css'],
})
export class MovieAddingAPIComponent implements OnInit {
	movieTitle = '';
	errorMessage = false;
	fetchedMovie: any;
	constructor(
		private movieService: MovieService,
		private message: NzMessageService,
	) {}

	ngOnInit(): void {}

	onFetchMovie() {
		this.fetchedMovie = null;
		this.errorMessage = false;
		this.movieService.fetchMovieAPI(this.movieTitle).subscribe((response) => {
			console.log(response);
			if (response.Response == 'True') {
				console.log('EN' + response.Type.charAt(0).toUpperCase());
				console.log('true');
				this.errorMessage = false;
				this.fetchedMovie = response;
			} else {
				console.log('false');
				this.errorMessage = true;
				this.fetchedMovie = null;
			}
		});
	}

	onSaving() {
		const code = 'EN' + this.fetchedMovie.Type.charAt(0).toUpperCase();
		const genre = this.fetchedMovie.Genre.split(', ');
		// console.log(this.fetchedMovie.Genre);
		// console.log(genre);
		const newMovie = new Movie(
			code,
			this.fetchedMovie.Title,
			genre,
			this.fetchedMovie.Released,
			this.fetchedMovie.Poster,
		);
		this.movieService.addMovie(newMovie).then(() => {
			this.message.create('success', `Movie Added Successfully!!`);
			this.movieTitle = null;
			this.errorMessage = false;
			this.fetchedMovie = null;
		});
	}
}
