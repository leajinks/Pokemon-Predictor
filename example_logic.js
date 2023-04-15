function buttonPressed(){
    poke1 = dropdownOne.value()
    poke2 = dropdownTwo.value()
    let url = `/predict/${poke1}/${poke2}`

    fetch(url).then(response => response.json()).then(
        json => {
            if(json[0] == 1){
                document.getElementById('#pkmn1')
                //etc, do something or call some function to highlight winner here
            } else {
                document.getElementById('#pkmn2')
                //etc, do something or call some function to highlight winner here
            }
        }
    )
}