function buttonPressed(poke1, poke2){

    let url = `/predict/${poke1}/${poke2}`

    fetch(url).then(response => response.json()).then(
        json => {
            if(json[0] == 1){
                document.getElementById('poke1')
                //etc, do something or call some function to highlight winner here
            } else {
                document.getElementById('poke2')
                //etc, do something or call some function to highlight winner here
            }
            
        }
    )
}