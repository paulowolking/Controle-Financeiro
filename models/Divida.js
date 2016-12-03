function Divida(){
	var id;
	var descricao;
	var categoria;
	var valor;
	var vencimento;
	var mes;
	var pago;

	this.setId = function(id){
		this.id = id;
	}

	this.setDescricao = function(descricao){
		this.descricao = descricao;
	}

	this.setCategoria = function(categoria){
		this.categoria = categoria;
	}

	this.setValor = function(valor){
		this.valor = valor;
	}

	this.setDataVencimento = function(vencimento){
		this.vencimento = vencimento;
	}

	this.setMes = function(mes){
		this.mes = mes;
	}

	this.setPago = function(pago){
		this.pago = pago;
	}

	this.save = function(callback){
		var data = new Data();
		var database = new DataBase();

		var id = this.id;
		var descricao = this.descricao;
		var categoria = this.categoria;
		var valor = this.valor;
		var vencimento = this.vencimento;
		var mes = parseInt(data.getNumberMonth(this.mes),10);
		var pago = this.pago == null ? 0  : this.pago;

		console.log("ID: " + id);

		var db = database.getInstance();
		db.onError = function(tx, e) {alert("Erro na transação, ao salvar: " + e.message);}
		db.onSuccess = function(tx, r) {console.log("Salvo com sucesso")}

		db.transaction(function (tx) {
			if(id == null)
	   			tx.executeSql("INSERT INTO dividas (descricao, categoria, valor, vencimento, mes, pago) VALUES (?,?,?,?,?,?)", [descricao, categoria, valor, vencimento,mes, pago], db.onSuccess, db.onError);
	   		else
				tx.executeSql("UPDATE dividas SET descricao=?, categoria=?, valor=?, vencimento=?, mes=?, pago=? WHERE id=?", [descricao, categoria, valor, vencimento,mes, pago, id], db.onSuccess, db.onError);

			callback(true);
		});
	}

	this.findById = function(id, callback){
		var database = new DataBase();
		var db = database.getInstance();

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM dividas WHERE id = ?', [id], function (tx, results) {
	  			var divida = results.rows.item(0);
	  			callback(divida);
			});	
		});
	}

	this.findByMonth = function(mes, callback){
		var database = new DataBase();

		var dividas = new Array();
		var db = database.getInstance();

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM dividas WHERE mes = ?', [mes], function (tx, results) {
	  			var len = results.rows.length, i;
	  			for (i = 0; i < len; i++) {
	  				dividas.push(results.rows.item(i));
	  			}
	  			callback(dividas);
			});	
		});
	}

	this.distinctMonth = function(callback){
		var database = new DataBase();

		var months = new Array();
		var db = database.getInstance();

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM dividas GROUP BY mes', [], function (tx, results) {
	  			var len = results.rows.length, i;
	  			for (i = 0; i < len; i++) {
	  				months.push(results.rows.item(i).mes);
	  			}
	  			callback(months);
			});	
		});
	}

	this.findAll = function(callback){
		var database = new DataBase();

		var dividas = new Array();
		var db = database.getInstance();

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM dividas ORDER BY mes ASC', [], function (tx, results) {
	  			var len = results.rows.length, i;
	  			for (i = 0; i < len; i++) {
	  				dividas.push(results.rows.item(i));
	  			}
	  			callback(dividas);
			});	
		});
	}

	this.findAllMonthActual = function(callback){
		var database = new DataBase();

		var data = new Data();
		var dividas = new Array();
		var db = database.getInstance();

		db.transaction(function(tx) {
	    	tx.executeSql('SELECT * FROM dividas WHERE mes = ? ORDER BY pago ASC', [data.getNumberMonth(data.getMes())], function (tx, results) {
	  			var len = results.rows.length, i;
	  			for (i = 0; i < len; i++) {
	  				dividas.push(results.rows.item(i));
	  			}
	  			callback(dividas);
			});	
		});
	}

	this.delete = function(id, callback){
		var database = new DataBase();

		var db = database.getInstance();

		db.transaction(function(tx) {
	    	 tx.executeSql('DELETE FROM dividas WHERE id = ?', [id], db.onSuccess, db.onError);
		});
	}

	this.dadosGrafico = function(callback, mes){
		//console.log("Aqui " + mes)
		var objects = new Array();
		var database = new DataBase();
		var db = database.getInstance();
		db.transaction(function(tx) {
			tx.executeSql('SELECT SUM(valor) as valor,categoria FROM dividas WHERE mes = ? GROUP BY categoria ', [mes], function (tx, results) {
	  			var len = results.rows.length, i;
			  		for (i = 0; i < len; i++) {
			  			objects.push(results.rows.item(i));
			  		}
			  		callback(objects);
			  	});	
			});
	}
}