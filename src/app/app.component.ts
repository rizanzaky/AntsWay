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
			this.initilizeDB();
    });
  }

	initilizeDB() {
		this.sqlite.create({
			name: 'antsway.db',
			location: 'default'
		}).then((db: SQLiteObject) => {

			db.executeSql(`
				CREATE TABLE IF NOT EXISTS Plan(
					planId	INT,
					colour	VARCHAR(32),
					name		VARCHAR(50),
					title		VARCHAR(20)
				);
			`, {})
			.then(() => alert('Created Plan'))
			.catch(e => alert('Plan Err : ' + JSON.stringify(e)));

			db.executeSql(`
				CREATE TABLE IF NOT EXISTS PlanItem(
					planItemId	INT,
					planId			INT,
					name				VARCHAR(50),
					isDone			BOOLEAN,
					status			INT,
					activeDays	VARCHAR(15),
					createdOn		DATETIME
				);
			`, {})
			.then(() => alert('Created Planitem'))
			.catch(e => alert('PlanItem Err : ' + JSON.stringify(e)));

			db.executeSql(`
				CREATE TABLE IF NOT EXISTS ItemSelection(
					planId			INT,
					planItemId	INT,
					date				DATETIME,
					isDone			BOOLEAN
				);
			`, {})
			.then(() => alert('Created ItemSelection'))
			.catch(e => alert('ItemS Err: ' + JSON.stringify(e)));

		}).catch(e => alert('Db Err: ' + JSON.stringify(e)));
	}
}