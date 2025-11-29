export type User = {
    status: UserStatus
}

export type UserStatus = 'initializing' | 'anonymous' | 'loggedIn'
