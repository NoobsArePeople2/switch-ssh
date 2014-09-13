# switch-ssh

Command line utility for switching SSH keys. Useful if you need to maintain multiple SSH keys on a single system.

## Installation

    $ npm install -g switch-ssh

## Usage

    $ switch-ssh -p your-profile

## Assumptions

`switch-ssh` assumes all your keys live in `~/.ssh` and are named in the format:

- __Private Key__: id_rsa{-profile}
- __Public Key__: id_rsa{-profile}.pub

For example:

- id_rsa-sean
- id_rsa-sean.pub

## License

switch-ssh is licensed under the MIT license.