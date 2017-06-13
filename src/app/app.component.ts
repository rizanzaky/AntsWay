import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private sqlite: SQLite) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

	initilizeDB() {
		this.sqlite.create({
			name: 'data.db',
			location: 'default'
		}).then((db: SQLiteObject) => {
			db.executeSql(`
				CREATE TABLE IF NOT EXISTS Plan(
					planId	INT,
					colour	VARCHAR(32),
					name	VARCHAR(50),
					title	VARCHAR(20)
				);
			`, {})
			.then(() => alert('Executed SQL'))
			.catch(e => alert(e));
  		}).catch(e => alert(e));
	}
}

