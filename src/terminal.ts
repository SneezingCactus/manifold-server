import { createInterface, Interface } from 'node:readline';
import ManifoldServer from './server';
import * as OUT from './outPacketIds';
import fs from 'fs';
import columnify from 'columnify';
import { Config } from './types';

interface TerminalCommand {
  usage: string;
  description: string;
  callback: (cmd: string[], server: ManifoldServer) => void;
}

const availableCommands: Record<string, TerminalCommand> = {
  host: {
    usage: 'host [username or id]',
    description: 'Give host privileges to someone in the room.',
    callback: function (cmd, server) {
      let id = -1;

      if (!/[^0-9]+/.test(cmd[1]) && server.playerSockets[parseInt(cmd[1])]) {
        id = parseInt(cmd[1]);
      } else {
        for (let i = 0; i < server.playerInfo.length; i++) {
          if (!server.playerInfo[i]) continue;

          if (server.playerInfo[i].userName == cmd[1]) {
            id = i;
            break;
          }
        }
      }

      if (id == -1) {
        console.log(`${cmd[1]} is not a valid player name or id.`);
        return;
      }

      server.hostId = id;

      // send host change packet to everyone
      server.io.to('main').emit(OUT.TRANSFER_HOST, { oldHost: -1, newHost: server.hostId });

      console.log(`${server.playerInfo[id].userName} (id ${id}) is now the room host.`);
    },
  },
  ban: {
    usage: 'ban [username]',
    description: 'Ban a player currently in the room.',
    callback(cmd, server) {
      let id = -1;

      if (!/[^0-9]+/.test(cmd[1]) && server.playerSockets[parseInt(cmd[1])]) {
        id = parseInt(cmd[1]);
      } else {
        for (let i = 0; i < server.playerInfo.length; i++) {
          if (!server.playerInfo[i]) continue;

          if (server.playerInfo[i].userName == cmd[1]) {
            id = i;
            break;
          }
        }
      }

      if (id == -1) {
        console.log(`${cmd[1]} is not a valid player name or id.`);
        return;
      }
      
      server.banPlayer(id);

      console.log('Banned.');
    },
  },
  unban: {
    usage: 'unban [username]',
    description: 'Unban a player.',
    callback(cmd, server) {
      const index = server.banList.usernames.indexOf(cmd[1]);

      if (index == -1) {
        console.log(`${cmd[1]} is not in the ban list.`);
        return;
      }

      server.banList.usernames.splice(index, 1);
      server.banList.addresses.splice(index, 1);

      fs.writeFileSync('./banlist.json', JSON.stringify(server.banList), {
        encoding: 'utf8',
      });
    },
  },
  players: {
    usage: 'players',
    description: 'Show a list of all the players in the room.',
    callback(cmd, server) {
      if (server.playerAmount == 0) {
        console.log("There isn't anyone connected to the server!");
        return;
      }

      const teamNames = ['Spectating', 'Free For All', 'Red', 'Blue', 'Green', 'Yellow'];

      const playerList = [];

      for (let i = 0; i < server.playerInfo.length; i++) {
        const player = server.playerInfo[i];

        if (!player) continue;

        playerList.push({
          id: i,
          username: player.userName,
          level: player.guest ? 'Guest' : player.level,
          team: teamNames[player.team],
        });
      }

      console.log(
        columnify(playerList, {
          columnSplitter: '   ',
          maxWidth: 20,
        }),
      );
    },
  },
  roomname: {
    usage: 'roomname [new name]',
    description:
      "Change the room's name. The new name is not permanent and will change back to roomNameOnStartup when the server is restarted. Remember to use quotes if the room name you want to use has spaces.",
    callback(cmd, server) {
      server.roomName = cmd[1];
      console.log(`The room name is now "${cmd[1]}".`);
    },
  },
  roompass: {
    usage: 'roompass [new password, leave blank to clear the password]',
    description:
      "Change the room's name. The new password is not permanent and will change back to roomPasswordOnStartup when the server is restarted. Remember to use quotes if the password you want to use has spaces.",
    callback(cmd, server) {
      if (cmd[1]) {
        server.password = cmd[1];
        console.log(`The room password is now "${cmd[1]}".`);
      } else {
        server.password = null;
        console.log(`The room no longer has a password.`);
      }
    },
  },
  savechatlog: {
    usage: 'savechatlog',
    description: 'Save all chat messages sent since the last call to savechatlog into a txt file.',
    callback(cmd, server) {
      server.saveChatLog();
    },
  },
  close: {
    usage: 'close',
    description: 'Close the server.',
    callback: function () {
      console.log('Closing...');
      process.exit(0);
    },
  },
  help: {
    usage: 'help',
    description: 'Show this list of commands.',
    callback: function () {
      for (const command in availableCommands) {
        console.log('');
        console.log(availableCommands[command].usage);
        console.log(availableCommands[command].description);
      }
    },
  },
};

export default class ManifoldTerminal {
  public server: ManifoldServer;
  public readlineInterface: Interface;

  constructor(server: ManifoldServer) {
    this.server = server;

    this.readlineInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async start() {
    console.log(
      [
        `| Manifold Server v${require('../package.json').version}`,
        `| Live at port ${this.server.config.port}`,
        '|',
        '| Type "help" to show a list of commands.',
        '',
      ].join('\n'),
    );

    while (true) {
      const userInput = await new Promise<string>((resolve) => {
        this.readlineInterface.question('> ', resolve);
      });

      const cmd = this.parseCommand(userInput);

      if (availableCommands[cmd[0]]) {
        availableCommands[cmd[0]].callback(cmd, this.server);
      } else {
        console.log(`${cmd[0]} is not a valid command.`);
      }

      console.log('');
    }
  }

  parseCommand(cmd: string) {
    const result = [];

    const splitBySpaces = cmd.split(' ');

    let readingString = false;
    let theString = '';

    for (const part of splitBySpaces) {
      if (readingString) {
        // multi-part string ending
        if (part.endsWith('"') && !part.endsWith('\\"')) {
          readingString = false;
          theString += part.slice(0, -1);
          result.push(theString.replace('\\', ''));
          theString = '';
          continue;
        }

        theString += part + ' ';
      } else {
        // string with no spaces
        if (part.startsWith('"') && part.endsWith('"') && !part.endsWith('\\"')) {
          result.push(part.slice(1, -1).replace('\\', ''));
          continue;
        }

        // multi-part string started
        if (part.startsWith('"')) {
          readingString = true;
          theString += part.slice(1) + ' ';
          continue;
        }

        // not a string nor part of a string
        result.push(part.replace('\\', ''));
      }
    }

    return result;
  }
}
