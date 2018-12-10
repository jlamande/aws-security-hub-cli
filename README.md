# Aws Security Hub multi account Scripts

## Purpose

To provide a simple CLI to manage the AWS Security Hub service.
Some commands are simple calls to the [Security Hub API](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html). And some are more useful as the add-to-hub, allowing to register an account as a member in the Security Hub of the Master Account.

## Prereqs

- node
- npm or yarn

Note : the AWS_PROFILE environment variable (or by defaults the 'default' profile) is used to execute commands. So ensure that your AWS environment is well configured.

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

### Sample commands

Register the account "member" (referenced by the profile 'member' in your `~/.aws/credentials` file) in the master account (referenced by the profile 'master').

```
AWS_PROFILE=master ./index.js add-to-hub -p member -e master@mail.com
```

## Used Libraries

- Commander : <https://github.com/tj/commander.js/>
- AWS-SDK for JS : <https://github.com/aws/aws-sdk-js>
- chalk : <https://github.com/chalk/chalk>
