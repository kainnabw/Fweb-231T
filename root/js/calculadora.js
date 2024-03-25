function insert(num) {
    visor.innerHTML += num;
}

function clean() {
    visor.innerHTML = "";
}

function back() {
    var visorConteudo = visor.innerHTML;
    visor.innerHTML = visorConteudo.substring(0, visorConteudo.length - 1);
}
function calcular()
{
    var visor = document.getElementById('visor').innerHTML;
    if(visor)
    {
        document.getElementById('visor').innerHTML = eval(visor);
    }
    else
    {
        document.getElementById('visor').innerHTML = "inválido"
    }
}