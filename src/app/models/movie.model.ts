export class Movie {
	constructor(
		public code: string,
		public title: string,

		public genre: string[],
		public year: string,
		public url: string,
		public key?: string,
	) {}
}
