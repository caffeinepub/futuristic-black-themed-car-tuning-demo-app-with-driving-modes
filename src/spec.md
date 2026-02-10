# Specification

## Summary
**Goal:** Fix anonymous tuning/settings load/save failures, implement a working Throttle slider panel, and adjust Scooter Tuning Max Speed to a 1–100 range with aligned backend validation.

**Planned changes:**
- Update backend tuning/settings endpoints used by Car Tuning, Scooter Tuning, and Fuel Injection to allow anonymous load/save without unauthorized traps, while keeping clear validation errors when inputs are invalid.
- Update frontend data fetching/mutation handling for Car Tuning, Scooter Tuning, and Fuel Injection so these sections load normally without generic “failed to load” banners under normal use.
- Replace the Throttle placeholder with a real Throttle panel including a 1–10 slider, using the existing React Query + optimistic update persistence pattern and reload-on-refresh behavior.
- Add/ensure a visible Scooter Tuning “Max Speed” slider with a 1–100 range, and align backend defaults/validation so saves in-range persist and reload correctly.
- Ensure SectionPlaceholderPanel messaging does not appear for implemented sections (Throttle and Scooter Tuning), and keep any remaining placeholder text in English.

**User-visible outcome:** Anonymous users can open the app and use Car Tuning, Scooter Tuning, and Fuel Injection without load failures; Throttle has a functional 1–10 slider that saves and restores; Scooter Tuning includes a Max Speed slider from 1–100 that saves and restores successfully.
