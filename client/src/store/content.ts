import {writable} from "svelte/store";

type AudioClip = {
  src: string;
  content: Uint8Array;
}

export const clips = writable<AudioClip[]>([]);
