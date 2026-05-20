# Talentera Command Center v2

React + Vite + Supabase dashboard for Acquisition, Retention, Upsell, P&L, Marketing, and Data Quality.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with Supabase URL and anon/publishable key only. Never add service_role, HubSpot token, or Google credentials to frontend/GitHub.

## Required views

- vw_dashboard_global_kpis
- vw_acquisition_country_coverage
- vw_owner_activity_summary
- vw_deal_pipeline_summary
- vw_retention_upsell_summary
- vw_retention_upsell_clients
- vw_pnl_monthly
- vw_marketing_campaign_funnel
- vw_retention_renewal_summary
- vw_data_quality_issues
