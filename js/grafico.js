$(function () {
    var divida = new Divida();
    var data = new Data();
    var mesAtual = data.getNumberMonth(data.getMes());
    var mesesCarrousel = new Array();
    var posicao = 0;

    var meses = divida.distinctMonth(function(meses){
        for(i = 0; i < meses.length; i++){
            if(parseInt(meses[i],10) == mesAtual)
                posicao = i;

            mesesCarrousel.push(parseInt(meses[i], 10));
        }
    });

    preparaGrafico(mesAtual);

     $('#carousel-example-generic').bind('slide.bs.carousel', function (e) {
        if(e.direction == "left"){
            posicao++;
        }
        else if(e.direction == "right"){
            posicao--;
        }

        if(posicao > mesesCarrousel.length -1)
            posicao = 0;
        else if(posicao < 0)
            posicao = mesesCarrousel.length - 1

        var mesSelecionado = mesesCarrousel[posicao];
        preparaGrafico(mesSelecionado);
    });
});

function preparaGrafico(mesAtual){
    var divida = new Divida();
    var data = new Data();

    divida.dadosGrafico(function(dados){
        var valores = new Array();

        for (i = 0; i < dados.length; i++){
            var object = new Object();
            object.name = dados[i].categoria;
            object.y = dados[i].valor;

            var array = [object.name, object.y];
            valores.push(array);
        }
        constroiGrafico(valores, data.getMesByIndice(mesAtual)); 
    }, mesAtual);
}

function constroiGrafico(data, mes){
        chart = new Highcharts.Chart({
            colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
             '#FF9655', '#FFF263', '#6AF9C4','#73D8D1','#FF6C60','#EDD655','#AC92EC',
             '#E8E8E9','#5F8B95','#B4DB81','#9687A2','#c42525','#C6A955'],
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,  
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: mes
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    },
                    showInLegend: true
                }
            },
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data
            }]
        }); 
}