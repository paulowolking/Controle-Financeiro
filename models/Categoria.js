function Categoria(){
	var id;
	var descricao;

	this.descricao = function(descricao){
		this.descricao = descricao;
	}

	this.save = function(){
		var descricao = this.descricao;
		
		var db = openDatabase('mydb', '1.0', 'Meu banco', 2 * 1024 * 1024);
		db.onError = function(tx, e) {alert("Erro na transação, ao salvar: " + e.message);}
		db.onSuccess = function(tx, r) {console.log("Salvo com sucesso")}

		db.transaction(function (tx) {
	   		tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", [descricao], db.onSuccess, db.onError);
		});
	}

	this.findAll = function(callback){
		var categorias = new Array();
		var db = openDatabase('mydb', '1.0', 'my first database', 2 * 1024 * 1024);

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM categorias', [], function (tx, results) {
	  			var len = results.rows.length, i;
	  			for (i = 0; i < len; i++) {
	  				categorias.push(results.rows.item(i));
	  			}
	  			callback(categorias);
			});	
		});
	}

	this.insertCategorias = function(){
		var db = openDatabase('mydb', '1.0', 'Meu banco', 2 * 1024 * 1024);
		db.onError = function(tx, e) {alert("Erro na transação, ao salvar: " + e.message);}
		db.onSuccess = function(tx, r) {console.log("Categoria salva com sucesso")}


		db.transaction(function(tx) {
	        tx.executeSql('SELECT * FROM categorias', [], function(tx, results) {
	            var count = results.rows.length;
	           
	            if(count != 0)
	            	return;

	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Alimentação'], db.onSuccess, db.onError);
	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Educação'], db.onSuccess, db.onError);
	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Lazer'], db.onSuccess, db.onError);
	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Poupança'], db.onSuccess, db.onError);
	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Automóvel'], db.onSuccess, db.onError);
	            tx.executeSql("INSERT INTO categorias (descricao) VALUES (?)", ['Moradia'], db.onSuccess, db.onError);
	        });
	    });
	}
}