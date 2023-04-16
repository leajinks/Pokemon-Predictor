# Pokemon-Predictor

## Overview
In this project, Pokemon stats and battle outcome data were analyzed in a machine learning model to determine the likelihood of selected Pokemon winning battles.


## Contributors
[Becky Klosowski](https://github.com/andcetera)
[Christin Davis](https://github.com/christinamberdavis)
[Crystal Butler](https://github.com/cmbutler83)
[Danielle Anderson](https://github.com/dganderson94)
[Lea Jinks](https://github.com/leajinks)


## How to use the Pokemon Predictor
1. Run the data_prep.ipynb file. This will read the pokemon.csv and combats.csv, scrape Pokemon tier data from smogon.com, combine this data into one dataframe with one row per battle, then convert this into a sqlite file.
2. Run the ml_model.ipynb file. This will split the data from the sqlite file into training and test sets, assign targets and features, scale the data, create logistic regression models to calculate model accuracy, and serialize the model using Pickle so it can be run on a flask app.
3. Run app.py to open the flask app.
4. Select Pokemon in both dropdown menus, then click the Battle button. A "Winner!" label will appear next to the photo of the Pokemon predicted to win.

## Target and Features
Since the purpose of this model is to predict Pokemon success in battle, the target is the "Did_the_first_pokemon_win" column.

The features of this model include:
* Hit Points (HP)
* Attack Points
* Defense Points
* Special Attack Points
* Defense Points
* Speed Points
* Legendary Status
* Pokemon Type (Primary and Secondary)
* Pokemon Tier
* Pokemon Generation

Each Point stat is an integer that ranges from 0-255, depending on the stat and the pokemon. The Pokemon Type, Tier, and Generations are strings, with 18 possible primary and secondary types, 13 possible tiers, and 5 possible generations.

With two sets of stats per row, and each string value converted to an individual feature, our model in total includes 118 features.


## Model and Scoring
For our ML model, we used Random Forest, which combines multiple decision trees. By aggregating the predictions of many individual decision trees, it reduces overfitting and improves generalization performance.

The Random Forest model scored well with our dataset, with 93% accuracy and 93-94% precision. 

[insert photo here]

## Analysis



## Data Sources
Pokemon and Battle Data: [Tuan Nguyen Van Anh via Kaggle](
https://www.kaggle.com/datasets/tuannguyenvananh/pokemon-dataset-with-team-combat?select=pokemon.csv)

Pokemon Tiers: [Smogon](https://www.smogon.com/dex/xy/pokemon/)

Artwork: 
Gathered by [Rohan Asokan via Kaggle](https://www.kaggle.com/datasets/arenagrenade/the-complete-pokemon-images-data-set)
and supplemented with images from [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page)
