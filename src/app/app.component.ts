import { AccountService } from './services/account.service';
import { MovieService } from './services/movie.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	loginStatus = false;
	constructor(
		private fb: FormBuilder,
		private routes: Router,
		private movieService: MovieService,
		private accountService: AccountService,
		private message: NzMessageService,
	) {}
	isCollapsed = false;
	isVisible = false;
	isOkLoading = false;

	validateForm: FormGroup;

	showModal(): void {
		this.isVisible = true;
	}

	saveMyList() {
		this.movieService.addToFirebase();
	}

	deleteDuplicate() {
		this.movieService.deleteDuplicate();
	}

	handleOk(): void {
		// this.isOkLoading = true;
		// setTimeout(() => {
		// 	this.isVisible = false;
		// 	this.isOkLoading = false;
		// }, 3000);
		for (const i in this.validateForm.controls) {
			if (this.validateForm.controls.hasOwnProperty(i)) {
				this.validateForm.controls[i].markAsDirty();
				this.validateForm.controls[i].updateValueAndValidity();
			}
		}
		if (this.validateForm.valid) {
			this.accountService.login(this.validateForm.value.pin)
				? this.loginSuccess()
				: this.message.create('error', `Incorrect Pin!!! please Try again`);
		}
	}

	private loginSuccess() {
		this.validateForm.reset();
		this.message.create('success', `Successfully Logged In, WellCome!`);
		this.isVisible = false;
		this.routes.navigate(['movie_add']);
	}

	logout() {
		this.accountService.logout();
		this.routes.navigate(['movie_list']);
	}

	handleCancel(): void {
		this.isVisible = false;
	}

	ngOnInit(): void {
		// console.log(
		// 	this.movieService.returnSortValue(['2016'], ['09', 'Oct', '2012']),
		// );
		this.validateForm = this.fb.group({
			pin: [null, [Validators.required]],
		});

		this.accountService.accountNotification.subscribe(
			(status) => (this.loginStatus = status),
		);
		this.loginStatus = this.accountService.logStatus();
	}

	setMovies() {
		this.movieService.setMovies();
	}
}
