function buttonPressed(poke1, poke2){
    //poke1 = poke1['type_1_first', 'type_2_first', 'HP_first', ...etc]
    //poke2 = poke2['type_1_second', 'type_2_second', 'HP_second', ...etc]

    // poke1 = ['Water', 'Ground', [50, 48, 43, 46, 41, 60], 3, 0, 'LC']
    // poke2 = ['Grass', 'Poison', [45, 49, 49, 65, 65, 45], 1, 0, 'LC']
    
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