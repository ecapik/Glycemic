export interface IUser {
    status?:  boolean;
    message?: string;
    result?:  UserResult;
}

export interface UserResult {
    uid?:          number;
    name?:         string;
    surname?:      string;
    cityid?:       number;
    mobile?:       string;
    email?:        string;
    password?:     string;
    enabled?:      boolean;
    tokenExpired?: boolean;
    roles?:        Role[];
}

export interface Role {
    rid?:  number;
    name?: string;
}