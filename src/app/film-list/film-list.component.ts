import { MovieService } from './../services/movie.service';
import { Movie } from './../models/movie.model';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-film-list',
	templateUrl: './film-list.component.html',
	styleUrls: ['./film-list.component.css'],
})
export class FilmListComponent implements OnInit {
	radioValue = 'A';
	countryValue: string;
	typeValue: string;
	moviesList: Movie[] = [];
	date = null;
	searchValue: string;
	genre: string[] = [];
	log(value: string[]): void {
		this.genre = value;
		this.movieService.advancedQuery(this.date, this.genre);
	}

	onChange(): void {
		this.date = new Date(this.date).getFullYear();

		this.movieService.advancedQuery(this.date, this.genre);
	}

	basicFilter(type: string) {
		if (type == 'country') {
			if (this.countryValue == 'ALL') {
				this.typeValue = null;
			}
		}
		const code =
			type == 'country' && this.typeValue == null
				? this.countryValue
				: this.countryValue + this.typeValue;
		console.log(code);
		this.movieService.filterCT(code);
	}

	onSearchingMovies() {
		this.movieService.searching(this.searchValue);
		// console.log(this.movieService.fetchNA());
	}

	constructor(private movieService: MovieService) {}

	ngOnInit(): void {
		this.movieService.movieList.subscribe((movies) => {
			this.moviesList = movies;
		});
		this.movieService.fetchMovies();
		// this.movieService.changeReleasedDate();
	}
}
