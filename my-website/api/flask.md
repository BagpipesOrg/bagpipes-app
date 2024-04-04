# Api client example Python flask


> in this example we will create a simple python flask application to list open hrmp channels that are connected to a user defined parachain

### Requirements:   
-  Python 3  
-  requests and flask(`$ pip3 install flask requests`)


```shell
mkdir listchannels/
touch listchannels/app.py
```

Add the following to `app.py`:
```python
from flask import Flask
import requests 

app = Flask(__name__)

api_endpoint = "http://localhost:8080" # set the address of the api address 


# Lets make a class to talk with the api
class handle_chain():
	def __init__(self):
		self.api = api_endpoint

	# check open hrmp channels based on source paraid
	def check_openchannels(self, paraid):
		return requests.post(self.api+'/polkadot/openchannels', json={"paraid": paraid}).json()

	# interact with a premade scenario
	def call_scenario(self, scenarioid, calldata):
		return requests.post(self.api+'/call/scenario', json={"data":calldata}).text

# create the /hrmp/openchannels/chain page 
@app.route('/hrmp/openchannels/<chain>/', methods=['GET'])
def chain_channels(chain):
	# configure chain name and map it to paraid
	some_chains = {'acala': 2000, 'assethub':1000 , 'hydradx': 2034}
	# verify user input
	if not some_chains.keys().__contains__(chain.lower()):
		return flask.redirect('/', code=301)
	# create a string buffer we will use to write the html to
	output = ""
	channels = handle_chain().check_openchannels(some_chains.get(chain.lower()))
	for channel in channels.get('open_hrmp_channels', []):
		output += "<p>Chain: {}</p></br>".format(channel)
	# return our html string, if this is a production app we should configure a static template and render it with flask.render_template
	return '<html><body><center>{} is connected to chains: {}</body></html>'.format(chain.title(), output)


@app.route('/')
def hello():
    return 'Visit /hrmp/openchannels/assethub/'


if __name__ == "__main__":
	# configure runtime variables such as port and host
	app.run(host='0.0.0.0', port=8081)  

```

### Run it:  
```shell
$ python3 app.py
```

