from flask import Flask, jsonify, render_template
import pickle

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict/<poke1>/<poke2>')
def predict(poke1, poke2):
    #items = vals.split(',')
    #vals = [int(i) for i in items]

    # get or already have this info:
    # type1, type2 - dummies
    # HP, Attack, Defense, Sp Atk, Sp Def Speed, Generation - #s
    # Legendary(T/F), Tier - dummies

    # import sklearn package to do same transformations...convert dummies

    # concat both into one long array
    x = poke1 + poke2 #...?

    # Use same scaler to convert values as original training dataset
    with open('output/scaler.h5', 'rb') as f:
        scaler = pickle.load(f)
    data = scaler.transform(x)

    # Load trained model to make the prediction
    with open('output/model.h5', 'rb') as file:
        model = pickle.load(file)
    predictions = model.predict([data])

    # format for front end display as needed here
    if predictions[0] == 1:
        return jsonify('Pokemon 1 Wins!')
    else:
        return jsonify('Pokemon 2 Wins!')

if __name__ == "__main__":
    app.run(port=8000, debug=True)