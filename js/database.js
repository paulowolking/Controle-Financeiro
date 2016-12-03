function DataBase(){
	this.getInstance = function(){
		return openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);
	}

	this.init = function(){
		var db = this.getInstance();
		db.transaction(function (tx) {
		tx.executeSql ("CREATE TABLE IF NOT EXISTS dividas (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, descricao TEXT, categoria TEXT ,valor INTEGER, vencimento INTEGER,mes TEXT,pago INTEGER DEFAULT 0)");
		tx.executeSql ("CREATE TABLE IF NOT EXISTS categorias (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, descricao TEXT)");
	});
		var categoria = new Categoria();
		categoria.insertCategorias();
	}
}