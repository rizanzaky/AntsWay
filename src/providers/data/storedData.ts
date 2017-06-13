import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

class StoredData {
	constructor(
		private sqlite: SQLite
	) { }

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