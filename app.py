# Import dependencies
from flask import Flask, jsonify, render_template
import pickle
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.sql import column

# Formatted column names
stats = ['HP_', 'Attack_', 'Defense_', 'Sp_Atk_', 'Sp_Def_', 'Speed_']
which = ['First', 'Second']
dummy = ['Type_1_', 'Type_2_', 'Tier_', 'Generation_', 'Legendary_']

# for new sqlite including ALL pokemon file... (remove the "new")
new_stats = ['HP', 'Attack', 'Defense', 'Sp_Atk', 'Sp_Def', 'Speed']
new_dummy = ['Type_1', 'Type_2', 'Tier', 'Generation', 'Legendary']

num = []
for w in which:    
    for s in new_stats:
        num.append(s + '_' + w)

# SQLAlchemy setup
engine = create_engine("sqlite:///Resources/pokemon.sqlite")
# engine = create_engine("sqlite:///Resources/pokemon_with_tiers.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)

pokemon = Base.classes.pokemon
#pokemon = Base.classes.pokemon_with_tiers???

# Create app
app = Flask(__name__)

# Render webpage
@app.route('/')
def index():
    return render_template('index.html')

# Get predictions
@app.route('/predict/<poke1>/<poke2>')
def predict(poke1, poke2):

    # Test pokemon to run
    #poke2 = 'Mothim'
    #poke1 = 'Pikachu'
    
    # Create list of the columns we want to query
    sel = []
    for s in stats:
        sel.append(column(s+which[0]))
        # sel.append(column(s))
    for d in dummy:
        sel.append(column(d+which[0]))
        #sel.append(column(s))
    
    # Get stats for each pokemon
    session = Session(engine)
    #p1 = engine.execute(f'SELECT {sel[0]}, {sel[1]}, {sel[2]}, {sel[3]}, {sel[4]}, {sel[5]}, {sel[6]}, {sel[7]}, {sel[8]}, {sel[9]}, {sel[10]} FROM pokemon WHERE First_Name="{poke1}"').first()
    #p2 = engine.execute(f'SELECT {sel[0]}, {sel[1]}, {sel[2]}, {sel[3]}, {sel[4]}, {sel[5]}, {sel[6]}, {sel[7]}, {sel[8]}, {sel[9]}, {sel[10]} FROM pokemon WHERE First_Name="{poke2}"').first()
    
    p1 = session.query(*sel).filter(pokemon.First_Name==poke1).first()
    p2 = session.query(*sel).filter(pokemon.First_Name==poke2).first()
    #p1 = session.query(*sel).filter(pokemon.Name==poke1).first()
    #p2 = session.query(*sel).filter(pokemon.Name==poke2).first()

    session.close()

    # Get original format of training columns
    with open('Resources/X_train_cols.h5', 'rb') as stuff:
        columns = pickle.load(stuff)
    cols = [i for i in columns[0]]
        
    # Create a dataframe with the numeric values & correct column names
    x1 = pd.DataFrame([p1[:6]+p2[:6]], columns=num)

    # Check if our values exist or have been dropped from dummied columns
    p1_cols = []
    for a in range(len(p1[6:])):
        if dummy[a]+which[0]+'_'+str(p1[6:][a]) in cols:
            p1_cols.append(dummy[a]+which[0]+'_'+str(p1[6:][a]))

    # p1_cols = []
    # for a in range(len(p1[6:])):
    #     if dummy[a] + '_' + which[0] + '_' + str(p1[6:][a]) in cols:
    #         p1_cols.append(dummy[a] + '_' + which[0] + '_' + str(p1[6:][a]))
        
    p2_cols = []
    for b in range(len(p2[6:])):
        if dummy[b]+which[1]+'_'+str(p2[6:][b]) in cols:
            p2_cols.append(dummy[b]+which[1]+'_'+str(p2[6:][b]))
    
    # p2_cols = []
    # for b in range(len(p2[6:])):
    #     if dummy[b] + '_' + which[1] + '_' + str(p2[6:][b]) in cols:
    #         p2_cols.append(dummy[b] + '_' + which[1] + '_' + str(p2[6:][b]))

    clms = p1_cols + p2_cols

    # Create a dataframe with the dummied categorical values & correct column names
    x2 = pd.DataFrame(columns=clms, index=[0]).fillna(1)
    print(x2)

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
    return jsonify(str(predictions[0]))
    #return x.to_json()

# Run app
if __name__ == "__main__":
    app.run(port=8000, debug=True)
