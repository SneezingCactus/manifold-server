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
  aliases?: string[];
}

function getPlayerId(cmd: string, server: ManifoldServer): number {
  if (!/[^0-9]+/.test(cmd) && server.playerSockets[parseInt(cmd)]) {
    return parseInt(cmd);
  } else {
    for (let i = 0; i < server.playerInfo.length; i++) {
      if (server.playerInfo[i] && server.playerInfo[i].userName == cmd) return i;
    }
  }

  return -1;
}

const availableCommands: Record<string, TerminalCommand> = {
  host: {
    usage: 'host [username or id, leave blank to make no one host]',
    description: 'Give host privileges to someone in the room.',
    callback: function (cmd, server) {
      const id = getPlayerId(cmd[1], server);

      if (cmd[1] && id == -1) {
        console.log(`${cmd[1]} is not a valid player name or id.`);
        return;
      }

      server.hostId = id;

      // send host change packet to everyone
      server.io.to('main').emit(OUT.TRANSFER_HOST, { oldHost: -1, newHost: server.hostId });

      // log host transfer message
      if (id == -1) {
        server.logChatMessage('* The game no longer has a host');
        console.log('The game no longer has a host.');
      } else {
        server.logChatMessage(`* ${server.playerInfo[server.hostId].userName} is now the game host`);
        console.log(`${server.playerInfo[id].userName} (id ${id}) is now the game host.`);
      }
    },
  },
  ban: {
    usage: 'ban [username]',
    description: 'Ban a player currently in the room.',
    callback(cmd, server) {
      const id = getPlayerId(cmd[1], server);

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
    usage: 'roomname [new name, leave blank to reset to default]',
    description:
      "Change the room's name. The new name is not permanent and will change back to roomNameOnStartup when the server is restarted. Remember to use quotes if the room name you want to use has spaces.",
    callback(cmd, server) {
      server.roomName = cmd[1] ? cmd[1] : server.config.roomNameOnStartup;
      console.log(`The room name is now "${server.roomName}".`);
    },
  },
  roompass: {
    usage: 'roompass [new password, leave blank to clear the password]',
    description:
      "Change the room's name. The new password is not permanent and will change back to roomPasswordOnStartup when the server is restarted. Remember to use quotes if the password you want to use has spaces.",
    callback(cmd, server) {
      if (cmd[1]) {
        server.password = cmd[1];
        console.log(`The room password is now "${server.password}".`);
      } else {
        server.password = null;
        console.log(`The room password has been cleared.`);
      }
    },
    aliases: ['roompassword'],
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
    callback: function (cmd, server) {
      console.log('Closing...');
      server.saveChatLog();
      process.exit(0);
    },
    aliases: ['exit'],
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

      const cmdArr = ManifoldTerminal.parseCommand(userInput);
      const command = this.getAvailableCommand(cmdArr[0]);

      if (command !== undefined) {
        command.callback(cmdArr, this.server);
      } else {
        console.log(`${cmdArr[0]} is not a valid command.`);
      }

      console.log('');
    }
  }

  getAvailableCommand(cmd: string): TerminalCommand | undefined {
    const commandKey = Object.keys(availableCommands).find(
      (command) =>
        command === cmd || (availableCommands[command]?.aliases && availableCommands[command]?.aliases?.includes(cmd)),
    );
    return commandKey ? availableCommands[commandKey] : undefined;
  }

  static parseCommandArgBool(arg: string): boolean | undefined {
    const parsedArg: string | undefined = arg?.trim().toLowerCase();

    if (parsedArg === 'true' || parsedArg === 'on') return true;
    if (parsedArg === 'false' || parsedArg === 'off') return false;

    return undefined;
  }

  static parseCommand(cmd: string): string[] {
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
