#!/usr/bin/env node
const SecurityHub = require("./hub");
const chalk = require("chalk");

const program = require("commander");
program.version("0.0.1").description("Security Hub Management CLI");
program
  .command("add-to-hub")
  .alias("a")
  .description("Add an account to the hub")
  .option(
    "-p, --profiles [profiles]",
    "Which AWS profile to use to configure the member accounts. Defaults to 'default'",
    "default"
  )
  // assume role not supported yet (use profile for now)
  // .option("-r, --role [role]", "Which role to assume to configure the member account.")
  .option(
    "-e, --emailAddress <email-address>",
    "Which email address must be used in the Hub invitation"
  )
  .action(function(options) {
    const profiles = options.profiles.split(",");
    const masterHub = new SecurityHub(process.env.AWS_PROFILE || "default");
    profiles
      .map(profile => {
        return {
          profile,
          masterHub,
          emailAddess: options.emailAddress
        };
      })
      .map(handle);
  });
program.command("list-members").action(function(fakeArg, options) {
  const masterHub = new SecurityHub(process.env.AWS_PROFILE || "default");
  masterHub.listMembers().then(members => {
    console.log(members);
  });
});
program.command("list-invitations").action(function(fakeArg, options) {
  const masterHub = new SecurityHub(process.env.AWS_PROFILE || "default");
  masterHub.listInvitations().then(invitations => {
    console.log(invitations);
  });
});
program.parse(process.argv);

async function handle({ profile, masterHub, emailAddress }) {
  console.log(emailAddress);
  const memberHub = new SecurityHub(profile);
  // ensure security hub is activated on master account
  return masterHub
    .enable()
    .then(() => {
      // ensure security hub is activated on member account
      return memberHub.enable();
    })
    .then(() => {
      return masterHub.invite(memberHub.accountId, emailAddress);
    })
    .then(() => {
      return memberHub.acceptInvitation(masterHub.accountId);
    })
    .catch(err => {
      console.log(chalk.red(err.stack));
      process.exitCode = 1;
    });
}