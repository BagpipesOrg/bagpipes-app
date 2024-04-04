# Deploy on Debian linux



## Requirements:  
 -  Node.js and npm   
 -  git   
 -  3 gigabyte or more free (harddrive)disk space   

#### Diskspace needed:  
Amount of disk space consumed after installing:  
```shell
$ user@debian:/tmp$ du -sh app-v0.0.1
1.5G    app-v0.0.1
```

#### Install npm on Debian:  
We recommend that you use a npm version that is later than 8.5, in order to get a later version on debian, add the nodejs package mirror and upgrade your local nodejs version:   
```shell
$ sudo apt-get update
$ sudo apt-get install -y ca-certificates curl gnupg
$ sudo mkdir -p /etc/apt/keyrings
$ curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
$ echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
$ sudo apt-get update  
$ sudo apt-get install nodejs -y  
```

### Step 1:

#### Clone repo: 
```shell
$ git clone https://github.com/XcmSend/app.git
```

#### Install with npm:  

```shell
$ cd app/ 
$ npm install -f 
$ npm run build 
```  
Note: Make sure you run a version of nodejs that is more later than 8,5.


### Step 2:  

#### Run the local instance   
```shell  
$ npm run dev

> @bagpipes/xcm-send@0.0.3 dev
> yarn build:tailwind && vite

yarn run v1.22.19
$ npx tailwindcss -c ./tailwind.config.js -i ./src/index.css -o dist/output.css
  VITE v4.4.9  ready in 9429 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
 
```

Paste 'http://localhost:5173/' into your browser and your ready to use bagpipes.  


### Step 3(optimal):

In step 2 you learned how to run a local instance of XCMSend. If you want people to be able to access it publicly we need to forward incoming connections to our XCMSend instance that is located at: 127.0.0.1:5173.  


#### Run a public instance   
A popular way to deploy XCMSend would be to let the Nginx webserver reverseproxy the connections to the local instance.  


#### Install nginx    
```shell  
apt install nginx
```

#### Enable nginx to auto start   
```shell  
$ systemctl enable nginx
```

#### Set configuration file `/etc/nginx/sites-available/nginx.conf`:   


```nginx
server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /usr/src/app/app-v0.0.1/static/;
    }

    location /media/ {
        alias /usr/src/app/app-v0.0.1/media/;
    }

}
```


#### Restart nginx: 
```shell
$ systemctl restart nginx
```

