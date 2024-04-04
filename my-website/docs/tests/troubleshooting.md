# Troubleshooting

>  Best pratices for troubleshooting and debugging Bagpipes.  


## Reset:  
In order to quickly reset, we recommend that you clear your browser cookies for Bagpipes site and reload the site.  


## Rebuild:   
```
rm -rf node_modules/ && npm run build -f 
```

### Linux:

##### file watcher limit:  
If you get the following error:  
```
Error: ENOSPC: System limit for number of file watchers reached, watch ''
at FSWatcher. (node:internal/fs/watchers:244:19)
at Object.watch (node:fs:2264:34)
```
This means that you need to increase your linux file watcher limit size. Do this by increasing the number in the file: `/proc/sys/fs/inotify/max_user_watches`.  



#### Ask for support:   
[Open a github issue](https://github.com/XcmSend/app/issues/new)

