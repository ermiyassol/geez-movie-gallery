import { Movie } from './../models/movie.model';
import { MovieService } from './../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-movie-add-edit',
	templateUrl: './movie-add-edit.component.html',
	styleUrls: ['./movie-add-edit.component.css'],
})
export class MovieAddEditComponent implements OnInit {
	validateForm!: FormGroup;
	genreLists: string[] = [];
	options: string[] = ['ETS', 'ETM', 'ENS', 'ENM', 'KRM', 'KRS', 'INS', 'INM'];
	editMode = false;
	id: number = null;
	key: string = null;

	submitForm(): void {
		for (const i in this.validateForm.controls) {
			if (this.validateForm.controls.hasOwnProperty(i)) {
				this.validateForm.controls[i].markAsDirty();
				this.validateForm.controls[i].updateValueAndValidity();
			}
		}

		if (this.validateForm.valid) {
			const newMovie = new Movie(
				this.validateForm.value.code,
				this.validateForm.value.title,

				this.genreLists,
				this.validateForm.value.year,
				this.validateForm.value.url,
			);

			if (this.editMode) {
				this.movieService.updateMovie(newMovie, this.key).then(() => {
					this.validateForm.reset();
					this.message.create('success', `Movie Updated Successfully!!`);
				});
				this.routes.navigate(['../../'], { relativeTo: this.route });
			} else {
				this.movieService.addMovie(newMovie).then(() => {
					const prevCode = this.validateForm.value.code;
					const prevYear = this.validateForm.value.year;
					this.validateForm.reset();
					this.validateForm.patchValue({
						code: prevCode,
						year: prevYear,
					});
					this.message.create('success', `Movie Added Successfully!!`);
				});
			}
		}
	}

	// when genere selected this method invoked
	log(value: string[]): void {
		this.genreLists = value;
	}

	constructor(
		private fb: FormBuilder,
		private movieService: MovieService,
		private routes: Router,
		private route: ActivatedRoute,
		private message: NzMessageService,
	) {}

	ngOnInit(): void {
		this.validateForm = this.fb.group({
			code: [null, [Validators.required]],
			title: [null, [Validators.required]],
			year: [null, [Validators.required]],
			url: [null, [Validators.required]],
		});

		this.route.params.subscribe((params: Params) => {
			// todo
			if (params.id) {
				this.id = params.id;

				const editedMovie: Movie = this.movieService.fetchMovie(this.id);
				this.key = editedMovie.key;
				this.editMode = true;
				this.genreLists = editedMovie.genre;
				this.validateForm.setValue({
					code: editedMovie.code,
					title: editedMovie.title,
					year: editedMovie.year,
					url: editedMovie.url,
				});
			}
		});
	}
}
