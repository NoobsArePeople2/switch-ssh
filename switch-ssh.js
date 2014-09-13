#!/usr/bin/env node

var argv  = require('yargs').argv;
var chalk = require('chalk');
var fs    = require('fs');
var path  = require('path');
var exec  = require('child_process').exec;

var error = chalk.bold.red;

var SSH_PRIVATE_KEY = getSshFolder() + 'id_rsa';
var SSH_PUBLIC_KEY  = getSshFolder() + 'id_rsa.pub';

///////////////////////////////////////////////////////////
function log(msg) {
  console.log(msg);
}


///////////////////////////////////////////////////////////
function err(msg) {
  log(error(msg));
}


///////////////////////////////////////////////////////////
function getHomeFolder() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}


///////////////////////////////////////////////////////////
function getSshFolder() {
  return getHomeFolder() + path.sep + '.ssh/';
}


///////////////////////////////////////////////////////////
function keyExists(key) {
  return fs.existsSync(key);
}


///////////////////////////////////////////////////////////
function cp(from, to) {
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
}


///////////////////////////////////////////////////////////
function backup() {
  var p = getSshFolder() + 'id_rsa';
  cp(p, p + '-bk');

  p = getSshFolder() + 'id_rsa.pub';
  cp(p, p + '-bk');
}


///////////////////////////////////////////////////////////
function switchKeys(privateKey, publicKey) {
  cp(privateKey, SSH_PRIVATE_KEY);
  cp(publicKey, SSH_PUBLIC_KEY);
}


///////////////////////////////////////////////////////////
function stopSsh() {
  exec('killall ssh-agent', function(error, stdout, stderr) {
    if (error) {
      err(error);
      return
    }
  });
}


///////////////////////////////////////////////////////////
function startSsh() {
  exec('eval `ssh-agent`', function(error, stdout, stderr) {
    if (error) {
      err(error);
      return
    }
  });
}


///////////////////////////////////////////////////////////
function main() {

  var profile = argv.p;
  if (!profile) {
    err('You must specify a profile to change to with the "p" option.');
    return;
  }

  var privateKey = getSshFolder() + 'id_rsa-' + profile;
  var publicKey  = getSshFolder() + 'id_rsa-' + profile + '.pub';

  if (!keyExists(privateKey)) {
    err('Private key "' + privateKey + '" could not be found.');
    return;
  }

  if (!keyExists(publicKey)) {
    err('Public key "' + publicKey + '" could not be found.');
    return;
  }

  backup();

  stopSsh();
  switchKeys(privateKey, publicKey);
  startSsh();

}

module.exports.main = main;

