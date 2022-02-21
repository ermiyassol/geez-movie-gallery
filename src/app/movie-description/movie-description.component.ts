import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-movie-description',
	templateUrl: './movie-description.component.html',
	styleUrls: ['./movie-description.component.css'],
})
export class MovieDescriptionComponent implements OnInit {
	@Input() movie: any;
	constructor() {}

	ngOnInit(): void {}
}
