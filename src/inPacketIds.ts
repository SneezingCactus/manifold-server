/**
 * Ids of incoming packets (packets sent by players)
 */

/* #region JOIN HANDLERS */

export const JOIN_REQUEST = '13';
export const HOST_INFORM_IN_LOBBY = '11';
export const HOST_INFORM_IN_GAME = '40';

/* #endregion JOIN HANDLERS */

/* #region NON-HOST ACTIONS */

export const CHANGE_OWN_TEAM = '6';
export const CHAT_MESSAGE = '10';
export const SET_READY = '16';
export const MAP_REQUEST = '27';
export const FRIEND_REQUEST = '35';
export const SET_TABBED = '44';

/* #endregion NON-HOST ACTIONS */

/* #region HOST ACTIONS */

export const LOCK_TEAMS = '7';
export const KICK_BAN_PLAYER = '9';
export const CHANGE_MODE = '20';
export const CHANGE_ROUNDS = '21';
export const CHANGE_MAP = '23';
export const CHANGE_OTHER_TEAM = '26';
export const CHANGE_BALANCE = '29';
export const TOGGLE_TEAMS = '32';
export const TRANSFER_HOST = '34';
export const SEND_COUNTDOWN_STARTING = '36';
export const SEND_COUNTDOWN_ABORTED = '37';
export const NO_HOST_SWAP = '50';
export const CHANGE_ROOM_NAME = '52';
export const CHANGE_ROOM_PASSWORD = '53';

/* #endregion HOST ACTIONS */

/* #region IN-GAME ACTIONS */

export const SEND_INPUTS = '4';
export const START_GAME = '5';
export const RETURN_TO_LOBBY = '14';
export const SAVE_REPLAY = '33';

/* #endregion IN-GAME ACTIONS */
