# AWS EC2 Cloud Connection Steps

- - -

## Connecting to your Instance

1. Launch your Instance.

2. Click on the `Connect` Button at the top right once your Instance is in the Running state.

3. Copy link from the `SSH Client` Tab & copy into your favorite command line interface

## Initial Setup

1. Run the following commands for initial setup:

    - `sudo apt-get update`
    - `sudo apt update`
    - `sudo apt install net-tools` (useful for checking ports if troubleshooting is needed, etc)

2. Install Python 3.7 (to match our older version of python used in the PythonData kernel):

    - `sudo apt install software-properties common`
    - `sudo add-apt-respository ppa:deadsnakes/ppa`
    - hit `ENTER` when prompted
    - `sudo apt install python3.7`
    - check proper installation by running `python3.7 --version`

3. Create a virtual environment & activate it:

    - `sudo apt install python3.7-venv`
    - `python3.7 -m venv ~/env/venv`
    - `source ~/env/venv/bin/activate`
    - If you close the terminal and return to it later, you will need to re-run this last line again to re-activate your virtual environment each time.

4. Create a folder for our project & move into it:

    - `mkdir pokemon`
    - `cd pokemon`

5. `pip install` the required dependencies:

    - flask
    - pandas
    - sqlalchemy
    - scikit-learn
    - pathlib

6. Secure copy of relevant files from our local repo into the remote instance:

    - `scp -i <Filepath_to_KeyPair.pem> <Filepath_to_file_we_wish_to_copy> <EC2_instance_address>:~/pokemon`
    - These files include:

        - `app.py`
        - full static folder (use -r for folder copies)
        - full templates folder (use -r for folder copies)
        - from Resources folder:
            - `model.h5`
            - `X_scaler.h5`
            - `X_train_cols.h5`
            - `pokemon_with_tiers.sqlite`
            - `pokemon_with_tiers.json`

7. Can do a test run of `python3.7 app.py` here to verify you get the expected result in the terminal at this point, but will likely not see any result in a browser yet.  `Ctrl-C` to quit.

## WSGI - Web Server Gateway Interface Setup

1. `pip install gunicorn`

2. Test run `gunicorn -b 0.0.0.0:8000 app:app`

    - Should return without errors & show a pid # if working correctly
    - If not, `netstat -ltnup` command can be a useful tool here.
    - `Ctrl-C` to quit out, we will create a service to make gunicorn run automatically whenever ubuntu starts.

3. Create and activate service:

    - `sudo nano /etc/systemd/system/pokemon.service`
    - creates a new file, copy paste the following:

```
[Unit]
Description=Gunicorn instance for pokemon app
After=network.target
[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/pokemon
ExecStart=/home/ubuntu/env/venv/bin/gunicorn -b localhost:8000 app:app
Restart=always
[Install]
WantedBy=multi-user.target
```

- to save, Ctrl-O, Enter, Ctrl-X

  - `sudo systemctl daemon-reload`
  - `sudo systemctl start pokemon`
  - `sudo systemctl enable pokemon`
  - Can test by running `curl localhost:8000` - this should return the html but will likely still not show anything in browser just yet.

## Install and Connect Web Server

1. Initial setup:

    - `sudo apt-get install nginx`
    - `sudo systemctl start nginx`
    - `sudo systemctl enable nginx`
    - Can test by copying Public IPv4 DNS info from AWS EC2 Instance into a browser, should see an nginx informational page come up at this point.

2. Adjust configuration settings:

    - `sudo nano /etc/nginx/sites-available/default`
    - Opens an existing file, scroll down and add this line directly above the section labeled "server"

```
upstream flaskpokemon {
	server 127.0.0.1:8000;
}
```

then scroll further down to the section labeled "location".  Replace what is in the {} there with the following:

```
location / {
	proxy_pass http://flaskpokemon;
}
```

- to save, Ctrl-O, Enter, Ctrl-X

  - `sudo systemctl restart nginx`
  - Copying Public IPv4 DNS info into a browser should now bring up our fully functional website.
  - You can also run `sudo systemctl status pokemon` for some interesting status information.
