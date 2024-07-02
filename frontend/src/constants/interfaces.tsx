import { NextApiRequest } from "next";
import { AlertSeverity } from "./enums";

export interface InitState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  registered: boolean;
  snackbarMessage: string | undefined;
  events: any[];
  users: User[];
  open: boolean;
  severity: AlertSeverity;
  sentFriendRequests: string[];
  getFriendRequests: string[];
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  activities: Activity[];
  friends: string[];
}

export interface Activity {
  uuid: string;
  title: string;
  email: string;
  group_id: string;
  start: string;
  end: string;
  allDay: boolean;
  duration: string;
  freq: string;
  dtstart: string;
  until: string;
  interval: number;

}

export interface RegisterArgs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface CookiesApiRequest extends NextApiRequest {
  headers: {
      cookie: string;
  };
}

export interface DeleteApiRequest extends NextApiRequest {
  body: {
    uuid: string;
  };
  headers: {
      cookie: string;
  };
}

export interface LoginArgs {
  email: string;
  password: string;
}

export interface DeleteActivityArgs {
  uuid: string;
}

export interface DeleteFriendArgs {
  email: string;
}

export interface ChangePasswordArgs {
  old_password: string;
  password: string;
  repeated_password: string;
}

export interface CreateActivityArgs {
  allDay: boolean;
  start: string;
  end: string;
  title: string;
  duration: string;
  freq: string;
  dtstart: string;
  until: string;
  email: string;
}

export interface CreateActivityApiRequest extends NextApiRequest {
  body: {
      allDay: boolean;
      start: string;
      end: string;
      title: string;
      duration: string;
      freq: string;
      dtstart: string;
      until: string;
      email: string;
  };
}

export interface RegisterUserApiRequest extends NextApiRequest {
  body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
  };
}

export interface LogOutUserApiRequest extends NextApiRequest {}

export interface LoginUserApiRequest extends NextApiRequest {
  body: {
      email: string;
      password: string;
  };
}

export interface ChangePasswordApiRequest extends NextApiRequest {
  body: {
      old_password: string;
      password: string;
      repeated_password:string;
  };
}

export interface FriendRequestBodyApiRequest extends NextApiRequest {
  body: {
      from_user: string;
      to_user: string;
  };
}

export interface DeleteFriendBodyApiRequest extends NextApiRequest {
  body: {
      email: string;
  };
}

export interface ActivityArgs {
  uuid: string;
  title: string;
  group_id: string;
  start: string;
  end: string;
  allDay: boolean;
  duration: string;
  freq: string;
  dtstart: string;
  until: string;
  interval: number;
}

export interface ParsedEvent {
  id: string,
  groupId: string,
  allDay: boolean, 
  start: string,
  end: string,
  title: string,
  duration: string,
  rrule : {
    interval: number,
    freq: string,
    dtstart: string,
    until: string,
  }
}

export interface ParsedEvent {
  id: string,
  groupId: string,
  allDay: boolean, 
  start: string,
  end: string,
  title: string,
  duration: string,
}

export interface UpdateActivityApiRequest extends NextApiRequest {
  body: {
      uuid: string;
      allDay: boolean;
      start: string;
      end: string;
      title: string;
      duration: string;
      freq: string;
      dtstart: string;
      until: string;
      email: string;
  };
}

export interface UpdateActivityArgs {
  uuid: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  duration: string;
  freq: string;
  dtstart: string;
  until: string;
}

export interface FriendRequestArgs {
  to_user: string;
  from_user: string;
}