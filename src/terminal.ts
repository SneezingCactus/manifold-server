import { createInterface, Interface } from 'node:readline';
import ManifoldServer from './server';
import fs from 'fs';
import columnify from 'columnify';
import chalk from 'chalk';
import wrap from 'word-wrap';
import { TerminalCommand } from './types';

const availableCommands: Record<string, TerminalCommand> = {
  host: {
    usage:
      'host [username or id, leave blank to remove host permissions from the current host without assigning a new one]',
    description: 'Give host privileges to someone in the room.',
    callback: function (cmd, server) {
      const id = ManifoldTerminal.getPlayerId(cmd[1], server);

      if (cmd[1] && id == -1) {
        ManifoldTerminal.consoleLog(`${cmd[1]} is not a valid player name or id.`);
        return;
      }

      if (id == -1 && server.hostId == -1) {
        ManifoldTerminal.consoleLog('There is no game host in the server to remove privileges from!');
      }

      const oldHostId = server.hostId;
      server.transferHost(id);

      if (id == -1) {
        ManifoldTerminal.consoleLog(`Removed host privileges from ${server.playerInfo[oldHostId].userName}.`);
      } else {
        ManifoldTerminal.consoleLog(`${server.playerInfo[id].userName} (id ${id}) is now the game host.`);
      }
    },
  },
  ban: {
    usage: 'ban [username]',
    description: 'Ban a player currently in the room.',
    callback(cmd, server) {
      const id = ManifoldTerminal.getPlayerId(cmd[1], server);

      if (id == -1) {
        ManifoldTerminal.consoleLog(`${cmd[1]} is not a valid player name or id.`);
        return;
      }

      server.banPlayer(id);

      ManifoldTerminal.consoleLog('Banned.');
    },
  },
  unban: {
    usage: 'unban [username]',
    description: 'Unban a player.',
    callback(cmd, server) {
      const index = server.banList.usernames.indexOf(cmd[1]);

      if (index == -1) {
        ManifoldTerminal.consoleLog(`${cmd[1]} is not in the ban list.`);
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
        ManifoldTerminal.consoleLog("There isn't anyone connected to the server!");
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

      ManifoldTerminal.consoleLog(
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
      ManifoldTerminal.consoleLog(`The room's name is now "${server.roomName}".`);
    },
  },
  roompass: {
    usage: 'roompass [new password, leave blank to clear the password]',
    description:
      "Change the room's password. The new password is not permanent and will change back to roomPasswordOnStartup when the server is restarted. Remember to use quotes if the password you want to use has spaces.",
    callback(cmd, server) {
      if (cmd[1]) {
        server.password = cmd[1];
        ManifoldTerminal.consoleLog(`The room's password is now "${server.password}".`);
      } else {
        server.password = null;
        ManifoldTerminal.consoleLog(`The room's password has been cleared.`);
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
  scheduledclose: {
    usage: 'scheduledclose [time until force-stop in minutes (optional)]',
    description:
      'Remove host permissions from the current game host, disallow new joins, and stop the server once everyone leaves on their own. You can optionally set a timer to force-stop the server after a certain amount of time.',
    callback(cmd, server) {
      if (server.playerAmount == 0) {
        ManifoldTerminal.consoleLog(
          'Scheduled closing is meant to be used when there are people connected to the server! Did you mean to stop the server by using the command "close"?',
        );
        return;
      }

      if (server.closed) {
        ManifoldTerminal.consoleLog('A scheduled close is already taking place!');
        return;
      }

      const forceStopTime = server.scheduledClose(parseFloat(cmd[1]));

      if (forceStopTime) {
        ManifoldTerminal.consoleLog(
          `The server has been closed. Player entry is now prohibited, and the server will shut down ${forceStopTime}, or as soon as everyone leaves the room.`,
        );
      } else {
        ManifoldTerminal.consoleLog(
          'The server has been closed. Player entry is now prohibited, and as soon as everyone leaves the room, the server will shut down.',
        );
      }
    },
    aliases: ['schclose'],
  },
  abortscheduledclose: {
    usage: 'abortscheduledclose',
    description: 'Abort a scheduled close, and re-open the server.',
    callback(cmd, server) {
      if (!server.closed) {
        ManifoldTerminal.consoleLog("The server isn't currently scheduled to be closed.");
        return;
      }

      server.abortScheduledClose();

      ManifoldTerminal.consoleLog(
        'The server has been re-opened! Player entry is no longer prohibited and the server will no longer automatically shut down.',
      );
    },
    aliases: ['abortschclose'],
  },
  close: {
    usage: 'close',
    description: 'Close the server.',
    callback: function (cmd, server) {
      ManifoldTerminal.consoleLog('Closing...');
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
        const commandMetadata = availableCommands[command];

        ManifoldTerminal.consoleLog('');
        ManifoldTerminal.consoleLog(chalk.underline(command));
        ManifoldTerminal.consoleLog(` - Usage: ${commandMetadata.usage}`);
        if (commandMetadata.aliases) ManifoldTerminal.consoleLog(` - Aliases: ${commandMetadata.aliases.join(', ')}`);
        ManifoldTerminal.consoleLog('');
        ManifoldTerminal.consoleLog(commandMetadata.description, {
          indent: '   ',
        });
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
    ManifoldTerminal.consoleLog(
      [
        `| Manifold Server v${require('../package.json').version}`,
        `| Live at port ${this.server.config.port}`,
        '|',
        '| Type "help" to show a list of commands.\n',
      ].join('\n'),
    );
    ManifoldTerminal.consoleLog('');

    while (true) {
      const userInput = await this.getUserInput();

      const cmdArr = ManifoldTerminal.parseCommand(userInput);
      const command = ManifoldTerminal.getAvailableCommand(cmdArr[0]);

      if (command !== undefined) {
        command.callback(cmdArr, this.server);
      } else {
        ManifoldTerminal.consoleLog(`${cmdArr[0]} is not a valid command.`);
      }

      ManifoldTerminal.consoleLog('');
    }
  }

  private async getUserInput(): Promise<string> {
    return new Promise<string>((resolve) => {
      this.readlineInterface.question('> ', resolve);
    });
  }

  static getAvailableCommand(cmd: string): TerminalCommand | undefined {
    const commandKey = Object.keys(availableCommands).find(
      (command) =>
        command === cmd || (availableCommands[command]?.aliases && availableCommands[command]?.aliases?.includes(cmd)),
    );
    return commandKey ? availableCommands[commandKey] : undefined;
  }

  static consoleLog(message: string, options?: wrap.IOptions) {
    console.log(
      wrap(message, {
        width: Math.min(80, process.stdout.columns) - (options?.indent?.length ?? 0),
        indent: '',
        trim: true,
        ...options,
      }),
    );
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

  static getPlayerId(cmd: string, server: ManifoldServer): number {
    if (!/[^0-9]+/.test(cmd) && server.playerSockets[parseInt(cmd)]) {
      return parseInt(cmd);
    } else {
      for (let i = 0; i < server.playerInfo.length; i++) {
        if (server.playerInfo[i] && server.playerInfo[i].userName == cmd) return i;
      }
    }

    return -1;
  }
}
