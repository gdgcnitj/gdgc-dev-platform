import { relations } from "drizzle-orm/relations";
import { user, account, session, blog, blogPlaylist } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const blogRelations = relations(blog, ({one}) => ({
	author: one(user, {
		fields: [blog.authorId],
		references: [user.id]
	}),
	playlist: one(blogPlaylist, {
		fields: [blog.playlistId],
		references: [blogPlaylist.id]
	}),
}));