import { describe, expect, it } from "vitest";
import { exerciseMedia } from "./src/data/exercise-media";
import { exercises } from "./src/data/exercises";

describe("exercise media coverage", () => {
  it("provides a square instructional clip and preview for every exercise", () => {
    for (const exercise of exercises) {
      const media = exerciseMedia[exercise.id];

      expect(media, `${exercise.id} is missing media`).toBeDefined();
      expect(media.video || media.animation, `${exercise.id} is missing an instructional clip`).toBeTruthy();
      expect(media.animation, `${exercise.id} is missing an animated card preview`).toBeTruthy();
      expect(media.video ? media.videoOrientation : media.animationOrientation).toBe("square");
    }
  });
});
