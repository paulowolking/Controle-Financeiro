function Data(){

    function Data(){

    }

    Hoje = new Date();
    Data = Hoje.getDate();
    Dia = Hoje.getDay();
    Mes = Hoje.getMonth();
    Ano = Hoje.getFullYear();
    
    if(Data < 10) {
        Data = "0" + Data;
    }
    NomeDia = new Array(7)
    NomeDia[0] = "domingo"
    NomeDia[1] = "segunda-feira"
    NomeDia[2] = "terça-feira"
    NomeDia[3] = "quarta-feira"
    NomeDia[4] = "quinta-feira"
    NomeDia[5] = "sexta-feira"
    NomeDia[6] = "sábado"

    NomeMes = new Array(12)
    NomeMes[0] = "Janeiro"
    NomeMes[1] = "Fevereiro"
    NomeMes[2] = "Março"
    NomeMes[3] = "Abril"
    NomeMes[4] = "Maio"
    NomeMes[5] = "Junho"
    NomeMes[6] = "Julho"
    NomeMes[7] = "Agosto"
    NomeMes[8] = "Setembro"
    NomeMes[9] = "Outubro"
    NomeMes[10] = "Novembro"
    NomeMes[11] = "Dezembro"

    this.getData = function(){
        return Data + "de " +  NomeMes[Mes] + " de " + Ano; 
    }

    this.getMes = function(){
        return NomeMes[Mes];
    }

    this.getMesByIndice = function(indice){
        return NomeMes[indice];
    }

    this.getDateFormat = function(){
        return pad(Dia) + '/' + pad(Mes + 1) + '/' + Ano;
    }

    this.getNumberMonth = function(mes){
        switch(mes){
            case "Janeiro":
                return 0;
            case "Fevereiro":
                return 1;
            case "Março":
                return 2;
            case "Abril":
                return 3;
            case "Maio":
                return 4;
            case "Junho":
                return 5;
            case "Julho":
                return 6;
            case "Agosto":
                return 7;
            case "Setembro":
                return 8;
            case "Outubro":
                return 9;
            case "Novembro":
                return 10;
            case "Dezembro":
                return 11;

        }
    }

    function pad(s) { return (s < 10) ? '0' + s : s; }
    
    //document.write("São Paulo, "+ Data + " de " + NomeMes[Mes] + " de " + Ano);
}