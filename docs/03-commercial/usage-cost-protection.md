# Inference & Operating Cost Protection

> **Status:** PROPOSED rule · cost figures TO VALIDATE · **Source:** Playbook v1.0 §7.8 · **Updated:** 2026-11-09
>
> **Related:** [Revenue streams](revenue-streams.md) · [Pricing & packages](pricing-and-packages.md) · [Risk register](../06-execution/risk-register.md)

## Rule

**Never include unlimited usage under a fixed support retainer without a separately modeled fair-use policy and cost cap.**

## Example estimate (TO VALIDATE)

An example previously discussed assumed **10,000 monthly AI requests**, each with **4,000 input tokens** and **800 output tokens**. The earlier conversation mentioned a roughly **10.9M-toman monthly inference estimate** using one particular gateway tariff; **this figure is not independently validated and must be recalculated using the actual provider, model, token prices, exchange rate, caching/retry behavior, and volume**.

For reference, that volume equals 40M input tokens and 8M output tokens per month.

## Preferred arrangements

1. Customer pays its own approved provider account where feasible.
2. Otherwise ENSA bills transparent metered usage with agreed limits and reporting.
3. Alert at spending thresholds and require approval to raise caps.
4. Distinguish model usage, agent tools, database, hosting/GPU, storage, messaging, and external integrations.
5. Never hide substantial variable consumption inside a small fixed support package.
