from flask import Flask, jsonify, render_template
import pickle

app = Flask(__name__)

@app.route('/')
def index():
    with open('Resources/X_train_cols.h5', 'rb') as stuff:
        columns = pickle.load(stuff)
        cols = [i for i in columns[0]]
    return jsonify(cols)
    #return render_template('index.html')

@app.route('/predict/<poke1>/<poke2>')
def predict(poke1, poke2):

    # get or already have this info for each poke:
    # type1, type2 -> to dummies
    # HP, Attack, Defense, Sp Atk, Sp Def Speed, Generation - #s
    # Legendary(T/F), Tier -> to dummies

    with open('Resources/X_train_cols.h5', 'rb') as stuff:
        columns = pickle.load(stuff)
        cols = [i for i in columns[0]]
        dummied = ['Type_1_First_', 'Type_2_First_', 'Generation_First_', 'Legendary_First_', 'Tier_First_', 'Type_1_Second_', 'Type_2_Second_', 'Generation_Second_', 'Tier_Second_']

    # iterate through columns to check if our values match the dummies
    for c in cols:
       for d in dummied:
           if c.startswith(d):
               #clm = c.replace(d, '')
               idk = 'hi'



    # concat both into one long array
    x = poke1 + poke2 #...?

    # Use same scaler to convert values as original training dataset
    with open('Resources/X_scaler.h5', 'rb') as f:
        scaler = pickle.load(f)
    data = scaler.transform(x)

    # Load trained model to make the prediction
    with open('Resources/model.h5', 'rb') as file:
        model = pickle.load(file)
    predictions = model.predict([data])

    # format for front end display as needed here
    return jsonify(str(predictions[0]))

    # if predictions[0] == 1:
    #    return jsonify('Pokemon 1 Wins!')
    # else:
    #    return jsonify('Pokemon 2 Wins!')

if __name__ == "__main__":
    app.run(port=8000, debug=True)


"""
 ['HP_First',
 'Attack_First',
 'Defense_First',
 'Sp_Atk_First',
 'Sp_Def_First',
 'Speed_First',
 'HP_Second',
 'Attack_Second',
 'Defense_Second',
 'Sp_Atk_Second',
 'Sp_Def_Second',
 'Speed_Second',
 'Did_the_first_pokemon_win', <- NOPE
 'Type_1_First_Dark',
 'Type_1_First_Dragon',
 'Type_1_First_Electric',
 'Type_1_First_Fairy',
 'Type_1_First_Fighting',
 'Type_1_First_Fire',
 'Type_1_First_Flying',
 'Type_1_First_Ghost',
 'Type_1_First_Grass',
 'Type_1_First_Ground',
 'Type_1_First_Ice',
 'Type_1_First_Normal',
 'Type_1_First_Poison',
 'Type_1_First_Psychic',
 'Type_1_First_Rock',
 'Type_1_First_Steel',
 'Type_1_First_Water',
 'Type_2_First_Dark',
 'Type_2_First_Dragon',
 'Type_2_First_Electric',
 'Type_2_First_Fairy',
 'Type_2_First_Fighting',
 'Type_2_First_Fire',
 'Type_2_First_Flying',
 'Type_2_First_Ghost',
 'Type_2_First_Grass',
 'Type_2_First_Ground',
 'Type_2_First_Ice',
 'Type_2_First_Normal',
 'Type_2_First_Poison',
 'Type_2_First_Psychic',
 'Type_2_First_Rock',
 'Type_2_First_Steel',
 'Type_2_First_Water',
 'Generation_First_2',
 'Generation_First_3',
 'Generation_First_4',
 'Generation_First_5',
 'Generation_First_6',
 'Legendary_First_1',
 'Tier_First_LC',
 'Tier_First_NFE',
 'Tier_First_NU',
 'Tier_First_NUBL',
 'Tier_First_OU',
 'Tier_First_PU',
 'Tier_First_PUBL',
 'Tier_First_RU',
 'Tier_First_RUBL',
 'Tier_First_UU',
 'Tier_First_UUBL',
 'Tier_First_Uber',
 'Tier_First_Untiered',
 'Type_1_Second_Dark',
 'Type_1_Second_Dragon',
 'Type_1_Second_Electric',
 'Type_1_Second_Fairy',
 'Type_1_Second_Fighting',
 'Type_1_Second_Fire',
 'Type_1_Second_Flying',
 'Type_1_Second_Ghost',
 'Type_1_Second_Grass',
 'Type_1_Second_Ground',
 'Type_1_Second_Ice',
 'Type_1_Second_Normal',
 'Type_1_Second_Poison',
 'Type_1_Second_Psychic',
 'Type_1_Second_Rock',
 'Type_1_Second_Steel',
 'Type_1_Second_Water',
 'Type_2_Second_Dark',
 'Type_2_Second_Dragon',
 'Type_2_Second_Electric',
 'Type_2_Second_Fairy',
 'Type_2_Second_Fighting',
 'Type_2_Second_Fire',
 'Type_2_Second_Flying',
 'Type_2_Second_Ghost',
 'Type_2_Second_Grass',
 'Type_2_Second_Ground',
 'Type_2_Second_Ice',
 'Type_2_Second_Normal',
 'Type_2_Second_Poison',
 'Type_2_Second_Psychic',
 'Type_2_Second_Rock',
 'Type_2_Second_Steel',
 'Type_2_Second_Water',
 'Generation_Second_2',
 'Generation_Second_3',
 'Generation_Second_4',
 'Generation_Second_5',
 'Generation_Second_6',
 'Legendary_Second_1',
 'Tier_Second_LC',
 'Tier_Second_NFE',
 'Tier_Second_NU',
 'Tier_Second_NUBL',
 'Tier_Second_OU',
 'Tier_Second_PU',
 'Tier_Second_PUBL',
 'Tier_Second_RU',
 'Tier_Second_RUBL',
 'Tier_Second_UU',
 'Tier_Second_UUBL',
 'Tier_Second_Uber',
 'Tier_Second_Untiered']
"""