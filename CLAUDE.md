# Adwrells/Adwrells — GitHub Profile README

This repo renders as the profile page at https://github.com/Adwrells. It is not an
application; the deliverable is `README.md`, and everything else here exists to keep that
file correct.

## What is tracked

`README.md` is the deliverable. Alongside it: this file, `.gitignore`, and
`.claude/skills/avoid-ai-writing/` — the writing audit the README is held to, committed so
it travels with the repo rather than living on one machine.

This replaces an earlier rule that allowed `README.md` alone and ignored everything else
with a blanket `*`. If you find guidance elsewhere claiming one tracked file, it is stale.

Two paths stay untracked, and should remain so: `.claude/settings.local.json` (per-machine
permissions) and `.claude/worktrees/` (throwaway agent workspaces, each of which is itself
a git repository — committing one stores a gitlink and a fresh clone gets an empty
directory).

The repo is public. Anything committed here is visible to anyone who opens the profile, so
do not put credentials, personal notes, or private project details in it.

## Verify every image URL before committing

The stats cards are live SVGs from third-party services, not files in this repo. They
break silently: a dead service still returns HTTP 200 while serving an error card, and
`img.shields.io` returns 200 for a logo slug that no longer exists, just without the icon.
Check both conditions:

```bash
grep -oE 'https://[^)" ]+' README.md | sort -u | while read -r u; do body=$(curl -s "$u"); code=$(curl -s -o /dev/null -w "%{http_code}" "$u"); echo "$body" | grep -qi "went wrong" && code="$code ERROR-CARD"; echo "$body" | grep -q "<image" || code="$code NO-LOGO"; echo "$code $u"; done
```

Known state as of 2026-08-11:

- `github-readme-stats.vercel.app` returns **503** — its shared GitHub API quota is
  exhausted. Do not reintroduce it without self-hosting on a personal Vercel account
  with a `PAT_1` token.
- Working card sources: `github-profile-summary-cards.vercel.app`,
  `streak-stats.demolab.com`, `github-readme-activity-graph.vercel.app`, `komarev.com`.
  All but shields.io are volunteer-run free instances and can go dark without notice.
- Brand icons for AWS, SQL Server, LinkedIn and Excel were removed upstream from
  simple-icons. Those badges render as text by design — no query string fixes them.

## Conventions

- **Third person, always.** The README reads "Amit builds…", "His work focuses on…" —
  never "I build…" or "My work…". This applies to headings too. Check any new section
  before committing.
- **Theme:** `tokyonight` on every card that takes a `theme` parameter. The activity
  graph spells it `tokyo-night`. Accent blue for non-themable widgets is `#70a5fd`.
- **Badges keep official brand colours** — deliberate choice, not an oversight. Brand
  colours scan faster than a uniform palette. Do not "unify" them.
- **Claims must match the source.** Project stack lines are derived by reading the actual
  project (imports, `package.json`, `requirements.txt`), never from the old README text.
  A profile a recruiter will probe is the wrong place for aspirational claims.
- Private repos are labelled `*(private)*` so visitors understand the 404 instead of
  hitting an unexplained dead link.

## Writing style: must not read as AI-generated

The README must not read as machine-written. The `avoid-ai-writing` skill is installed at
`~/.claude/skills/avoid-ai-writing/` and its detector runs offline with no dependencies:

```bash
node -e "const P=require(process.env.USERPROFILE+'/.claude/skills/avoid-ai-writing/detector/patterns.js'),fs=require('fs');const r=P.analyzeText(fs.readFileSync('README.md','utf8'));console.log(r.score,r.label,r.document_classification);r.issues.forEach(i=>console.log(' -',i.type,i.severity,String(i.text).slice(0,70)))"
```

Current baseline: **score 1, "Minimal AI signals", HUMAN_ONLY**. Keep it there. The main
rules that bite this file:

- **Em dashes** in prose. Target zero. The skill carves out list items of the form
  `- **Term** — description`, but not mid-sentence splices or `(private — reason)`.
- **Tier-1 vocabulary**: `comprehensive`, `robust`, `leverage`, `seamless`, `cutting-edge`,
  `delve`, `pivotal`, `meticulous`. Replace on sight with the plain word.
- **Bold overuse.** Two known-benign flags remain and are *not* worth fixing: the bold
  count (~22, nearly all structural `**Repo:**` labels and list lead terms) and low
  vocabulary diversity (inflated by ~50 repeated shields.io badge URLs, not prose).
- Emoji in section headings violate the skill's rule but are kept deliberately: they are
  the genre convention for GitHub profile READMEs. Don't strip them.

## Adding skills

Skills are folders containing a `SKILL.md` with YAML frontmatter (`name`, `description`).
The description is what makes a skill trigger, so write it as the situations it applies to.

```
~/.claude/                          # user scope — available in every project
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md                # required: frontmatter + instructions
│       ├── references/             # optional: docs loaded on demand
│       └── scripts/                # optional: helper scripts
├── settings.json                   # permissions, env vars, hooks
└── projects/<slug>/memory/         # persistent memory (see MEMORY.md there)

<project>/.claude/                  # project scope — only in that repo
├── skills/<skill-name>/SKILL.md    # takes precedence over user scope
└── settings.json
```

To add one: create `~/.claude/skills/<name>/SKILL.md`, or clone a repo that ships one and
copy its `SKILL.md` folder in. Restart the session to pick it up, then invoke by name.

### Where this repo's skills live

`avoid-ai-writing` is installed in **both** scopes on purpose:

- `~/.claude/skills/avoid-ai-writing/` — available in every project
- `.claude/skills/avoid-ai-writing/` — this repo, so the writing rules travel with it

Project scope wins when both exist, so edit the local copy to change behaviour here only.
The two copies do not sync: update both, or delete one, when the skill changes.

Anything under `.claude/` is covered by the `*` rule in `.gitignore`, so a local skill can
never break the single-tracked-file constraint. Verify with `git status` after installing —
it must stay clean.

## Git

Commit and push only when explicitly asked. Approval for one push does not carry to the
next. Profile changes are outward-facing and immediately public.

After pushing, GitHub's camo proxy may keep serving cached copies of previously broken
images for a few minutes — a stale card is not necessarily a failed change.
