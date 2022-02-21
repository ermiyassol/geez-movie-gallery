import { Movie } from './../models/movie.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root',
})
export class MovieService {
	Movies: Movie[] = [];
	movieList = new Subject<Movie[]>();
	lastCode = 'ALL';
	constructor(private db: AngularFireDatabase, private http: HttpClient) {}

	setMovies() {
		this.db.database.ref('movies').once('value', (snapshot) => {
			this.Movies = [];
			for (const key in snapshot.val()) {
				if (snapshot.val().hasOwnProperty(key)) {
					let temp: Movie;
					temp = snapshot.val()[key];
					temp.key = key;
					temp.genre = temp.genre ? temp.genre : [];
					this.Movies.push(temp);
				}
			}
			// this.changeReleasedDate();
			// this.Movies = this.sort(this.Movies);
			localStorage.setItem('movies', JSON.stringify(this.Movies));
			this.movieList.next(this.Movies);
		});
	}

	fetchNA() {
		return this.Movies.filter(
			(movie) => movie.year.split(' ').length == 1 && movie.code.includes('EN'),
		);
	}

	sort(selectedMovie: Movie[]) {
		return selectedMovie.sort((movie1, movie2) => {
			const mov1Date = movie1.year.split(' ');
			const mov2Date = movie2.year.split(' ');
			// if (movie1.year == 'N/A' || movie2.year == 'N/A') {
			// 	// return 0;
			// } else {
			return this.returnSortValue(mov1Date, mov2Date);
			// }
		});
	}

	private returnSortValue(a: string[], b: string[]): number {
		let condition1: boolean;
		let condition2: boolean;
		if (a.length == 1 && b.length == 1) {
			condition1 = parseInt(a[0]) < parseInt(b[0]);
			condition2 = parseInt(a[0]) > parseInt(b[0]);
		} else if (a.length == 1) {
			condition1 = parseInt(a[0]) < parseInt(b[2]);
			condition2 = parseInt(a[0]) > parseInt(b[2]);
		} else {
			condition1 = parseInt(a[2]) < parseInt(b[0]);
			condition2 = parseInt(a[2]) > parseInt(b[0]);
		}
		if (a.length == 1 || b.length == 1) {
			if (condition1) {
				return 1;
			}
			if (condition2) {
				return -1;
			}
		} else {
			const a_date = parseInt(a[0]);
			const a_month = new Date(a.join(' ')).getMonth();
			const a_year = parseInt(a[2]);
			const b_date = parseInt(b[0]);
			const b_month = new Date(b.join(' ')).getMonth();
			const b_year = parseInt(b[2]);
			if (
				a_year < b_year ||
				(a_year == b_year && a_month < b_month) ||
				(a_year == b_year && a_month == b_month && a_date < b_date)
			) {
				return 1;
			}
			if (
				a_year > b_year ||
				(a_year == b_year && a_month > b_month) ||
				(a_year == b_year && a_month == b_month && a_date > b_date)
			) {
				return -1;
			}
		}
		return 0;
	}

	// changeReleasedDate() {
	// 	const temp = this.Movies;
	// 	temp.forEach((movie, index) => {
	// 		if (
	// 			movie.year.split(' ').length == 1 &&
	// 			movie.year.split(' ')[0] != 'N/A'
	// 		) {
	// 			this.fetchMovieAPI(movie.title).subscribe((response) => {
	// 				if (response.Response == 'True') {
	// 					const movieUpdate = new Movie(
	// 						movie.code,
	// 						movie.title,
	// 						movie.genre,
	// 						response.Released,
	// 						movie.url,
	// 						movie.key,
	// 					);
	// 					// console.log(movieUpdate);
	// 					this.Movies[index] = movieUpdate;
	// 				} else {
	// 					if (movie.code == 'ENM' || movie.code == 'ENS') {
	// 						const movieUpdate = new Movie(
	// 							movie.code,
	// 							movie.title,
	// 							movie.genre,
	// 							'N/A',
	// 							movie.url,
	// 							movie.key,
	// 						);
	// 						// console.log(movieUpdate);
	// 						this.Movies[index] = movieUpdate;
	// 					}
	// 				}
	// 			});
	// 		}
	// 	});
	// console.log(this.Movies);
	// this.movieList.next(this.Movies);
	// }

	fetchMovies() {
		this.Movies = JSON.parse(localStorage.getItem('movies'));
		// this.Movies.reverse();
		// this.Movies = this.sort(this.Movies);
		this.movieList.next(this.Movies);
	}

	addMovie(movieDesc: Movie) {
		return this.db
			.list('movies')
			.push({
				code: movieDesc.code,
				title: movieDesc.title,
				genre: movieDesc.genre ? movieDesc.genre : [],
				year: movieDesc.year,
				url: movieDesc.url,
			})
			.then((response) => {
				movieDesc.key = response.key;
				this.Movies.unshift(movieDesc);
				localStorage.setItem('movies', JSON.stringify(this.Movies));
			});
	}

	filterCT(code: string) {
		this.lastCode = code;
		if (code == 'ALL') {
			this.movieList.next(this.Movies);
			return;
		}
		const temp = this.Movies.filter((movie) => movie.code.includes(code));
		const sortedList = this.sort(temp);
		console.log(sortedList);
		this.movieList.next(sortedList);
	}

	fetchWithCode(code: string): Movie[] {
		this.lastCode = code;
		if (code == 'ALL') {
			return this.Movies;
		}
		const temp = this.Movies.filter((movie) => movie.code.includes(code));
		return temp;
	}

	getIndex(key: string): number {
		return this.Movies.findIndex((movie) => movie.key == key);
	}

	fetchMovie(index: number): Movie {
		return this.Movies[index];
	}

	updateMovie(movie: Movie, key: string) {
		const index = this.getIndex(key);
		this.Movies[index] = movie;
		movie.key = null!;
		localStorage.setItem('movies', JSON.stringify(this.Movies));
		// this.movieList.next(this.Movies);
		return this.db.list('movies').update(key, movie);
	}

	searching(searchValue: string) {
		const temp = this.Movies.filter((movie) =>
			movie.title.toLowerCase().includes(searchValue.toLowerCase()),
		);
		this.movieList.next(temp);
	}

	deleteMovie(key: string) {
		const index = this.getIndex(key);
		this.Movies.splice(index, 1);
		localStorage.setItem('movies', JSON.stringify(this.Movies));
		// this.movieList.next(this.Movies);
		return this.db.list('movies').remove(key);
	}

	advancedQuery(date: number, genre: string[]) {
		if (date == 1970 || (date == null && genre.length == 0)) {
			this.filterCT(this.lastCode);
			return;
		} else {
			const filteredMovies = this.fetchWithCode(this.lastCode);
			const temp = filteredMovies.filter((movie) => {
				const dateArr = movie.year.split(' ');
				const year =
					dateArr.length == 1 ? parseInt(dateArr[0]) : parseInt(dateArr[2]);

				if ((date == 1970 || date == null) && genre.length > 0) {
					return genre.every((g) => movie.genre.includes(g));
				} else if ((date != 1970 || date != null) && genre.length == 0) {
					return year == date;
				} else {
					return genre.every((g) => movie.genre.includes(g) && year == date);
				}
			});
			const sortedList = this.sort(temp);
			this.movieList.next(sortedList);
		}
	}

	addToFirebase(key = 'movies') {
		this.Movies.forEach((movie) => {
			// const newMovie = new Movie(movie.code, movie.title, movie.genre, movie.year, movie.url);
			this.db.list(key).push({
				code: movie.code,
				title: movie.title,
				genre: movie.genre,
				year: movie.year,
				url: movie.url,
			});
		});
	}

	deleteDuplicate() {
		const FinalizedMoviesList = this.Movies.filter((movie, index, array) => {
			if (array.map((arr) => arr.title).indexOf(movie.title) < index) {
				console.log(movie.title);
			} else {
				return true;
			}
		});
		this.Movies = FinalizedMoviesList;
		localStorage.setItem('movies', JSON.stringify(this.Movies));
		this.addToFirebase('newUpdatedList');
		this.movieList.next(FinalizedMoviesList);
	}
	// todo functions
	// sort(key: string, movieArray: Movie[]) {
	// 	movieArray.sort((movie, index) => {
	// 		if (a[`${key}`] < b.last_nom) {
	// 			return -1;
	// 		}
	// 		if (a.last_nom > b.last_nom) {
	// 			return 1;
	// 		}
	// 		return 0;
	// 	});
	// }

	fetchMovieAPI(title: string): any {
		return this.http.get(`https://www.omdbapi.com/?t=${title}&apikey=f4d1b82c`);
		// .subscribe((response) => {
		// 	console.log('response from API');
		// 	console.log(response);
		// });
	}
}

// ! todo delete function deletes all the movies
