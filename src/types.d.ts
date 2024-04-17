export interface BanList {
  addresses: string[];
  usernames: string[];
}

export interface UsernameRestrictions {
  noDuplicates: boolean;
  noEmptyNames: boolean;
  maxLength: number;
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
  roomNameOnStartup: string;

  /**
   * Password used by the server upon startup. Leave as `null` to make
   * the server start with no password. The password can later be changed
   * through the console while the server is running.
   */
  roomPasswordOnStartup: string | null;

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

declare interface GameSettings {
  /**
   * The currently selected map, in its encoded form.
   */
  map: string;
  /**
   * Amount of rounds to win.
   */
  wl: number;
  /**
   * `true` if this is a quickplay room, otherwise `false`.
   */
  q: boolean;
  /**
   * `true` if teams are locked, otherwise `false`.
   */
  tl: boolean;
  /**
   * `true` if teams are on, otherwise `false`.
   */
  tea: boolean;
  /**
   * The currently selected mode "engine". Both `ga` and `mo` are required to be set correctly.
   *
   * - "b" encompasses all game modes that take Classic as a base (pretty much every mode except Football).
   * - "f" is exclusively Football.
   */
  ga: string;
  /**
   * The currently selected mode.
   *
   * Modes are internally represented by an ID:
   *
   * - "b" is Classic
   * - "bs" is Simple
   * - "ar" is Arrows
   * - "ard" is Death Arrows
   * - "sp" is Grapple
   * - "v" is VTOL
   */
  mo: string;
  /**
   * Array that contains the balance (nerf/buff) of each player. Ordered by player ID.
   *
   * Players with 0% balance are not present here.
   */
  bal: number[];
  /**
   * Unknown.
   */
  gt: number;
}

export interface Player {
  /**
   * The player's username.
   */
  userName: string;
  /**
   * Indicates whether the player is a guest account or not.
   */
  guest: boolean;
  /**
   * The player's level.
   */
  level: number;
  /**
   * Indicates in what team the player is in.
   *
   * 0 means the player is in Spectate,
   * 1 means the player is in FFA,
   * 2 means Red Team,
   * 3 means Blue Team,
   * 4 means Green Team,
   * and 5 means Yellow Team.
   */
  team: number;
  /**
   * The player's avatar.
   */
  avatar: any;
  /**
   * Indicates whether the player is marked as ready or not.
   */
  ready: boolean;
  /**
   * Indicates whether the player is AFK or not.
   */
  tabbed: boolean;
  /**
   * ID used to make peer to peer connections between players. Manifold disables the usage of peer to peer, so this
   * ID remains unused.
   */
  peerId: string;
}
