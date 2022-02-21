import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AccountService {
	private pin1 = '0939866118';
	private pin2 = '0912880778';
	accountNotification = new Subject<boolean>();
	LoggedIn = false;

	login(pin: string): boolean {
		if (pin == this.pin1 || pin == this.pin2) {
			this.LoggedIn = true;
			this.accountNotification.next(true);
			return true;
		}
		return false;
	}

	logout() {
		this.accountNotification.next(false);
		this.LoggedIn = false;
	}

	logStatus() {
		return this.LoggedIn;
	}

	constructor() {}
}
