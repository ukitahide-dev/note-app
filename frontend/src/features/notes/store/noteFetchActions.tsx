
import type { StateCreator } from "zustand";
import type { NoteStore } from "./useNoteStore";

import {
    getAllNotesApi,
    getCalendarDayNotesApi,
    getDailyNoteCountsApi,
    getFavoriteNotesApi,
    getLabelNotesApi,
    getNotesApi,
    getPinnedNotesApi,
    getSearchNotesApi,
    getTrashNotesApi,
} from "../api/noteApi";

import { useErrorStore } from "../../../shared/stores/useErrorStore";
