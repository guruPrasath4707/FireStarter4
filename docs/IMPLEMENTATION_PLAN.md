# FireStarter4 / Pathlight implementation plan

This is the working checklist for improving the existing application without pretending unfinished features are complete. Work is split into reviewable milestones; a milestone is marked complete only after its relevant checks pass.

## Repository baseline observed

- React 18, Vite 5, React Router 7, and Tailwind CSS 4.
- Firebase email/password auth and Firestore-backed user profiles are wired in the client.
- Career Explorer reads a 12-item local demo catalogue. Interest overlap is calculated from profile tags; salary and outlook values remain illustrative and unverified.
- Learning Hub, AI Mentor, Assessments, Scholarships, and Opportunities are placeholder pages despite navigation entries and early service stubs.
- No test suite existed at the audit baseline. The production build worked but did not detect the route/profile bugs noted below.
- Multiple overlapping UI/layout and Firebase setup modules exist. A root-level Colleges.jsx appears to be legacy and is not part of the active route tree.
- No backend server or Firebase Security Rules file is included in this repository. External Firebase console/rules settings cannot be verified from front-end code alone.

## Ordered work

### 0. Project baseline and CI
- [x] Correct README and setup guidance.
- [x] Add .env.example; ignore local .env* files.
- [x] Add GitHub Actions install/build workflow.
- [x] Confirm production build through GitHub Actions.
- [x] Add an automated test command to CI and confirm tests plus build pass.

### 1. Authentication, onboarding, and profile state
- [x] Make route guards read onboarding state from ProfileContext, not an absent AuthContext property.
- [x] Wait until both auth state and profile subscription are loaded before redirect decisions.
- [x] Prevent a failed profile read from being interpreted as incomplete onboarding; allow retry.
- [x] Remove the profile-seeding race that can overwrite a just-completed onboarding record.
- [x] Test the route-decision matrix with Node's built-in test runner.

### 2. Firebase configuration and data access
- [x] Remove duplicate Firebase app initialization and placeholder hard-coded configuration.
- [x] Make required client configuration explicit and show an actionable setup error.
- [x] Route the legacy profile service through the shared Firestore access layer instead of initializing its own Firebase client.
- [x] Document that Firestore Security Rules are a deployment requirement; client-side route guards are not data authorization.

### 3. Career Explorer correctness
- [x] Replace misleading static “personalized” score labels with transparent, explainable interest matching.
- [x] Ensure no-interest, no-match, loading, and error states behave consistently.
- [x] Persist saved careers atomically and make saved careers discoverable/filterable in the Career Explorer.
- [x] Clearly label salary ranges, market outlook and skill weights as illustrative catalogue content.
- [ ] Validate salary/outlook catalogue data against dated authoritative sources before presenting it as current labour-market information.

### 4. Honest public experience and navigation
- [x] Remove invented testimonials, unsubstantiated learner-count claims, and misleading claims about features that are not implemented.
- [x] Ensure all public navigation anchors land on a real section or route.
- [x] Replace placeholder privacy/terms/help links with real pages or clearly non-interactive copy until those pages exist.
- [x] Bring branding and public-facing UI copy into alignment with implemented capabilities.
- [x] Align onboarding and profile language choices with translations that are actually loaded by the runtime (English only for now); normalize legacy unsupported preferences to English and test fallback behavior.

### 5. Working student features (incremental, not fake integrations)
- [ ] Learning Hub: curated starter catalogue with clear source/license metadata and working completion state.
- [ ] Assessments: deterministic, explainable baseline quiz and results; avoid unsupported “adaptive” claims.
- [ ] AI Mentor: define a server-side API contract and safe deployment approach before connecting a model; no provider secrets in Vite client variables.
- [ ] Scholarships and Opportunities: define verified source, freshness date, eligibility fields, application URL, and update owner before presenting listings as real.
- [ ] Dashboard: derive progress, streak, and timeline numbers from saved records, not hard-coded zeros or invented percentages.

### 6. Profile and settings reliability
- [ ] Load and reinitialize the profile edit form when profile data changes.
- [ ] Show save failures and success feedback; validate fields before writes.
- [ ] Persist preference controls or remove the appearance of functional controls that do nothing.
- [ ] Handle logout and mobile navigation errors/keyboard behavior.

### 7. Architecture, accessibility, security, and performance
- [ ] Audit overlapping components/ui, components/shell, design-system, and layouts modules; consolidate only after reference checks.
- [ ] Resolve unlisted direct dependencies and remove obsolete utilities/configs after reference checks.
- [ ] Add lint/type-check/browser-level regression coverage beyond build-only CI.
- [ ] Review npm audit findings one dependency at a time; avoid blind force upgrades.
- [ ] Split the large initial JavaScript bundle and verify production chunk sizes.
- [ ] Check keyboard navigation, form labels, focus visibility, responsive layout, and accessible error messages.

## Current milestone

Milestones 0–4 are complete on `main` or in the language-alignment pull request pending review. Milestone 4 changes remove unsupported public claims, make public navigation targets real, replace fake/dead footer links with accurate project links and a clear legal-page notice, and restrict language preferences to the English interface that is actually loaded. Existing profile documents with unsupported language codes safely fall back to English in the profile editor.

The language-alignment branch passed the GitHub Actions workflow (`npm ci`, `npm test`, and `npm run build`) at commit `7e0f052`. The next implementation milestone is 5: build one student-facing feature at a time using real, reviewable local data and clear sourcing—starting with a curated Learning Hub catalog and persisted completion state. After that, implement a deterministic baseline assessment, define the AI Mentor server contract, then add verified scholarship/opportunity sources. Do not mark those features complete until behavior and relevant tests are implemented.
