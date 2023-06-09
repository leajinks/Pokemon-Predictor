# Import dependencies
from flask import Flask, jsonify, render_template
import pickle
import pandas as pd
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.sql import column

# Formatted column names
stats = ['HP', 'Attack', 'Defense', 'Sp_Atk', 'Sp_Def', 'Speed']
dummy = ['Type_1', 'Type_2', 'Tier', 'Generation', 'Legendary']
which = ['First', 'Second']

numeric_cols = []
for w in which:    
    for s in stats:
        numeric_cols.append(s + '_' + w)

# SQLAlchemy setup
engine = create_engine("sqlite:///Resources/pokemon_with_tiers.sqlite")
Base = automap_base()
Base.prepare(engine, reflect=True)

pokemon = Base.classes.poketiers

# Create app
app = Flask(__name__)

# Render webpage
@app.route('/')
def index():
    return render_template('index.html')

# Get predictions
@app.route('/predict/<poke1>/<poke2>')
def predict(poke1, poke2):

    # Create list of the columns we want to query
    sel = []
    for s in stats:
        sel.append(column(s))
    for d in dummy:
        sel.append(column(d))
    
    # Get stats for each pokemon
    session = Session(engine)
    p1 = session.query(*sel).filter(pokemon.Name==poke1).first()
    p2 = session.query(*sel).filter(pokemon.Name==poke2).first()
    session.close()

    # Get original format of training columns
    with open('Resources/X_train_cols.h5', 'rb') as file1:
        columns = pickle.load(file1)
    cols = [i for i in columns[0]]
        
    # Create a dataframe with the numeric values & correct column names
    numeric = pd.DataFrame([p1[:6]+p2[:6]], columns=numeric_cols)

    # Check if our values exist or have been dropped from dummied columns for each pokemon
    p1_cols = []
    for a in range(len(p1[6:])):
        if dummy[a] + '_' + which[0] + '_' + str(p1[6:][a]) in cols:
            p1_cols.append(dummy[a] + '_' + which[0] + '_' + str(p1[6:][a]))
    
    p2_cols = []
    for b in range(len(p2[6:])):
        if dummy[b] + '_' + which[1] + '_' + str(p2[6:][b]) in cols:
            p2_cols.append(dummy[b] + '_' + which[1] + '_' + str(p2[6:][b]))

    # Combine the column names for both pokemon
    clms = p1_cols + p2_cols

    # Create a dataframe with the dummied categorical values & correct column names
    categorical = pd.DataFrame(columns=clms, index=[0]).fillna(1)

    # Join the two and fill the missing columns with zeros
    full_stats = pd.concat([numeric, categorical], axis=1)
    full_stats = full_stats.reindex(columns=cols).fillna(0)
    
    # Use same scaler to convert values as original training dataset
    with open('Resources/X_scaler.h5', 'rb') as file2:
        scaler = pickle.load(file2)
    data = scaler.transform(full_stats)

    # Load trained model to make the prediction
    with open('Resources/model.h5', 'rb') as file3:
        model = pickle.load(file3)
    predictions = model.predict(data)

    # Return results
    return jsonify(str(predictions[0]))

# Run app
if __name__ == "__main__":
    app.run(port=8000, debug=True)
