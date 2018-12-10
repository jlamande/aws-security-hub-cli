# Aws Security Hub multi account Scripts

## Prereqs

- node
- npm or yarn

Note : the AWS_PROFILE environment variable (or by defaults the 'default' profile) is used to resolve the master account. So ensure that your AWS environment is well configured.

## Installation

```
yarn
```
or
```
npm install
```

## Usage

Use the CLI for help and view the available commands :
```
./index.js --help
```
then for a command :
```
./index.js <command> --help
```

Note : the AWS_PROFILE environment variable (or by defaults the 'default' profile) is used to resolve the master account. So ensure that your AWS environment is well configured.

## Used Libraries

- Commander : <https://github.com/tj/commander.js/>
- AWS-SDK for JS : <https://github.com/aws/aws-sdk-js>
- chalk : <https://github.com/chalk/chalk>
