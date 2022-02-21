// import { AngularFireModule } from '@angular/fire/compat';
import { ngZorroAntdModule } from './antd.NZ-zorro';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FilmListComponent } from './film-list/film-list.component';
import { PosterComponent } from './film-list/poster/poster.component';
import { MovieAddEditComponent } from './movie-add-edit/movie-add-edit.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { MovieAddingAPIComponent } from './movie-adding-api/movie-adding-api.component';
import { MovieDescriptionComponent } from './movie-description/movie-description.component';
registerLocaleData(en);

@NgModule({
	declarations: [
		AppComponent,
		FilmListComponent,
		PosterComponent,
		MovieAddEditComponent,
		MovieAddingAPIComponent,
		MovieDescriptionComponent,
	],
	imports: [
		ngZorroAntdModule,
		BrowserModule,
		AppRoutingModule,
		IconsProviderModule,
		HttpClientModule,
		NzLayoutModule,
		NzMenuModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,

		AngularFireModule.initializeApp(environment.firebaseConfig),
		AngularFireDatabaseModule,
	],
	providers: [{ provide: NZ_I18N, useValue: en_US }],
	bootstrap: [AppComponent],
})
export class AppModule {}
