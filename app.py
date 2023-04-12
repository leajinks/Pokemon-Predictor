from flask import Flask, jsonify, render_template
import pickle
from ml_model import X_scaler

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict/<vals>')
def predict(vals):
    items = vals.split(',')
    vals = [int(i) for i in items]
    # conversion code here as needed

    with open('output/model.h5', 'rb') as file:
        model = pickle.load(file)
    predictions = model.predict([vals])

    # format for front end display as needed here
    if predictions[0] == 1:
        return jsonify('Pokemon 1 Wins!')
    else:
        return jsonify('Pokemon 2 Wins!')

if __name__ == "__main__":
    app.run(port=8000, debug=True)