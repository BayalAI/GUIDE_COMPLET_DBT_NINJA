export interface Section {
  id: number
  title: string
  slug: string
  emoji: string
  description: string
  content: string
}

export const sections: Section[] = [
  {
    id: 1,
    title: 'Architecture Complète',
    slug: 'architecture',
    emoji: '🎨',
    description: 'Diagramme complet de bout en bout - Bronze, Silver, Gold layers',
    content: `# 🎨 Architecture Complète

## Architecture DBT Complète

### Les 3 Couches (Médaillon)

dbt utilise le modèle **Médaillon** : Bronze → Silver → Gold

#### 🧹 Couche Bronze (Staging)
- **Rôle**: Copie propre + renommage + typage
- **Matérialisation**: VIEWS (légères, pas de stockage)
- **Durée**: < 1 seconde
- **Exemples**: stg_customers, stg_orders

#### 🔗 Couche Silver (Intermediate)
- **Rôle**: Jointures, logique métier, agrégations
- **Matérialisation**: VIEWS (composition des bronze)
- **Durée**: ~5-10 secondes
- **Exemples**: int_customers_enriched, int_rfm_scores

#### ✨ Couche Gold (Marts)
- **Rôle**: Tables finales prêtes pour BI/Dashboards
- **Matérialisation**: TABLES (stockage physique, indexes)
- **Durée**: ~15-30 secondes (tables physiques)
- **Exemples**: dim_customers, fct_orders, mart_daily_revenue

### Flux de Données

\`\`\`
RAW DATA (Lac de données)
    ↓
BRONZE (Nettoyage)
    ↓
SILVER (Transformation)
    ↓
GOLD (BI Analytique)
    ↓
POWER BI / DASHBOARDS
\`\`\`

## Avantages de cette Architecture

✅ **Traçabilité** : Savoir d'où viennent les données
✅ **Tests** : Tester chaque couche indépendamment
✅ **Maintenance** : Facile à modifier
✅ **Performance** : Optimisation progressive
✅ **Collaboration** : Clair pour toute l'équipe`,
  },
  {
    id: 2,
    title: 'Installation Step-by-Step',
    slug: 'installation',
    emoji: '⚙️',
    description: 'Prérequis, création du projet, vérification installation',
    content: `# ⚙️ Installation Step-by-Step

## Prérequis

### 1. Python (3.9+)

\`\`\`powershell
python --version
# Résultat attendu: Python 3.9.x ou supérieur
\`\`\`

### 2. Installer dbt

Choisir selon votre base de données :

\`\`\`powershell
# DuckDB (local, parfait pour apprendre)
pip install dbt-duckdb

# Microsoft Fabric
pip install dbt-fabric

# Snowflake
pip install dbt-snowflake

# PostgreSQL
pip install dbt-postgres
\`\`\`

### 3. Vérifier l'installation

\`\`\`powershell
dbt --version
# Résultat attendu: dbt version: 1.5.x or higher
\`\`\`

## Créer votre premier projet

\`\`\`powershell
# Créer dossier
mkdir C:\\dbt_workspace
cd C:\\dbt_workspace

# Initialiser dbt
dbt init mon_projet_analytics

# Choisir la BD (1 = DuckDB)
# Choisir le chemin du profil
\`\`\`

## Structure créée

\`\`\`
mon_projet_analytics/
├── dbt_project.yml          # Configuration principale
├── README.md
├── models/                  # Modèles SQL
│   ├── staging/
│   ├── intermediate/
│   └── marts/
├── tests/                   # Tests personnalisés
├── macros/                  # Fonctions réutilisables
├── seeds/                   # Données CSV
├── snapshots/               # Historiques (SCD)
├── analyses/                # Requêtes ad-hoc
└── logs/                    # Logs d'exécution
\`\`\`

## Premiers pas

\`\`\`powershell
cd mon_projet_analytics

# 1. Vérifier la connexion
dbt debug

# 2. Charger les données de test
dbt seed

# 3. Exécuter les modèles
dbt run

# 4. Tester
dbt test

# 5. Générer la documentation
dbt docs generate
dbt docs serve  # http://localhost:8000
\`\`\``,
  },
  {
    id: 3,
    title: 'Configuration dbt_project.yml',
    slug: 'configuration',
    emoji: '⚙️',
    description: 'Fichier de configuration principal - expliqué ligne par ligne',
    content: `# ⚙️ Configuration dbt_project.yml

## Identité du Projet

\`\`\`yaml
name: 'mon_projet_analytics'
version: '1.0.0'
config-version: 2
profile: 'duckdb_profile'
\`\`\`

- **name**: Identifiant unique (snake_case)
- **version**: Suivi sémantique (MAJOR.MINOR.PATCH)
- **config-version**: Format interne dbt (toujours 2)
- **profile**: Référence vers profiles.yml

## Chemins des fichiers

\`\`\`yaml
model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]
seed-paths: ["seeds"]
macro-paths: ["macros"]
snapshot-paths: ["snapshots"]
\`\`\`

## Configuration par Layer

\`\`\`yaml
models:
  mon_projet_analytics:
    staging:
      +schema: staging
      +materialized: view
      +tags: ['staging', 'daily']
    
    intermediate:
      +schema: intermediate
      +materialized: view
      +tags: ['intermediate', 'daily']
    
    marts:
      +schema: marts
      +materialized: table
      +tags: ['marts', 'critical']
\`\`\`

## Variables Globales

\`\`\`yaml
vars:
  raw_database: 'raw'
  start_date: '2020-01-01'
  run_expensive_tests: false
\`\`\`

Utilisation: \`{{ var('raw_database', 'raw') }}\``,
  },
  {
    id: 4,
    title: 'Models SQL - Bronze',
    slug: 'models-bronze',
    emoji: '🧹',
    description: 'Modèles staging - nettoyage et typage des données brutes',
    content: `# 🧹 Models SQL - Couche Bronze

## Rôle de la couche Bronze

- Copier les données brutes de raw
- Renommer les colonnes pour cohérence
- Typer correctement (CAST)
- Nettoyer (LOWER, TRIM)
- Tests de qualité basiques

## Exemple: stg_customers

\`\`\`sql
{{/*
  MODÈLE: stg_customers
  LAYER: Bronze (Staging)
  
  PURPOSE: Staging brut de customers
  INPUT: raw.customers (source)
  OUTPUT: bronze.stg_customers (VIEW)
  GRAIN: 1 ligne = 1 client unique
*/}}

with source as (
    select * from {{ source('raw', 'customers') }}
),

renamed as (
    select
        -- Clés
        cast(customer_id as varchar(50)) as customer_id,
        
        -- Attributs
        cast(lower(email) as varchar(255)) as email,
        cast(trim(first_name) as varchar(100)) as first_name,
        cast(trim(last_name) as varchar(100)) as last_name,
        
        -- Dates
        cast(created_at as date) as customer_created_at,
        
        -- Métadonnées
        current_timestamp as dbt_loaded_at
        
    from source
)

select * from renamed
\`\`\`

## Bonnes pratiques Bronze

✅ **Toujours renommer** les colonnes source
✅ **Typer explicitement** chaque colonne
✅ **Nettoyer les strings** (LOWER, TRIM)
✅ **Documenter les transformations**
✅ **Utiliser des CTEs** pour clarté
✅ **Matérialiser en VIEW** (pas TABLE)`,
  },
  {
    id: 5,
    title: 'Models SQL - Silver',
    slug: 'models-silver',
    emoji: '🔗',
    description: 'Modèles intermediate - jointures et logique métier',
    content: `# 🔗 Models SQL - Couche Silver

## Rôle de la couche Silver

- Joindre les tables bronze
- Appliquer la logique métier
- Agréger les données
- Créer des flags et segments
- Améliorer les performances

## Exemple: int_customers_enriched

\`\`\`sql
{{/*
  MODÈLE: int_customers_enriched
  LAYER: Silver (Intermediate)
  
  PURPOSE: Profil client enrichi avec RFM
  INPUT: stg_customers, stg_orders
  OUTPUT: silver.int_customers_enriched (VIEW)
  GRAIN: 1 ligne = 1 client unique
*/}}

with customers as (
    select * from {{ ref('stg_customers') }}
),

orders as (
    select * from {{ ref('stg_orders') }}
    where order_status != 'cancelled'
),

-- Métriques RFM par client
customer_metrics as (
    select
        customer_id,
        count(distinct order_id) as total_orders,
        sum(total_amount) as lifetime_value,
        avg(total_amount) as avg_order_value,
        max(order_date) as last_order_date,
        datediff(day, max(order_date), current_date) as days_since_last_order
    from orders
    group by customer_id
),

-- Segmentation
segmentation as (
    select
        customer_id,
        case
            when lifetime_value >= 5000 then 'vip'
            when total_orders >= 10 then 'active'
            when days_since_last_order > 180 then 'churned'
            else 'prospect'
        end as customer_segment
    from customer_metrics
),

final as (
    select
        c.customer_id,
        c.email,
        c.first_name + ' ' + c.last_name as full_name,
        coalesce(cm.total_orders, 0) as total_orders,
        coalesce(cm.lifetime_value, 0) as lifetime_value,
        s.customer_segment,
        case when cm.total_orders > 0 then 1 else 0 end as has_ordered
    from customers c
    left join customer_metrics cm on c.customer_id = cm.customer_id
    left join segmentation s on c.customer_id = s.customer_id
)

select * from final
\`\`\`

## Concepts clés

**CTEs** : Structurer les transformations logiquement
**LEFT JOIN** : Garder tous les clients (même sans commande)
**CASE WHEN** : Créer des segments
**GROUP BY** : Agréger par client`,
  },
  {
    id: 6,
    title: 'Models SQL - Gold',
    slug: 'models-gold',
    emoji: '✨',
    description: 'Modèles finaux - dimensions et facts pour BI',
    content: `# ✨ Models SQL - Couche Gold

## Rôle de la couche Gold

- Tables finales optimisées pour BI
- Dimensions (DIM_*) : lentement changeantes
- Facts (FCT_*) : événements/transactions
- Indexes pour performance
- Matérialisées en TABLE

## Exemple: dim_customers

\`\`\`sql
{{
    config(
        materialized='table',
        unique_key='customer_id',
        tags=['gold', 'dimension', 'critical'],
        indexes=[
            {'columns': ['customer_id'], 'unique': true},
            {'columns': ['customer_segment']}
        ]
    )
}}

with customers as (
    select * from {{ ref('int_customers_enriched') }}
),

final as (
    select
        -- Clés
        customer_id,
        
        -- Attributs
        full_name as customer_name,
        email as customer_email,
        
        -- Segmentation
        customer_segment,
        
        -- Métriques
        total_orders,
        lifetime_value,
        avg_order_value,
        
        -- Flags business
        case when lifetime_value >= 1000 then 1 else 0 end as is_high_value,
        
        -- Métadonnées
        current_timestamp as created_at
        
    from customers
)

select * from final
\`\`\`

## Exemple: fct_orders (Facts)

\`\`\`sql
{{
    config(
        materialized='table',
        unique_key='order_id'
    )
}}

with orders as (
    select 
        order_id,
        customer_id,
        product_id,
        order_date,
        total_amount,
        profit_amount
    from {{ ref('int_orders_enriched') }}
)

select * from orders
\`\`\`

## Bonnes pratiques Gold

✅ **Matérialiser en TABLE** (pas VIEW)
✅ **Ajouter des indexes** sur colonnes clés
✅ **Naming** : dim_* et fct_*
✅ **unique_key** : pour SCD ou incremental
✅ **Documenter le grain** : "1 ligne = ?"`,
  },
  {
    id: 7,
    title: 'Tests & Qualité',
    slug: 'tests',
    emoji: '✅',
    description: 'Tests YAML, tests SQL personnalisés, best practices',
    content: `# ✅ Tests & Qualité de Données

## Tests YAML Basiques

\`\`\`yaml
models:
  - name: stg_customers
    columns:
      - name: customer_id
        tests:
          - unique
          - not_null
      
      - name: email
        tests:
          - unique
          - not_null
      
      - name: country
        tests:
          - accepted_values:
              values: ['FR', 'DE', 'US', 'UK']
\`\`\`

## Tests Relationnels (FK)

\`\`\`yaml
- name: order_id
  tests:
    - unique
    - not_null

- name: customer_id
  tests:
    - relationships:
        to: ref('stg_customers')
        field: customer_id
\`\`\`

## Tests SQL Personnalisés

\`\`\`sql
-- File: tests/assert_no_orphan_orders.sql
-- Vérifier qu'il n'y a pas de commandes sans client

{{
    config(severity: 'error', tags: ['assert', 'orders'])
}}

select count(*) as orphan_count
from {{ ref('fct_orders') }} o
left join {{ ref('dim_customers') }} c 
    on o.customer_id = c.customer_id
where c.customer_id is null

-- ✅ PASS: 0 lignes (pas d'orphans)
-- ❌ FAIL: > 0 lignes (orphans trouvés!)
\`\`\`

## Exécution des tests

\`\`\`powershell
# Tous les tests
dbt test

# Tests pour un modèle
dbt test --select stg_customers

# Tests avec un tag
dbt test --select tag:critical

# Tests avec verbose
dbt test --debug
\`\`\`

## Exemple: Test de Plage

\`\`\`yaml
- name: total_amount
  tests:
    - not_null
    - dbt_utils.accepted_range:
        min_value: 0
        max_value: 1000000
\`\`\``,
  },
  {
    id: 8,
    title: 'Macros & Jinja',
    slug: 'macros',
    emoji: '⚙️',
    description: 'Macros réutilisables, boucles Jinja, templates',
    content: `# ⚙️ Macros & Jinja

## Macro Simple

\`\`\`sql
-- macros/convert_currency.sql

{% macro convert_cents_to_euros(column_name) %}
    round({{ column_name }} / 100.0, 2)
{% endmacro %}

-- Utilisation:
-- SELECT
--     order_id,
--     {{ convert_cents_to_euros('amount_cents') }} as amount_eur
-- FROM orders
\`\`\`

## Macro avec Boucle

\`\`\`sql
-- macros/generate_column_list.sql

{% macro generate_column_list(columns, operation) %}
    {% for column in columns %}
        {% if operation == 'round' %}
            round({{ column }}, 2) as {{ column }}
        {% elif operation == 'lower' %}
            lower({{ column }}) as {{ column }}
        {% endif %}
        
        {% if not loop.last %},{% endif %}
    {% endfor %}
{% endmacro %}

-- Utilisation:
-- SELECT
--     order_id,
--     {{ generate_column_list(['amount', 'tax', 'discount'], 'round') }}
-- FROM orders
\`\`\`

## Test Générique

\`\`\`sql
-- macros/test_custom_range.sql

{% test custom_range(model, column_name, min_value=0, max_value=null) %}
    select count(*) as failing_rows
    from {{ model }}
    where
        ({{ column_name }} < {{ min_value }})
        {% if max_value is not none %}
            or ({{ column_name }} > {{ max_value }})
        {% endif %}
    having count(*) > 0
{% endtest %}

-- Utilisation:
-- tests:
--   - custom_range:
--       min_value: 0
--       max_value: 1000
\`\`\`

## Variables Jinja

\`\`\`sql
-- Accéder aux variables
{{ var('raw_database', 'raw') }}

-- Vérifier l'environnement
{% if target.name == 'prod' %}
    -- Code production
{% else %}
    -- Code dev
{% endif %}

-- Invocation ID (unique par run)
'{{ invocation_id }}' as dbt_batch_id
\`\`\``,
  },
  {
    id: 9,
    title: 'Snapshots & SCD',
    slug: 'snapshots',
    emoji: '📸',
    description: 'Snapshots pour SCD Type 2 - tracker les changements',
    content: `# 📸 Snapshots & SCD (Slowly Changing Dimensions)

## Qu'est-ce qu'un Snapshot?

Capture l'historique complet d'une dimension avec validité temporelle.

**Problème** : Si on met à jour une dimension, l'historique est perdu!

**Solution** : Créer une nouvelle ligne pour chaque changement.

## Exemple: customers_snapshot

\`\`\`sql
-- snapshots/customers_snapshot.sql

{{
    config(
        target_schema='snapshots',
        unique_key='customer_id',
        strategy='timestamp',
        updated_at='updated_at'
    )
}}

select
    customer_id,
    email,
    first_name,
    last_name,
    country,
    customer_segment,
    created_at,
    updated_at
from {{ ref('stg_customers') }}
\`\`\`

## Résultat Généré

\`\`\`
customer_id | country | dbt_valid_from | dbt_valid_to | dbt_scd_id
─────────────────────────────────────────────────────────────────
C001        | FR      | 2021-01-01     | 2023-06-15   | uuid1
C001        | DE      | 2023-06-15     | NULL         | uuid2
\`\`\`

**Signification** :
- Client C001 habitait en FR jusqu'au 2023-06-15
- Puis a changé en DE à partir du 2023-06-15
- NULL dans dbt_valid_to = version actuelle

## Utilisation

\`\`\`powershell
# Exécuter les snapshots
dbt snapshot

# Dans un modèle:
select *
from {{ ref('customers_snapshot') }}
where dbt_valid_to is null  -- Version actuelle
\`\`\`

## Stratégies

**timestamp** : Comparer une colonne timestamp
**check** : Comparer toutes les colonnes`,
  },
  {
    id: 10,
    title: 'Seeds & Données',
    slug: 'seeds',
    emoji: '🌱',
    description: 'Charger des fichiers CSV en base - lookup tables',
    content: `# 🌱 Seeds & Données

## Qu'est-ce qu'un Seed?

Fichier CSV chargé directement en base de données.

**Utilité** : Lookup tables, référentiels, données statiques.

## Créer un Seed

Créer un fichier CSV dans \`seeds/\`:

\`\`\`csv
-- seeds/country_mapping.csv

country_code,country_name,region,currency
FR,France,Europe,EUR
DE,Germany,Europe,EUR
US,United States,North America,USD
CA,Canada,North America,CAD
GB,United Kingdom,Europe,GBP
IT,Italy,Europe,EUR
ES,Spain,Europe,EUR
JP,Japan,Asia,JPY
\`\`\`

## Configuration

\`\`\`yaml
# dbt_project.yml

seeds:
  mon_projet_analytics:
    +schema: seeds
    +quote_columns: true
    country_mapping:
      +unique_key: 'country_code'
\`\`\`

## Charger les Seeds

\`\`\`powershell
# Charger TOUS les seeds
dbt seed

# Charger UN seed spécifique
dbt seed --select country_mapping

# Forcer le rechargement
dbt seed --full-refresh
\`\`\`

## Utiliser dans un Modèle

\`\`\`sql
with orders as (
    select * from {{ source('raw', 'orders') }}
),

country_mapping as (
    select * from {{ ref('country_mapping') }}
),

enriched as (
    select
        o.order_id,
        o.country_code,
        cm.country_name,
        cm.region,
        cm.currency
    from orders o
    left join country_mapping cm on o.country_code = cm.country_code
)

select * from enriched
\`\`\``,
  },
  {
    id: 11,
    title: 'Workflows & Orchestration',
    slug: 'workflows',
    emoji: '⚙️',
    description: 'Pipeline dev, pipeline production, scheduling',
    content: `# ⚙️ Workflows & Orchestration

## Workflow Dev (Quotidien local)

\`\`\`powershell
# 1. Charger les données de test
dbt seed

# 2. Vérifier la connexion
dbt debug

# 3. Exécuter un modèle spécifique
dbt run --select stg_customers

# 4. Tester
dbt test --select stg_customers

# 5. Générer la documentation
dbt docs generate
dbt docs serve  # http://localhost:8000

# 6. Itérer jusqu'à satisfaction
\`\`\`

## Workflow Prod (Pipeline)

### 1. Chargement Bronze (05:00 AM)
\`\`\`powershell
dbt run --select tag:bronze
dbt test --select tag:bronze
dbt source freshness
\`\`\`

### 2. Transformation Silver (08:00 AM)
\`\`\`powershell
dbt run --select tag:silver
dbt test --select tag:silver
\`\`\`

### 3. Analytique Gold (22:00 PM)
\`\`\`powershell
dbt run --select tag:gold
dbt test --select tag:gold
\`\`\`

### 4. Finalisation (23:00 PM)
\`\`\`powershell
dbt docs generate
dbt snapshot
\`\`\`

## Sélection de Modèles

\`\`\`powershell
# Par modèle
dbt run --select stg_customers

# Par tag
dbt run --select tag:staging

# Par chemin
dbt run --select models/staging

# Dépendances
dbt run --select +int_customers_enriched+

# Intersection
dbt run --select path.to.model tag:production
\`\`\`

## Paramètres Courants

\`\`\`powershell
# Threads (parallélisation)
dbt run --threads 4

# Full refresh
dbt run --full-refresh

# Exclude
dbt run --exclude tag:expensive

# Debug
dbt run --debug

# Target (dev/prod)
dbt run --target prod
\`\`\``,
  },
  {
    id: 12,
    title: 'Astuces & Best Practices',
    slug: 'tips',
    emoji: '🥋',
    description: 'Tips ninja - performance, debugging, patterns',
    content: `# 🥋 Astuces & Best Practices

## Performance

### Limiter en Dev
\`\`\`sql
-- ❌ MAUVAIS : Tester avec 100M lignes
select * from {{ source('raw', 'orders') }}

-- ✅ BON : Dernière semaine seulement
where order_date >= current_date - 7
\`\`\`

### Ajouter des Indexes
\`\`\`yaml
config:
  indexes:
    - columns: ['customer_id']
      unique: true
    - columns: ['order_date']
\`\`\`

## Debugging

### Voir le SQL compilé
\`\`\`powershell
dbt compile --select stg_customers
# Affiche target/compiled/.../stg_customers.sql
\`\`\`

### Verbose Mode
\`\`\`powershell
dbt run --debug
dbt test --debug
\`\`\`

## Git Workflow

\`\`\`bash
# Feature branch
git checkout -b feature/add-segmentation

# Développer et tester
dbt run
dbt test

# Commit
git add models/
git commit -m "Add RFM segmentation"
git push origin feature/add-segmentation

# Pull request pour review
\`\`\`

## Configuration Conditionnelle

\`\`\`sql
{{
    config(
        full_refresh=(target.name == 'prod')
    )
}}

with source as (
    select * from {{ source('raw', 'orders') }}
    {% if target.name == 'dev' %}
        where order_date >= current_date - 7
    {% endif %}
)
select * from source
\`\`\`

## Dépendances Explicites

\`\`\`sql
-- Définir un modèle A qui dépend de B
-- Peu importe l'ordre des fichiers, dbt exécutera B d'abord

{% set required_model = ref('upstream_model') %}

select ...
from {{ ref('upstream_model') }}  -- dépendance
\`\`\`

## Test Anomaly Detection

\`\`\`yaml
- name: daily_revenue
  tests:
    # Moyenne entre 1000€ et 100000€?
    - dbt_expectations.expect_column_mean_to_be_between:
        min_value: 1000
        max_value: 100000
\`\`\``,
  },
]
