"use client";

import { Deck, NotesView } from "@/components/deck/engine";
import { deck } from "@/talks/bchc/deck";

/*
 * The talk, with its deck definition: scenes are components, so the
 * definition lives on the client. No `remotePath`: the phone remote needs a
 * server route, and GitHub Pages serves files only, so the deck offers none
 * and is driven from the keyboard, a click or the notes window.
 */

export const TalkDeck = () => <Deck deck={deck} />;

/** The speaker's screen, opened from the deck in a second window of the same browser. */
export const TalkNotes = () => <NotesView deck={deck} />;
