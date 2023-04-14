function buttonPressed(poke1, poke2){
    //FYI: poke1 = string name of left side dropdown pokemon name
    //FYI: poke2 = string name of right side dropdown pokemon name
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