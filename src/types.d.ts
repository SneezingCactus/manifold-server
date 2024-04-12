export interface BanList {
  addresses: string[];
  usernames: string[];
}

export interface UsernameRestrictions {
  noDuplicates: boolean;
  noEmptyNames: boolean;
  maxLength: number;
}

export interface HostActionRestrictions {
  /**
   * If true, the host won't be able to enable/disable teams.
   */
  noTogglingTeams: boolean;
  /**
   * If true, the host won't be able to change other players' teams.
   */
  noChangingTeams: boolean;
  /**
   * If true, the host won't be able to lock teams.
   */
  noLockingTeams: boolean;
  /**
   * If true, the host won't be able to change the room's current game mode.
   *
   * This restriction does not affect GMMaker game modes.
   */
  noChangingMode: boolean;
  /**
   * If true, the host won't be able to change the room's current map.
   */
  noChangingMap: boolean;
  /**
   * If true, the host won't be able to transfer their privileges to another player.
   */
  noTransferringHost: boolean;
}

export interface RatelimitRestrictions {
  /**
   * Ratelimit for joining the server.
   */
  joining: ServerConfigRatelimit;
  /**
   * Ratelimit for sending chat messages. This ratelimit also applies
   * to map suggestions.
   */
  chatting: ServerConfigRatelimit;
  /**
   * Ratelimit for hitting the "ready" button.
   */
  readying: ServerConfigRatelimit;
  /**
   * Ratelimit for changing teams. This ratelimit also applies to
   * locking or toggling teams.
   */
  changingTeams: ServerConfigRatelimit;
  /**
   * Ratelimit for changing the room's game mode. This ratelimit does
   * not apply to GMMaker game modes.
   */
  changingMode: ServerConfigRatelimit;
  /**
   * Ratelimit for changing the room's map.
   */
  changingMap: ServerConfigRatelimit;
  /**
   * Ratelimit for "Game starts in (number)" messages.
   */
  startGameCountdown: ServerConfigRatelimit;
  /**
   * Ratelimit for starting and ending a game.
   */
  startingEndingGame: ServerConfigRatelimit;
  /**
   * Ratelimit for transferring host privileges.
   */
  transferringHost: ServerConfigRatelimit;
}

export interface ConfigRestrictions {
  usernames: UsernameRestrictions;

  hostActions: HostActionRestrictions;

  /**
   * This section determines how certain actions must be ratelimited.
   *
   * Each ratelimit has 3 settings: `amount`, `timeframe`, and `restore`.
   *
   * To put it simply: If a user performs an action `amount` times within
   * `timeframe` seconds, that user will not be able to perform that action
   * until `restore` seconds have passed.
   */
  ratelimits: RatelimitRestrictions;
}

export type Config = {
  /**
   * Port where the server will be hosted.
   */
  port: number;

  /**
   * Room name used by the server upon startup. The room name can later be
   * changed through the console while the server is running.
   */
  defaultRoomName: string;

  /**
   * Password used by the server upon startup. Leave as `null` to make
   * the server start with no password. The password can later be changed
   * through the console while the server is running.
   */
  defaultPassword: string | null;

  /**
   * Game settings used by the server upon startup.
   */
  defaultGameSettings: GameSettings;

  /**
   * Maximum amount of players that can be in the room at the same time.
   * The max amount of players cannot be changed while the server is running.
   */
  maxPlayers: number;

  /**
   * Controls whether the server automatically assigns a host when there
   * are no players in the room or when the previous host leaves.
   */
  autoAssignHost: boolean;

  /**
   * This object contains a set of rules that affect and regulate all players in the room (including the host), as
   * well as players trying to join the room.
   */
  restrictions: ConfigRestrictions;
};
