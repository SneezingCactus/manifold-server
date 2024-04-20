import { Config } from './src/types';

const config: Config = {
  /**
   * Port where the server will be hosted.
   */
  port: 3000,

  /**
   * Room name used by the server upon startup. The room name can later be
   * changed through the console while the server is running.
   */
  roomNameOnStartup: 'Manifold Server',

  /**
   * Password used by the server upon startup. Leave as `null` to make
   * the server start with no password. The password can later be changed
   * through the console while the server is running.
   */
  roomPasswordOnStartup: null,

  /**
   * Game settings used by the server upon startup.
   */
  defaultGameSettings: {
    map: 'ILAcJAhBFBjBzCTlMiAFgDQFoHUAeAVgEYBMAjADYCS0w1AKrgGICuAhrtgG7EDidFEOAARAPQSJKaqOFyQQA',
    gt: 2,
    wl: 3,
    q: false,
    tl: false,
    tea: false,
    ga: 'b',
    mo: 'b',
    bal: [],
  },

  /**
   * Maximum amount of players that can be in the room at the same time.
   * The max amount of players cannot be changed while the server is running.
   */
  maxPlayers: 12,

  /**
   * Controls whether the server automatically assigns a host when there
   * are no players in the room or when the previous host leaves.
   */
  autoAssignHost: true,

  /**
   * This is quite different to autoAssignHost, if this is enabled: 
   * It closes the room when the host leaves.
   */
  endRoomNoHostSwap: false,

  /**
   * Timestamp format used for chatlogs.
   */
  timeStampFormat: 'YYYY-MM-DD hh:mm:ss UTCZ',

  /**
   * This object contains a set of rules that affect and regulate all players in the room (including the host), as
   * well as players trying to join the room.
   */
  restrictions: {
    usernames: {
      noDuplicates: true,
      noEmptyNames: true,
      maxLength: 32,
    },

    /**
     * This section determines how certain actions must be ratelimited.
     *
     * Each ratelimit has 3 settings: `amount`, `timeframe`, and `restore`.
     *
     * To put it simply: If a user performs an action `amount` times within
     * `timeframe` seconds, that user will not be able to perform that action
     * until `restore` seconds have passed.
     */
    ratelimits: {
      /**
       * Ratelimit for joining the server.
       */
      joining: { amount: 5, timeframe: 10, restore: 60 },
      /**
       * Ratelimit for sending chat messages. This ratelimit also applies
       * to map suggestions.
       */
      chatting: { amount: 7, timeframe: 10, restore: 10 },
      /**
       * Ratelimit for hitting the "ready" button.
       */
      readying: { amount: 20, timeframe: 5, restore: 30 },
      /**
       * Ratelimit for changing teams. This ratelimit also applies to
       * locking teams.
       */
      changingTeams: { amount: 4, timeframe: 0.5, restore: 1 },
      /**
       * Ratelimit for changing the room's game mode. This ratelimit does
       * not apply to GMMaker game modes.
       */
      changingMode: { amount: 2, timeframe: 1, restore: 1 },
      /**
       * Ratelimit for changing the room's map.
       */
      changingMap: { amount: 2, timeframe: 2, restore: 2 },
      /**
       * Ratelimit for "Game starts in (number)" messages.
       */
      startGameCountdown: { amount: 5, timeframe: 1, restore: 2 },
      /**
       * Ratelimit for starting and ending a game.
       */
      startingEndingGame: { amount: 10, timeframe: 5, restore: 5 },
      /**
       * Ratelimit for transferring host privileges.
       */
      transferringHost: { amount: 5, timeframe: 10, restore: 60 },
    },
  },
};

export default config;
