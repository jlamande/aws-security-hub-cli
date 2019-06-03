# Aws Security Hub CLI

## Purpose

To provide a simple CLI to manage the [AWS Security Hub service](https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html).
Some commands are simple calls to the [Security Hub API](https://docs.aws.amazon.com/securityhub/1.0/APIReference/Welcome.html) using the [AWS.Security JS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecurityHub.html) and simplifying responses. Some others are more useful as the `add-to-hub` command, allowing to register an account as a member in the Security Hub of the Master Account.

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
AWS_PROFILE=master ./index.js add-to-hub -p <member> -e master@mail.com
```

Note: you can specifiy multiple profiles, replacing <member> by profile1,profile2

## Used Libraries

- Commander : <https://github.com/tj/commander.js/>
- AWS-SDK for JS : <https://github.com/aws/aws-sdk-js>
- chalk : <https://github.com/chalk/chalk>
