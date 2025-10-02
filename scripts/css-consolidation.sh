#!/bin/bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

print_usage() {
  cat <<'USAGE'
CSS Consolidation Utility (parity-gated)

Usage:
  scripts/css-consolidation.sh dry-run             # Print build order and CSSOM diff properties
  scripts/css-consolidation.sh unit <name>         # Run a single consolidation unit (non-interactive)
  scripts/css-consolidation.sh run-all             # Iterate predefined units (non-interactive)

Notes:
  - Expects tests/config/build-order.json and tests/config/cssom-diff-properties.json
  - Use per-unit workflow: branch -> edit -> npm run build:css -> parity checks -> merge/rollback
USAGE
}

require() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

print_build_order() {
  if [ -f tests/config/build-order.json ]; then
    echo "=== Build Order (tests/config/build-order.json) ==="
    cat tests/config/build-order.json
    echo ""
  else
    echo "tests/config/build-order.json not found" >&2
    exit 1
  fi
}

print_cssom_props() {
  if [ -f tests/config/cssom-diff-properties.json ]; then
    echo "=== CSSOM Diff Properties (tests/config/cssom-diff-properties.json) ==="
    cat tests/config/cssom-diff-properties.json
    echo ""
  else
    echo "tests/config/cssom-diff-properties.json not found" >&2
    exit 1
  fi
}

run_dry() {
  require node
  require npm
  require php
  print_build_order
  print_cssom_props
  echo "Dry-run complete."
}

run_unit() {
  local unit_name="${1:-}"
  if [ -z "$unit_name" ]; then
    echo "Unit name required" >&2
    exit 1
  fi
  echo "Starting consolidation unit: $unit_name"
  # Non-interactive gates: build -> tests -> auto-commit or auto-revert
  require npm
  require php

  echo "→ Building CSS"
  if ! npm run build:css >/dev/null 2>&1; then
    echo "✖ Build failed. Aborting unit $unit_name" >&2
    git restore --staged . 2>/dev/null || true
    git checkout -- . 2>/dev/null || true
    exit 1
  fi

  echo "→ Running comprehensive tests (non-interactive)"
  if php tests/run_comprehensive_tests.php >/dev/null 2>&1; then
    echo "✔ Parity/tests passed for $unit_name"
    # Commit only if there are changes
    if [ -n "$(git status --porcelain)" ]; then
      git add -A
      git commit -m "css($unit_name): non-interactive unit; parity intact"
    else
      echo "ℹ No changes to commit for $unit_name"
    fi
  else
    echo "✖ Tests failed. Reverting $unit_name"
    git restore --staged . 2>/dev/null || true
    git checkout -- . 2>/dev/null || true
    exit 1
  fi
}

run_all() {
  echo "Running all predefined units (non-interactive)"
  # Placeholder list; extend as more units are defined
  local units=(
    "unit1-focus-dedupe"
    "unit2-green-hover"
    "unit3-red-neutral-hover"
    "unit4-report-transitions"
    "unit5-inherit-merge"
    "unit6-admin-cancel-shadow"
  )
  for u in "${units[@]}"; do
    echo "\n=== $u ==="
    run_unit "$u" || exit 1
  done
  echo "All units completed successfully."
}

main() {
  local cmd="${1:-}"
  case "$cmd" in
    dry-run)
      run_dry
      ;;
    unit)
      shift || true
      run_unit "${1:-}"
      ;;
    run-all)
      run_all
      ;;
    ""|-h|--help)
      print_usage
      ;;
    *)
      echo "Unknown command: $cmd" >&2
      print_usage
      exit 1
      ;;
  esac
}

main "$@"


