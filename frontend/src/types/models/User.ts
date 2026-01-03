import type { Image } from "./Image"
import type { Friend } from "./Friend"

export type Email = string

export type NotificationPreference = {
	id: number
	userId: User["id"]
	email?: Email
	sms?: boolean
	pushNotification?: boolean
}

export type UiThemeMode = "dark" | "light" | "auto"

export type Setting = {
	id: number
	userId: User["id"]
	notificationPreferencesId?: NotificationPreference["id"]
	uiTheme?: UiThemeMode
	createdAt?: Date
	updatedAt?: Date
}

export type User = {
	id?: number
	username: string
	password_hash?: string
	password_salt?: Email
	email?: Email
	profile_image_id?: Image["id"]
	birthday?: Date
	createdAt?: Date
	updatedAt?: Date
}

export type UsersFriend = {
	id: number
	userId: User["id"]
	friendId: Friend["id"]
	createdAt?: Date
	updatedAt?: Date
	relationshipStatus?: string
}

export type Session = {
	id: number
	userId: User["id"]
	sessionToken: string
	createdAt?: Date
	expiresAt?: Date
}
