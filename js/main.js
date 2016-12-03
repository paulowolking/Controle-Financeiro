//var currentIndex = $('div.active').index();
// ready page.
$(document).ready(function () {
	var database = new DataBase();

	database.init();
	configs();
});

function configs(){
	var data = new Data();
	var categoria = new Categoria();
	$('#mes-atual').text(data.getMes());
	$("#myCarousel").carousel();
	$('#smallModal').on('hide.bs.modal', function() {
       	$("#title-modal").text("Nova Despesa");
       	$("#descricao").val("")
		$("#valor").val("")
		$("#data-vencimento").val(data.getDateFormat());
		$("#divida-id").val("");
    });

	//Mês atual selecionado no selected.
	document.getElementById("mes").selectedIndex = data.getNumberMonth(data.getMes());
	$("#data-vencimento").mask("99/99/9999");
	$("#data-vencimento").val(data.getDateFormat());

    montaTodas();
    categoria.findAll(function(categorias){
    	for( i = 0;  i < categorias.length; i++){
    		var line = '<option>'+categorias[i].descricao+'</option>';
    		document.getElementById('categoria').innerHTML += line;
    	}
    });
}

// listeners.
document.addEventListener('DOMContentLoaded', function () {
   document.getElementById('button-ok').addEventListener('click', salvarDivida);
});

/***********************************************************************************/
// TODO: Verificar isto, parei aqui.
$('a').click(function(e){
	var active = $(".item active");
	console.log(active)
	if(e.currentTarget.className == 'right carousel-control')
		console.log("direita");
	else if(e.currentTarget.className == 'left carousel-control')
		console.log("esquerda");
	});
/***********************************************************************************/

function addListenersButtons(){
	var divida = new Divida();
	var dividas = divida.findAll(function(dividas){
		for( i = 0;  i < dividas.length; i++){
			// Pagar.
			document.getElementById('pagar-' + dividas[i].id).addEventListener("click", function(){
				console.log(this)
				var data = new Data();
				var divida = new Divida();
				var id = this.id.split("-")[1];
				var dividaBuscada = divida.findById(id, function(d){
					divida.setId(d.id);
				 	divida.setDescricao(d.descricao);
				 	divida.setCategoria(d.categoria);
				 	divida.setValor(d.valor);
				 	divida.setDataVencimento(d.vencimento);
				 	divida.setMes(data.getMesByIndice(Math.floor(d.mes)));
				 	divida.setPago(true);

				 	divida.save();
				 	this.marcarComoPago(d.id);
				});
			});
			// Editar.
			document.getElementById('editar-' + dividas[i].id).addEventListener("click", function(){
				var data = new Data();
				var divida = new Divida();
   				var id = this.id.split("-")[1];

   				var dividaBuscada = divida.findById(id, function(d){
   					$("#mes").val(data.getMesByIndice(Math.floor(d.mes)));
   					$("#descricao").val(d.descricao);
   					$("#valor").val(d.valor);
   					$("#data-vencimento").val(d.vencimento);
   					$("#categoria").val(d.categoria);
   					$("#title-modal").text("Edição");
   					$("#divida-id").val(d.id);

   					$('#smallModal').modal('show');
   				});
			});
			// Excluir.
			document.getElementById('excluir-' + dividas[i].id).addEventListener("click", function(){
				var divida = new Divida();
   				var id = this.id.split("-")[1];
   				
   				var dividaBuscada = divida.findById(id, function(d){
   					divida.delete(d.id,null);
   					this.removerDivida(d.id);
   				});
			});
		}
	});
}

function salvarDivida(){
		console.log($("#mes").val())
		var id = $("#divida-id").val();
		var mes = $("#mes").val();
		var descricao = $("#descricao").val();
		var valor = $("#valor").val();
		var vencimento = $("#data-vencimento").val();
		var categoria = $("#categoria").val();

		var data = new Data();
	 	var divida = new Divida();
	 	if(id != "")
	 		divida.setId(id);

	 	divida.setDescricao(descricao);
	 	divida.setCategoria(categoria);
	 	divida.setValor(valor);
	 	divida.setDataVencimento(vencimento);
	 	divida.setMes(mes);
	 	console.log(divida)
	 	divida.save(function(reload){
			refreshPage();
	 	});
}

function refreshPage() {
    location.reload(true);
}

function marcarComoPago(dividaId){
	$( "#linha-"+dividaId ).css( "background-color", "#A4DCAA" );
	$( "#pagar-"+dividaId ).hide();
}

function removerDivida(dividaId){
	$( "#linha-"+dividaId ).hide();
}

function montaTodas(){
	var data = new Data();
	var divida = new Divida();
	var meses = divida.distinctMonth(function(meses){
		for (i = 0; i < meses.length; i++){
			var data = new Data();
				if(meses[i] == data.getNumberMonth(data.getMes())){
					var dividas = divida.findByMonth(meses[i], function(dividas){
					var itemCarrousel = this.itemActive(dividas);

					document.getElementById('itens-carrousel').innerHTML += itemCarrousel;

					this.calculaTotal(dividas);
				});
				}else{	
					var dividas = divida.findByMonth(meses[i], function(dividas){
					var itemCarrousel = this.itemCarrousel(dividas);
					document.getElementById('itens-carrousel').innerHTML += itemCarrousel;

					this.calculaTotal(dividas);
				});
			}
		}

		if(meses.length == 0){
			var data = new Data();
			var mesAtual = data.getMes();
			var table = '<div class="item active" ><h2 class="'+ mesAtual +'">'+mesAtual+'</h2><button class="btn btn-success btn-add" data-toggle="modal" data-target="#smallModal"><span class="glyphicon glyphicon-plus"></span> Despesa</button><div class="panel panel-default"><table class="table table-striped"><thead><tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Data de vencimento</th><th width="100px"></th></tr></thead><tbody id="body'+mesAtual+'">'+ this.linesItemCarrousel([]) +'</tbody></table></div><div id="dados"><h3 id="total-'+mesAtual+'"></h3></div></div>';
			document.getElementById('carousel-example-generic').innerHTML += table;
		}
			

		this.addListenersButtons();
	});
}

function calculaTotal(dividas){
	var data = new Data();
	var total = 0;
		for(j = 0; j < dividas.length; j++){
			total += dividas[j].valor;
				if(dividas[j].pago)
					this.marcarComoPago(dividas[j].id);
				}

	$('#total-' + data.getMesByIndice(Math.floor(dividas[0].mes))).text('Total: R$ ' + total  + ',00');
}

function linhaTabela(divida){
	var id = divida.id;
	var line = '<tr id="linha-'+id+'"><td id="descricao-'+id+'">'+ divida.descricao +'</td><td id="categoria-'+id+'">'+ divida.categoria +'</td><td id="valor-'+id+'">'+ divida.valor +'</td><td id="data-vencimento-'+id+'">'+ divida.vencimento +'</td><td class="text-right"><span class="text-success"></span><a id="pagar-'+id+'" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span></a><a id="editar-'+id+'" class="btn btn-default"><span class="glyphicon glyphicon-edit"></span></a><a id="excluir-'+id+'" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';

    return line;
}	

function itemCarrousel(dividas){
	var data = new Data();
	var mes = data.getMesByIndice(Math.floor(dividas[0].mes));
	return '<div class="item" ><h2 class="'+ mes +'">'+mes+'</h2><button class="btn btn-success btn-add" data-toggle="modal" data-target="#smallModal"><span class="glyphicon glyphicon-plus"></span> Despesa</button><div class="panel panel-default"><table class="table table-striped"><thead><tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Data de vencimento</th><th width="100px"></th></tr></thead><tbody id="body'+mes+'" class="tabela-'+mes+'">'+ this.linesItemCarrousel(dividas) +'</tbody></table></div><div id="dados"><h3 id="total-'+mes+'"></h3></div></div>';
}

function itemActive(dividas){
	var data = new Data();
	var mes = data.getMesByIndice(Math.floor(dividas[0].mes));
	return '<div class="item active" ><h2 class="'+ mes +'">'+mes+'</h2><button class="btn btn-success btn-add" data-toggle="modal" data-target="#smallModal"><span class="glyphicon glyphicon-plus"></span> Despesa</button><div class="panel panel-default"><table class="table table-striped"><thead><tr><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Data de vencimento</th><th width="100px"></th></tr></thead><tbody id="body-table-active" class="tabela-'+mes+'">'+ this.linesItemCarrousel(dividas) +'</tbody></table></div><div id="dados"><h3 id="total-'+mes+'"></h3></div></div>';
}

function linesItemCarrousel(dividas){
	var linesTable = new Array();
	for (i = 0; i < dividas.length; i++){
		var divida = dividas[i];
		var id = divida.id;
		var pago = divida.pago;
		var line = '<tr id="linha-'+id+'"><td id="descricao-'+id+'">'+ divida.descricao +'</td><td id="categoria-'+id+'">'+ divida.categoria +'</td><td id="valor-'+id+'">'+ divida.valor +'</td><td id="data-vencimento-'+id+'">'+ divida.vencimento +'</td><td class="text-right"><span class="text-success"></span><a id="pagar-'+id+'" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span></a><a  id="editar-'+id+'" class="btn btn-default"><span class="glyphicon glyphicon-edit"></span></a><a id="excluir-'+id+'" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></a></td></tr>';
		
		linesTable.push(line);
	}

	return linesTable;
}