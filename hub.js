#!/usr/bin/env node
const AWS = require("aws-sdk");
const REGION = process.env.AWS_REGION || "eu-west-1";
const chalk = require("chalk");

class SecurityHub {
  constructor(profile) {
    this.profile = profile;
    var credentials = new AWS.SharedIniFileCredentials({
      profile: this.profile
    });
    // AWS.config.credentials = credentials;
    this.hub = new AWS.SecurityHub({ region: REGION, credentials });
    const sts = new AWS.STS({ region: REGION, credentials });
    sts
      .getCallerIdentity()
      .promise()
      .then(infos => {
        this.accountId = infos.Account;
        // console.log(this.accountId);
      })
      .catch(err => {
        this.warn("Error while loading account informations");
        this.warn(err.stack);
        // throw err;
      });
  }

  warn(message, ...args) {
    console.log(chalk.yellow(`[${this.profile}] ${message}`, ...args));
  }

  error(message, ...args) {
    console.log(chalk.red(`[${this.profile}] ${message}`, ...args));
  }

  log(message, ...args) {
    console.log(`[${this.profile}] ${message}`, ...args);
  }

  async enable() {
    this.log(`Enable Hub`);
    const log = this.log;
    return this.hub
      .enableSecurityHub()
      .promise()
      .then(
        function() {
          this.log("hub enabled");
        }.bind(this)
      );
  }

  async invite(accountId, email) {
    this.log("Invite %s from %s", accountId, this.accountId);
    const members = [
      {
        AccountId: accountId,
        Email: email
      }
    ];
    this.log(`Members : ${JSON.stringify(members)}`);
    return this.hub
      .createMembers({ AccountDetails: members })
      .promise()
      .then(
        function() {
          return this.hub.inviteMembers({ AccountIds: [accountId] }).promise();
        }.bind(this)
      )
      .then(
        function() {
          this.log(`${accountId} Invited`);
        }.bind(this)
      );
  }

  async acceptInvitation(masterAccountId) {
    const invitations = (await this.hub.listInvitations().promise())
      .Invitations;
    this.log(
      "[%s] Search Invitation from %s ",
      this.accountId,
      masterAccountId
    );
    const invitation = invitations
      .filter(
        invitation =>
          invitation.AccountId == masterAccountId &&
          invitation.MemberStatus == "Invited"
      )
      .sort((a, b) => {
        return new Date(b.InvitedAt) - new Date(a.InvitedAt);
      })[0];

    if (invitation) {
      this.log(
        "[%s] Accept Invitation from %s ",
        invitation.AccountId,
        masterAccountId
      );
      if (invitation.MemberStatus == "Invited") {
        return await this.hub
          .acceptInvitation({
            InvitationId: invitation.InvitationId,
            MasterId: masterAccountId
          })
          .promise();
      }
    } else {
      this.log("No invitation to accept from %s found.", masterAccountId);
    }
  }

  async listMembers() {
    return this.hub.listMembers().promise().then(members => {
      return members.Members.map(member=> {
        return {
          AccountId: member.AccountId,
          MemberStatus: member.MemberStatus,
          UpdatedAt: member.UpdatedAt
      }})
    });
  }

  async listInvitations() {
    return this.hub.listInvitations().promise().then(invitations => {
      return invitations.Invitations;
    });
  }

  async enableCisAws() {
    return this.hub.batchEnableStandards({
      StandardsSubscriptionRequests: [{
        StandardsArn: 'arn:aws:securityhub:::ruleset/cis-aws-foundations-benchmark/v/1.2.0'
      }]
    }).promise();
  }

  // async listStandards() {
  //   const standards = await this.hub.getEnabledStandards().promise();
  //   if (standards && standards.StandardsSubscriptions) {
  //     standards.StandardsSubscriptions.forEach(element => {
  //       this.log(element);
  //     });
  //   }
  // }
}

module.exports = SecurityHub;
