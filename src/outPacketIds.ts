/**
 * Ids of outgoing packets (packets sent by the server)
 */

/* #region JOIN HANDLERS */

export const SERVER_INFORM = '3';
export const HOST_INFORM_IN_LOBBY = '21';
export const HOST_INFORM_IN_GAME = '48';
export const PLAYER_JOINED = '4';
export const PLAYER_LEFT = '5';
export const HOST_LEFT = '6';

/* #endregion JOIN HANDLERS */

/* #region LOBBY ACTIONS (BOTH HOST AND NON-HOST) */

export const CHANGE_TEAM = '18';
export const CHAT_MESSAGE = '20';
export const SET_READY = '8';
export const MAP_REQUEST_HOST = '33';
export const MAP_REQUEST_NON_HOST = '34';
export const FRIEND_REQUEST = '42';
export const SET_TABBED = '52';
export const LOCK_TEAMS = '19';
export const CHANGE_MODE = '26';
export const CHANGE_ROUNDS = '27';
export const CHANGE_MAP = '29';
export const CHANGE_BALANCE = '18';
export const TOGGLE_TEAMS = '39';
export const TRANSFER_HOST = '41';
export const SEND_COUNTDOWN_STARTING = '43';
export const SEND_COUNTDOWN_ABORTED = '44';

/* #endregion LOBBY ACTIONS (BOTH HOST AND NON-HOST) */

/* #region IN-GAME ACTIONS */

export const SEND_INPUTS = '7';
export const START_GAME = '15';
export const RETURN_TO_LOBBY = '13';
export const SAVE_REPLAY = '40';

/* #endregion IN-GAME ACTIONS */

/* #region MISC */

export const REPLY_TIMESYNC = '23';
export const ERROR_MESSAGE = '16';

/* #endregion MISC */
