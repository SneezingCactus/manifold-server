export interface BanList {
  addresses: string[];
  usernames: string[];
}

export interface UsernameRestrictions {
  /**
   * If `true`, players trying to join with a username that someone in the room already has will not be allowed to join.
   */
  noDuplicates: boolean;
  /**
   * If `true`, players with completely empty usernames will not be allowed to join.
   */
  noEmptyNames: boolean;
  /**
   * Maximum length that a player's username can have.
   */
  maxLength: number;
  /**
   * Players whose username matches this regular expression will not be allowed to join.
   */
  disallowRegex: RegExp;
}

export interface LevelRestrictions {
  /**
   * Minimum level required to join. Only players with levels above this number will be able to join.
   */
  minLevel: number;
  /**
   * Maximum level required to join. Only players with levels below this number will be able to join.
   */
  maxLevel: number;
  /**
   * If `true`, it will only allow levels that contain only numbers (by making some modifications to the client,
   * people may be able to join with levels that have text on them, which is why this setting exists)
   */
  onlyAllowNumbers: boolean;
  /**
   * If `true`, the level of every player in the room will be hidden, replaced with a '-'.
   */
  censorLevels: boolean;
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
  /**
   * Maximum length for chat messages. Messages that go beyond this limit will be truncated.
   */
  maxChatMessageLength: number;

  /**
   * Restrictions for player usernames.
   */
  usernames: UsernameRestrictions;

  /**
   * Restrictions for player levels. Keep in mind that levels can be easily spoofed as Manifold cannot check the
   * validity of a player's level. Therefore, people may spoof their levels to bypass min/max level restrictions,
   * show a ridiculously high number or show a piece of text in place of the level.
   */
  levels: LevelRestrictions;

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
   * If `true`, the server will be hosted with HTTPS. This is necessary
   * for hosting a server that is meant to be accessible outside of a local
   * network, whether it be a server you host in your computer, or a server
   * hosted on a cloud service that doesn't offer a built in HTTPS proxy.
   *
   * Using the server with HTTPS requires you to get SSL/TLS certificates
   * for the domain you're hosting the server on, and store the key and cert
   * files as "server-key.pem" and "server-cert.pem" in the root folder of
   * the server.
   */
  useHttps: boolean;

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
   * Timestamp format used for chat logs.
   */
  timeStampFormat: string;

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
   * The game type.
   * Game types are internally represented by an ID:
   *
   * - 1 represents a mode where the game cycles through maps until the rounds played meet the number of maps. If a player has won, the game ends.
   * - 2 represents a mode where a player needs to win a certain number of rounds, decided by "wl". Once the required rounds are won, the game ends.
   */
  gt: number;
}

/**
 * Skin shape ids for avatar layers
 */
export enum eAvatarShape { // Idealy large enums like this should be moved to another file
  Alien1,
  Alien2,
  Alien3,
  Alien4,
  Alien5,
  Alien6,
  Barbedwire1,
  Barbedwire2,
  Barbedwire3,
  Barbedwire4,
  Barbedwire5,
  Barbedwire6,
  Circle,
  Crescent,
  Cross1,
  Cross2,
  Cross3,
  Cross4,
  Cross5,
  Cross6,
  Cross7,
  Face1,
  Face10,
  Face11,
  Face12,
  Face13,
  Face14,
  Face15,
  Face16,
  Face17,
  Face18,
  Face2,
  Face19,
  Face20,
  Face21,
  Face3,
  Face4,
  Face5,
  Face6,
  Face7,
  Face8,
  Face9,
  Flames1,
  Flames10,
  Flames2,
  Flames3,
  Flames4,
  Flames5,
  Flames6,
  Flames7,
  Flames8,
  Flames9,
  Skull1,
  Cross,
  Star1,
  Triangle,
  Grungecircle,
  Grungeheart1,
  Grungeheart2,
  Grungeleaf1,
  Grungeleaf2,
  Grungeleaf3,
  Skull2,
  Shoeprint,
  Handprint,
  Fingerprint,
  Print2,
  Grungelines1,
  Grungelines2,
  Splat,
  Pentagon,
  Rectangle1,
  Triangletall1,
  Rectangle2,
  Rectangle3,
  Rectanglefat,
  Semicircle,
  Roundedrectangle,
  Moon,
  Triangleeven,
  Triangletall2,
  Splat1,
  Splat2,
  Splat3,
  Square,
  Star2,
  Radioactive1,
  World,
  Signal,
  Skullcross,
  Skull3,
  Exclamation,
  Electricity,
  Chain,
  Scope1,
  Scope2,
  Radioactive2,
  Biohazard,
  Fire1,
  Fire2,
  Oxidiser,
  Ball,
  Atomic,
  Freeze,
  Whisp1,
  Whisp2,
  Whisp3,
  Whisp4,
  Whisp5,
  Whisp6,
  Whisp7,
  Whisp8,
  Whisp9,
  Whisp10,
  Whisp11,
}

export interface AvatarLayer {
  /**
   * The shape id
   *
   * Value minimum is 1 and maximum 115 otherwise it will be reverted back to 1
   */
  id: eAvatarShape;
  /**
   * The scale of the shape
   *
   * Value minimum is -9999 and maximum 9999 otherwise it will be reverted back to 0
   */
  scale: number;
  /**
   * The angle of the shape in degrees
   */
  angle: number;
  /**
   * x position of the shape
   */
  x: number;
  /**
   * y position of the shape
   */
  y: number;
  /**
   * Whether to flip the skin horizontally (x)
   */
  flipX: boolean;
  /**
   * Whether to flip the skin vertically (y)
   */
  flipY: number;
  /**
   * The shape colour
   *
   * Value minimum is 0 and maximum 16777215 otherwise it will be reverted back to 0
   */
  color: number;
}

export interface Avatar {
  /**
   * The different "layers" of shapes on the skin.
   * For a skin to be usable this must not be over 15 layers.
   */
  layers: (AvatarLayer | undefined)[];
  /**
   * The background colour of the skin.
   */
  bc: number;
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
  avatar: Avatar;
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
