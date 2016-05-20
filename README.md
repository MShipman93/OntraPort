# OntraPort
---
This is a package is an API wrapper for OntraPort to make implementing OntraPort into Node much easier. This package is not made offically by OntraPort so any issues with their API is to be communicated with them directly.

## Getting Started
---
To get started you must install the package from npm

### Installation
Install ontraport npm package
```
npm install ontraport
```

### Use inside Node
First thing first is requiring the package.
```
var OntraPort = require('ontraport');
```

Now that you have required ontraport you need to make an instance and pass a config object which contains appid and key.
```
var config = {
    appid: '12345',
    key: '54321'
};

var ontraPortController = new OntraPort(config);
```

Alternative you can combine requiring and constructing into one call.
```
var config = {
    appid: '12345',
    key: '54321'
};

var ontraPortController = new (require('ontraport'))(config);
```

Now lets do a simple add tag call to a contact.
```
ontraPortController.addJsonTag('12345', 'Admin', function(err, res) {
    if(err) {
        console.error(err);
        return;
    }
    
    console.log(res);
});
```

## Notes
---
This package does not have a JSON equivalent for all functions. There is comments above all functions explaining params and giving examples.