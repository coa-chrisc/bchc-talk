/**
 * The deck's one copy of GSAP, with the site's easings (`--ease-page` and
 * `--ease-out-soft` in globals.css) and the deck's own `carry` named for
 * tweens. Import `gsap` from
 * here, never from the package. Only the core and CustomEase are used: the
 * kit draws lines and moves marks with plain properties, so every picture
 * can be set directly as well as tweened to.
 */
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("page", "0.2,0,0,1");
CustomEase.create("soft", "0.2,0.65,0.3,1");
// A large part carried across the stage: it gathers speed before it travels and sets down without creeping.
CustomEase.create("carry", "0.5,0,0.15,1");
// A talk keeps real time: after a hitch the motion catches up, it does not run late.
gsap.ticker.lagSmoothing(0);

export { gsap };
