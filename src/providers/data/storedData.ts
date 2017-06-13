import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Plan } from "../../models/plan";

class StoredData {
	constructor(
		private sqlite: SQLite
	) { }

	insertIntoPlan(plan: Plan) {
		this.sqlite.create({
			name: 'antsway.db',
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

	myTest() {
		let db: SQLiteObject = new SQLiteObject(this);

		db.open
	}
}