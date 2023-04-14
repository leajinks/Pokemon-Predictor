# Import dependencies
from flask import Flask, jsonify, render_template
import pickle
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Formatted column names
num = ['HP_First', 'Attack_First', 'Defense_First', 'Sp_Atk_First', 'Sp_Def_First', 'Speed_First', 'HP_Second', 'Attack_Second', 'Defense_Second', 'Sp_Atk_Second', 'Sp_Def_Second', 'Speed_Second']
dummied = ['Type_1_First_', 'Type_2_First_', 'Generation_First_', 'Legendary_First_', 'Tier_First_', 'Type_1_Second_', 'Type_2_Second_', 'Generation_Second_', 'Legendary_Second_', 'Tier_Second_']

stats = ['HP_', 'Attack_', 'Defense_', 'Sp_Atk_', 'Sp_Def_', 'Speed_']
which = ['First', 'Second']
dummy = ['Type_1_', 'Type_2_', 'Generation_', 'Legendary_', 'Tier_']



engine = create_engine("sqlite:///Resources/pokemon.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)

pokemon = Base.classes.pokemon

# Create app
app = Flask(__name__)

# Render webpage
@app.route('/')
def index():
    return render_template('index.html')

# Get predictions
@app.route('/predict')
def predict():
    
    # get or already have this info for each poke:
    # type1, type2 -> to dummies
    # HP, Attack, Defense, Sp Atk, Sp Def Speed, Generation - #s
    # Legendary(T/F), Tier -> to dummies
    #sel = ['Type_1_First', 'Type_2_First', 'HP_First', 'Attack_First', 'Defense_First', 'Sp_Atk_First', 'Sp_Def_First', 'Speed_First', 'Generation_First', 'Legendary_First', 'Tier_First']
    sel = []
    for s in stats:
        sel.append(s+which[0])
    for d in dummy:
        sel.append(d+which[0])
    testp1 = 'Bulbasaur'
    testp2 = 'Charmeleon'

    session = Session(engine)
    p1 = engine.execute(f'SELECT {sel[0]}, {sel[1]}, {sel[2]}, {sel[3]}, {sel[4]}, {sel[5]}, {sel[6]}, {sel[7]}, {sel[8]}, {sel[9]}, {sel[10]} FROM pokemon WHERE First_Name="{testp1}"').first()
    p2 = engine.execute(f'SELECT {sel[0]}, {sel[1]}, {sel[2]}, {sel[3]}, {sel[4]}, {sel[5]}, {sel[6]}, {sel[7]}, {sel[8]}, {sel[9]}, {sel[10]} FROM pokemon WHERE First_Name="{testp2}"').first()
    session.close()
    print(p1, p2)
    print(type(p1))
    # sample manual data
    poke2 = ['Water', 'Ground', [50, 48, 43, 46, 41, 60], 3, 0, 'LC']
    poke1 = ['Grass', 'Poison', [45, 49, 49, 65, 65, 45], 1, 0, 'LC']

    # Get original format of training columns
    with open('Resources/X_train_cols.h5', 'rb') as stuff:
        columns = pickle.load(stuff)
    cols = [i for i in columns[0]]
        
    # Create a dataframe with the numeric values & correct column names
    x1 = pd.DataFrame([poke1[2]+poke2[2]], columns=num)
   
    # Create a dataframe with the dummied categorical values & correct column names
    x2 = pd.DataFrame({
        dummied[0]+poke1[0]: 1,
        dummied[1]+poke1[1]: 1,
        dummied[2]+str(poke1[3]): 1,
        dummied[3]+str(poke1[4]): 1,
        dummied[4]+poke1[5]: 1,
        dummied[5]+poke2[0]: 1,
        dummied[6]+poke2[1]: 1,
        dummied[7]+str(poke2[3]): 1,
        dummied[8]+str(poke2[4]): 1,
        dummied[9]+poke2[5]: 1
    }, index=[0])

    # Join the two and fill the missing columns with zeros
    x = pd.concat([x1, x2], axis=1)
    x = x.reindex(columns=cols).fillna(0)
    
    # Use same scaler to convert values as original training dataset
    with open('Resources/X_scaler.h5', 'rb') as f:
        scaler = pickle.load(f)
    data = scaler.transform(x)

    # Load trained model to make the prediction
    with open('Resources/model.h5', 'rb') as file:
        model = pickle.load(file)
    predictions = model.predict(data)

    # Return results
    #return jsonify(str(predictions[0]))

    return x.to_json()

    # if predictions[0] == 1:
    #    return jsonify('Pokemon 1 Wins!')
    # else:
    #    return jsonify('Pokemon 2 Wins!')

# Run app
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