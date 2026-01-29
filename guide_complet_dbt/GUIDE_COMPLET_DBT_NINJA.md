# 📚 GUIDE DBT COMPLET - DU JUNIOR AU NINJA 🥋

> Guide complet avec commentaires détaillés, diagrammes, astuces ninja, et workflows de bout en bout

---

## 📑 TABLE DES MATIÈRES

1. [Architecture Complète](#1-architecture-complète)
2. [Installation Step-by-Step](#2-installation-step-by-step)
3. [Configuration avec Commentaires](#3-configuration-avec-commentaires)
4. [Models SQL Commentés](#4-models-sql-commentés)
5. [Tests Expliqués](#5-tests-expliqués)
6. [Macros et Boucles Jinja](#6-macros-et-boucles-jinja)
7. [Snapshots (SCD Type 2)](#7-snapshots-scd-type-2)
8. [Seeds et Données](#8-seeds-et-données)
9. [Workflows & Orchestration](#9-workflows--orchestration)
10. [Astuces Ninja 🥋](#10-astuces-ninja-)
11. [Troubleshooting](#11-troubleshooting)

---

## 1. ARCHITECTURE COMPLÈTE

### 🎨 Diagramme Complet de Bout en Bout

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                                                               ┃
┃                    📊 ARCHITECTURE DBT COMPLÈTE                               ┃
┃                                                                               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  📥 DONNÉES SOURCES                                                             │
│  ──────────────────                                                             │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  MICROSOFT FABRIC / LAKEHOUSE                                           │   │
│  │  ─────────────────────────────                                          │   │
│  │                                                                         │   │
│  │  Schema: raw                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │   │
│  │  │  customers   │  │  orders      │  │  products    │  ← TABLES BRUTES│   │
│  │  │  (10M rows)  │  │  (50M rows)  │  │  (100K rows) │                 │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │   │
│  │                                                                         │   │
│  │  • Créées par: ETL external (Synapse, Data Factory)                    │   │
│  │  • Données: RAW, non nettoyées, doublons possibles                     │   │
│  │  • Format: DATETIME, strings imbriquées, NULLs partout                 │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                  │
│                              │ dbt déclare avec {{ source() }}                  │
│                              ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │  models/bronze/_sources.yml                                             │   │
│  │  ────────────────────────────                                           │   │
│  │  • Déclare raw.customers, raw.orders, raw.products                     │   │
│  │  • Ajoute tests de qualité directement sur les sources                 │   │
│  │  • Monitore la fraîcheur (freshness check)                             │   │
│  │  • Documente chaque colonne                                             │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                  │
└──────────────────────────────┼──────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  🧹 COUCHE BRONZE (STAGING / NETTOYAGE)                                          │
│  ────────────────────────────────────────                                        │
│  Rôle: Copie propre + renommage + typage                                        │
│  Matérialisation: VIEWS (légères, pas de stockage)                              │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  Schema: bronze                                                          │   │
│  │                                                                         │   │
│  │  ┌─────────────────────┐  ┌─────────────────────┐  ┌───────────────┐  │   │
│  │  │  stg_customers      │  │  stg_orders         │  │  stg_products │  │   │
│  │  │  (VIEW)             │  │  (VIEW)             │  │  (VIEW)       │  │   │
│  │  │                     │  │                     │  │               │  │   │
│  │  │ • customer_id       │  │ • order_id          │  │ • product_id  │  │   │
│  │  │ • email             │  │ • customer_id       │  │ • name        │  │   │
│  │  │ • first_name        │  │ • order_date (DATE) │  │ • price       │  │   │
│  │  │ • last_name         │  │ • amount (DECIMAL)  │  │ • cost        │  │   │
│  │  │ • country           │  │ • status            │  │ • category    │  │   │
│  │  │                     │  │ • flags calculés    │  │               │  │   │
│  │  └─────────────────────┘  └─────────────────────┘  └───────────────┘  │   │
│  │                                                                         │   │
│  │  Transformations appliquées:                                           │   │
│  │  • Renommage: status → order_status                                   │   │
│  │  • Typage: CAST(created_at AS DATE)                                   │   │
│  │  • Nettoyage: LOWER(email), TRIM(name)                                │   │
│  │  • Flags: CASE WHEN ... END                                            │   │
│  │  • Agrégations: COUNT(*), SUM(), MAX()                                │   │
│  │                                                                         │   │
│  │  Tests appliqués:                                                      │   │
│  │  • unique, not_null, accepted_values, relationships                   │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                  │
│                              │ dbt lit avec {{ ref() }}                         │
│                              ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  _bronze_models.yml                                                      │   │
│  │  ──────────────────                                                      │   │
│  │  • Tests spécifiques aux modèles bronze                                 │   │
│  │  • Documentation de chaque colonne                                       │   │
│  │  • Acceptation des valeurs possibles                                    │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  🔗 COUCHE SILVER (TRANSFORMATION / ENRICHISSEMENT)                              │
│  ─────────────────────────────────────────────────                              │
│  Rôle: Jointures, logique métier, agrégations                                   │
│  Matérialisation: VIEWS (composition des bronze)                                │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  Schema: silver                                                          │   │
│  │                                                                         │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  int_customers_enriched (VIEW)                                  │  │   │
│  │  │  ───────────────────────────────                                │  │   │
│  │  │                                                                 │  │   │
│  │  │  Joins:                                                         │  │   │
│  │  │  └─ stg_customers ──┬──┐                                       │  │   │
│  │  │                     │  │                                       │  │   │
│  │  │  └─ stg_orders ─────┘  └──→ LEFT JOIN on customer_id         │  │   │
│  │  │                                                                 │  │   │
│  │  │  Agrégations (RFM):                                             │  │   │
│  │  │  • total_orders = COUNT(DISTINCT order_id)                     │  │   │
│  │  │  • lifetime_value = SUM(amount)                                │  │   │
│  │  │  • avg_order_value = AVG(amount)                               │  │   │
│  │  │  • days_since_last_order = DATEDIFF(day, max_date, TODAY)     │  │   │
│  │  │                                                                 │  │   │
│  │  │  Segmentation:                                                  │  │   │
│  │  │  • CASE WHEN lifetime_value >= 5000 THEN 'VIP'                │  │   │
│  │  │  • CASE WHEN total_orders > 10 THEN 'Active'                  │  │   │
│  │  │  • Etc.                                                         │  │   │
│  │  │                                                                 │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  int_orders_enriched (VIEW)                                    │  │   │
│  │  │  ──────────────────────────                                    │  │   │
│  │  │  • Enrichit chaque commande avec infos produit                │  │   │
│  │  │  • Calcule marge unitaire, total_discount, etc.              │  │   │
│  │  │                                                                 │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │  int_products_enriched (VIEW)                                  │  │   │
│  │  │  ────────────────────────────                                  │  │   │
│  │  │  • Métriques de vente par produit                              │  │   │
│  │  │  • Margin%, revenue, bestseller flags                          │  │   │
│  │  │                                                                 │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                  │
│                              │ dbt lit avec {{ ref() }}                         │
│                              ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  _silver_models.yml                                                      │   │
│  │  ──────────────────                                                      │   │
│  │  • Tests métier complexes                                               │   │
│  │  • Contrats de données                                                   │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│  ✨ COUCHE GOLD (ANALYTIQUE / BI)                                                │
│  ────────────────────────────────                                               │
│  Rôle: Tables finales prêtes pour BI/Dashboards                                 │
│  Matérialisation: TABLES (stockage physique, indexes)                            │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  Schema: gold                                                            │   │
│  │                                                                         │   │
│  │  DIMENSIONS (Cibles BI):                                                │   │
│  │                                                                         │   │
│  │  ┌────────────────────────┐  ┌────────────────────────┐                │   │
│  │  │  dim_customers (TBL)   │  │  dim_products (TBL)    │                │   │
│  │  │  unique_key: cust_id   │  │  unique_key: prod_id   │                │   │
│  │  │                        │  │                        │                │   │
│  │  │ Grain: 1 row=1 cust    │  │ Grain: 1 row=1 prod    │                │   │
│  │  │                        │  │                        │                │   │
│  │  │ • customer_id (PK)     │  │ • product_id (PK)      │                │   │
│  │  │ • full_name            │  │ • product_name         │                │   │
│  │  │ • email                │  │ • category             │                │   │
│  │  │ • total_orders         │  │ • price                │                │   │
│  │  │ • lifetime_value       │  │ • total_revenue        │                │   │
│  │  │ • customer_segment     │  │ • product_tier         │                │   │
│  │  │ • is_high_value        │  │ • margin_percent       │                │   │
│  │  └────────────────────────┘  └────────────────────────┘                │   │
│  │                                                                         │   │
│  │  FACTS (Évènements):                                                    │   │
│  │                                                                         │   │
│  │  ┌────────────────────────┐                                            │   │
│  │  │  fct_orders (TABLE)    │                                            │   │
│  │  │  unique_key: order_id  │                                            │   │
│  │  │                        │                                            │   │
│  │  │ Grain: 1 row=1 order   │                                            │   │
│  │  │                        │                                            │   │
│  │  │ • order_id (PK)        │                                            │   │
│  │  │ • customer_id (FK)     │  ← Référence dim_customers                │   │
│  │  │ • product_id (FK)      │  ← Référence dim_products                 │   │
│  │  │ • order_date           │                                            │   │
│  │  │ • total_amount         │                                            │   │
│  │  │ • order_status         │                                            │   │
│  │  │ • profit_amount        │                                            │   │
│  │  │ • indexes: order_date  │                                            │   │
│  │  └────────────────────────┘                                            │   │
│  │                                                                         │   │
│  │  MARTS (Rapports spécifiques):                                          │   │
│  │                                                                         │   │
│  │  ┌────────────────────────┐  ┌────────────────────────┐                │   │
│  │  │ mart_daily_revenue     │  │ mart_customer_cohorts  │                │   │
│  │  │ grain: 1 row=1 jour    │  │ grain: cohort+segment  │                │   │
│  │  │                        │  │                        │                │   │
│  │  │ • date (PK)            │  │ • cohort_date (PK)     │                │   │
│  │  │ • total_revenue        │  │ • customer_segment     │                │   │
│  │  │ • order_count          │  │ • churn_rate           │                │   │
│  │  │ • profit_margin        │  │ • arpu                 │                │   │
│  │  └────────────────────────┘  └────────────────────────┘                │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                  │
│                              │ Power BI / Tableau / Looker                      │
│                              │ Créent des rapports/dashboards                   │
│                              ▼                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  📊 DASHBOARDS BI                                                        │   │
│  │  ─────────────                                                           │   │
│  │  • Sales Dashboard: Revenue by product, customer segment                │   │
│  │  • Customer Analytics: LTV, churn, cohort analysis                      │   │
│  │  • Operations: Daily trends, margins, SLAs                              │   │
│  │                                                                         │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. INSTALLATION STEP-BY-STEP

### Étape 1: Prérequis

```powershell
# ======================================
# 1️⃣ VÉRIFIER PYTHON (3.9+)
# ======================================

# Ouvrir PowerShell et taper:
python --version

# Résultat attendu: Python 3.9.x, 3.10.x, 3.11.x, ou 3.12.x
# ✅ Si OK, continue
# ❌ Si erreur: installer Python depuis python.org

# ======================================
# 2️⃣ INSTALLER DBT (pour DuckDB local)
# ======================================

# Option A: DuckDB (parfait pour apprendre, gratuit)
pip install dbt-duckdb

# Option B: Microsoft Fabric (production)
pip install dbt-fabric

# Option C: Snowflake (cloud data warehouse populaire)
pip install dbt-snowflake

# ======================================
# 3️⃣ VÉRIFIER L'INSTALLATION
# ======================================

dbt --version

# Résultat attendu:
# dbt version: 1.5.x or higher
# ✅ Si OK, vous êtes prêt!
```

### Étape 2: Créer le projet

```powershell
# ======================================
# CRÉER LE DOSSIER DE TRAVAIL
# ======================================

# Créer dossier principal
mkdir C:\dbt_workspace
cd C:\dbt_workspace

# Initialiser un projet dbt
# (cela crée l'arborescence complète)
dbt init mon_projet_analytics

# Choisir le type de base de données:
# [1] duckdb
# [2] fabric
# [3] snowflake
# → Choisir 1 pour DuckDB (le plus simple pour apprendre)

# ======================================
# RÉSULTAT
# ======================================
# Dossier créé: C:\dbt_workspace\mon_projet_analytics\
# Avec la structure complète de dbt!
```

---

## 3. CONFIGURATION AVEC COMMENTAIRES

### 3.1 dbt_project.yml - COMPLET COMMENTÉ

**Emplacement**: `C:\dbt_workspace\mon_projet_analytics\dbt_project.yml`

```yaml
# ===============================================
# DBT PROJECT CONFIGURATION
# ===============================================
# Ce fichier est le CŒUR de votre projet dbt
# Il dit à dbt comment fonctionner:
# - Où trouver les fichiers
# - Quoi matérialiser (TABLE vs VIEW)
# - Quels sont les schémas par défaut
# - Quelles variables globales utiliser

# ===============================================
# 1️⃣ IDENTITÉ DU PROJET
# ===============================================

# name = Identifiant unique du projet (IMPORTANT!)
# • Doit être en snake_case (minuscules + underscore)
# • Utilisé dans ref() pour référencer les modèles
# • Exemple correct: mon_projet_analytics
# • Exemple INCORRECT: Mon Projet Analytics (espaces!)
name: 'mon_projet_analytics'

# version = Versioning sémantique du projet
# • Format: MAJOR.MINOR.PATCH
# • Incrémente à chaque changement
# • Utile pour tracker l'évolution du projet
version: '1.0.0'

# config-version = Format interne dbt (toujours 2)
# • NE PAS changer cette valeur
# • C'est la version du format dbt_project.yml
config-version: 2

# ===============================================
# 2️⃣ PROFIL DE CONNEXION
# ===============================================

# profile = Référence vers le fichier profiles.yml
# • Ce fichier est dans ~/.dbt/profiles.yml (séparé!)
# • Contient les credentials de connexion BD
# • La valeur ici doit correspondre à la clé dans profiles.yml
# 
# Exemple:
# profiles.yml:
#   duckdb_profile:
#     target: dev
# dbt_project.yml:
#   profile: 'duckdb_profile'  ← DOIT CORRESPONDRE!

profile: 'duckdb_profile'

# ===============================================
# 3️⃣ CHEMINS DES FICHIERS
# ===============================================

# Où dbt cherche les différents fichiers
# Ces chemins sont relatifs à ce dossier

# Modèles SQL (cœur du projet)
# Convention: tous les .sql dans models/ et sous-dossiers
model-paths: ["models"]

# Analyses ad-hoc (requêtes non-exécutées par dbt run)
# Utilisées pour l'exploration, rapports ponctuels
analysis-paths: ["analyses"]

# Tests de qualité de données
# Fichiers .sql avec tests personnalisés
test-paths: ["tests"]

# Fichiers CSV à charger dans la BD
# Exemple: customers.csv, products.csv
seed-paths: ["seeds"]

# Macros Jinja réutilisables (fonctions SQL)
# Exemple: generate_dates(), cents_to_dollars()
macro-paths: ["macros"]

# Snapshots (capture historique, SCD Type 2)
# Exemple: customers_snapshot.sql
snapshot-paths: ["snapshots"]

# ===============================================
# 4️⃣ NETTOYAGE DES FICHIERS GÉNÉRÉS
# ===============================================

# Quand vous exécutez "dbt clean", ces dossiers sont supprimés
# Ils sont auto-générés, donc c'est safe de les supprimer

clean-targets:
  - "target"        # Fichiers SQL compilés par dbt
  - "dbt_packages"  # Packages installés via packages.yml

# ===============================================
# 5️⃣ CONFIGURATION PAR LAYER (STRUCTURE)
# ===============================================

# models = Configuration pour TOUS les modèles
# Organisés par layer: staging, intermediate, marts

models:
  # Clé: nom du projet (doit = name ci-dessus)
  mon_projet_analytics:
    
    # ─────────────────────────────────────────
    # COUCHE 1: STAGING (Nettoyage brut)
    # ─────────────────────────────────────────
    # • Rôle: Copie propre + renommage + typage
    # • Matérialisation: VIEW (léger, pas de stockage)
    # • Exemples: stg_customers, stg_orders
    # • Durée exécution: <1 seconde (pas de calcul)
    
    staging:
      # +schema = Dans quel schema créer les tables/views
      # Si dbt_project.yml dit schema: staging
      # Et le target dans profiles.yml dit schema: dev
      # → Résultat: dbt_dev_staging
      +schema: staging
      
      # +materialized = Type de matérialisation
      # • view: Virtuelle, calculée à la demande
      # • table: Physique, stockée en BD
      # • incremental: Ajoute seulement les nouvelles lignes
      # • dynamic_table: Azure Fabric (refresh automatique)
      +materialized: view
      
      # +tags = Labels pour filtrer l'exécution
      # Utilisés avec: dbt run --select tag:staging
      # Utile pour: exécuter juste staging en dev
      +tags: ['staging', 'daily']
    
    # ─────────────────────────────────────────
    # COUCHE 2: INTERMEDIATE (Transformations)
    # ─────────────────────────────────────────
    # • Rôle: Jointures, logique métier, agrégations
    # • Matérialisation: VIEW (composé de staging)
    # • Exemples: int_customer_orders, int_rfm_scores
    # • Utilité: Réutilisable, logique testée
    
    intermediate:
      +schema: intermediate
      +materialized: view
      +tags: ['intermediate', 'daily']
    
    # ─────────────────────────────────────────
    # COUCHE 3: MARTS (Tables finales BI)
    # ─────────────────────────────────────────
    # • Rôle: Dimensions et Facts prêtes pour BI
    # • Matérialisation: TABLE (stockée physiquement)
    # • Exemples: dim_customers, fct_orders
    # • Utilité: Connectées aux dashboards Power BI
    # • Performance: Optimisée avec indexes
    
    marts:
      +schema: marts
      +materialized: table
      +tags: ['marts', 'nightly', 'critical']

# ===============================================
# 6️⃣ SEEDS (Fichiers CSV)
# ===============================================

# Configuration pour les fichiers CSV à charger

seeds:
  mon_projet_analytics:
    # Schema où charger les CSV
    +schema: seeds
    
    # Si TRUE: Quote les noms de colonnes avec des guillemets
    # Utile si vos colonnes ont des espaces ou caractères spéciaux
    +quote_columns: true

# ===============================================
# 7️⃣ VARIABLES GLOBALES
# ===============================================

# Variables accessible dans tous les modèles via {{ var() }}
# Format: var('nom', 'valeur_par_défaut')

vars:
  # Base de données raw par défaut
  # Utilisation: {{ var('raw_database', 'raw') }}
  raw_database: 'raw'
  
  # Date de début de l'historique
  # Utilisée pour filtrer les données anciennes
  # Utilisation: WHERE order_date >= '{{ var('start_date') }}'
  start_date: '2020-01-01'
  
  # Flag: exécuter les tests lourds?
  # Tests coûteux en temps/ressources
  # Utilisé en dev: false, en prod: true
  run_expensive_tests: false

# ===============================================
# 8️⃣ OPTIONS AVANCÉES (Optionnel)
# ===============================================

# Require minimum dbt version
# Garanti que le projet fonctionne avec dbt >= 1.0.0
require-dbt-version: [">=1.0.0"]
```

### 3.2 profiles.yml - POUR DUCKDB

**Emplacement**: `C:\Users\VOTRE_NOM\.dbt\profiles.yml`

**⚠️ CE FICHIER CONTIENT DES SECRETS - NE PAS COMMITTER SUR GIT!**

```yaml
# ===============================================
# PROFILES.YML - CONNEXIONS AUX BASES DE DONNÉES
# ===============================================
# Ce fichier dit à dbt COMMENT se connecter à votre BD
# Chaque profil = une connexion (dev, prod, test)

# Nom du profil (doit correspondre à dbt_project.yml)
duckdb_profile:
  # target = quel output utiliser par défaut
  # Si target: dev → dbt utilise la config "dev"
  # Changeable avec: dbt run --target prod
  target: dev
  
  # outputs = différentes configurations possibles
  outputs:
    
    # ─────────────────────────────────────
    # OUTPUT 1: DEV (Développement local)
    # ─────────────────────────────────────
    dev:
      # type = type de base de données
      # Options: duckdb, fabric, snowflake, postgres, etc.
      type: duckdb
      
      # path = chemin du fichier DuckDB
      # DuckDB crée un fichier .duckdb contenant tout
      # Peut être relatif: ./data.duckdb
      # Ou absolu: C:/dbt/data.duckdb
      path: './dbt_data.duckdb'
      
      # schema = schéma par défaut
      # dbt crée les tables dans dbt_dev_staging, dbt_dev_marts, etc.
      # Le préfixe "dbt_" vient du nom du profil
      schema: dev
      
      # threads = parallélisation
      # Nombre de modèles exécutés simultanément
      # 4 = recommandé pour dev
      # 8 = pour prod gros projet
      threads: 4

    # ─────────────────────────────────────
    # OUTPUT 2: PROD (Production)
    # ─────────────────────────────────────
    prod:
      type: duckdb
      path: './dbt_data_prod.duckdb'
      schema: prod
      threads: 8

# ═══════════════════════════════════════════════════════════════════════════════
# ALTERNATIVE: MICROSOFT FABRIC
# ═══════════════════════════════════════════════════════════════════════════════

fabric_profile:
  target: dev
  outputs:
    dev:
      type: fabric
      # Driver SQL Server (obligatoire pour Fabric)
      driver: 'ODBC Driver 18 for SQL Server'
      
      # Server = SQL Endpoint de votre workspace Fabric
      # Format: xxxxxxx.datawarehouse.fabric.microsoft.com
      # Trouvé dans Fabric Portal > Workspace > SQL Endpoint
      server: '{{ env_var("FABRIC_SERVER") }}'
      
      # Database = Warehouse Fabric
      database: '{{ env_var("FABRIC_DATABASE") }}'
      
      # Schema par défaut où dbt écrit
      schema: dbt_dev
      
      # Type d'authentification
      # CLI = utilise "az login" (Azure CLI)
      # serviceprincipal = utilise credentials (production)
      authentication: CLI
      
      # Nombre de connections parallèles
      threads: 4
```

### 3.3 packages.yml - DÉPENDANCES

**Emplacement**: `C:\dbt_workspace\mon_projet_analytics\packages.yml`

```yaml
# ===============================================
# PACKAGES.YML - DÉPENDANCES DBT
# ===============================================
# Déclare les packages externes à installer
# Exécutez: dbt deps

packages:
  # ─────────────────────────────────────────────
  # PACKAGE 1: dbt_utils
  # ─────────────────────────────────────────────
  # Qu'est-ce que c'est:
  # • Collection de macros/tests utiles
  # • Maintenu par dbt Labs (officiel)
  # 
  # À quoi ça sert:
  # • Tests avancés: accepted_range, not_empty, etc.
  # • Macros: generate_series(), star(), etc.
  # • Manipulation de dates
  # 
  # Utilisation:
  # tests:
  #   - dbt_utils.accepted_range:
  #       min_value: 0
  #       max_value: 1000
  # 
  # Installation:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

  # ─────────────────────────────────────────────
  # PACKAGE 2: dbt_expectations
  # ─────────────────────────────────────────────
  # Qu'est-ce que c'est:
  # • Tests statistiques avancés (comme Great Expectations)
  # • Maintenu par Calogica
  # 
  # À quoi ça sert:
  # • Tester les distributions (variance, skew)
  # • Détecter les anomalies (outliers)
  # • Tests de tendance (série temporelle)
  # 
  # Utilisation:
  # tests:
  #   - dbt_expectations.expect_column_values_to_be_in_set:
  #       value_set: ['A', 'B', 'C']
  # 
  - package: calogica/dbt_expectations
    version: 0.10.1

  # ─────────────────────────────────────────────
  # PACKAGE 3: codegen
  # ─────────────────────────────────────────────
  # Qu'est-ce que c'est:
  # • Génération automatique de code dbt
  # • Maintenu par dbt Labs
  # 
  # À quoi ça sert:
  # • Générer sources.yml automatiquement
  # • Générer models.yml avec colonnes
  # • Économise du temps pour gros projets
  # 
  # Utilisation:
  # dbt run-operation generate_source \
  #   --args '{"schema_name": "raw", "table_names": ["customers"]}'
  # 
  - package: dbt-labs/codegen
    version: 0.12.1

# ═══════════════════════════════════════════════════════════════════════════════
# APRÈS CRÉATION:
# ═══════════════════════════════════════════════════════════════════════════════
# Exécutez: dbt deps
# 
# Résultat:
# • Crée dossier dbt_packages/
# • Télécharge les 3 packages
# • Vous pouvez maintenant les utiliser dans vos modèles!
```

---

## 4. MODELS SQL COMMENTÉS

### 4.1 Modèle Bronze - COMMENTÉ LIGNE PAR LIGNE

**Emplacement**: `models/staging/stg_customers.sql`

```sql
{{/*
  ================================================================
  MODÈLE: stg_customers
  LAYER: Bronze (Staging)
  ================================================================
  
  PURPOSE:
    Staging brut de la table customers
    - Copie les données de raw.customers
    - Renomme les colonnes pour cohérence
    - Cast les types pour garantir la qualité
    - Ajoute quelques calculs simples
  
  INPUT:
    raw.customers (source externe, déclarée dans _sources.yml)
  
  OUTPUT:
    bronze.stg_customers (VIEW)
  
  GRAIN:
    1 ligne = 1 client unique
  
  VOLUME:
    Environ 10M lignes (dépend de votre BD)
  
  AUTHOR: Data Engineering Team
  CREATED: 2026-01-01
  MODIFIED: 2026-01-29
  ================================================================
*/}}

-- ===============================================
-- ÉTAPE 1: IMPORTER LES DONNÉES SOURCES
-- ===============================================

-- CTE (Common Table Expression) = sous-requête nommée
-- Permet de décomposer la requête en étapes logiques
-- {{ source() }} = macro dbt qui référence une source déclarée dans _sources.yml

-- Utilisation de source():
-- {{ source('raw', 'customers') }}
--        ↑         ↑
--    nom source   nom table
-- Cherche dans _sources.yml la source "raw" et sa table "customers"

with source as (
    -- SELECT * = récupère TOUTES les colonnes de la source
    -- Pourquoi *? Parce qu'on veut voir la structure brute
    -- Dans les étapes suivantes, on sélectionnera explicitement
    select * from {{ source('raw', 'customers') }}
),

-- ===============================================
-- ÉTAPE 2: RENOMMER ET TYPER LES COLONNES
-- ===============================================

-- CTE "renamed" = effectue les transformations de base
-- Transformations appliquées:
-- • CAST = conversion de type (DATETIME → DATE)
-- • Renommage: status → order_status (clarté)
-- • Nettoyage: LOWER(), TRIM() (standardisation)
-- • Calculs simples: IF, CASE WHEN (flags)

renamed as (
    select
        -- ═══════════════════════════════════════════════════════════
        -- CLÉS (IDENTIFIANTS)
        -- ═══════════════════════════════════════════════════════════
        
        -- customer_id: Clé primaire (PK)
        -- • Doit être UNIQUE
        -- • Doit être NOT NULL
        -- • Identifie de manière unique chaque client
        -- CAST: convertit en VARCHAR(50) pour compatibilité BD
        cast(customer_id as varchar(50)) as customer_id,
        
        -- ═══════════════════════════════════════════════════════════
        -- ATTRIBUTS CONTACT
        -- ═══════════════════════════════════════════════════════════
        
        -- email: Adresse email unique du client
        -- LOWER(): convertit en minuscules pour éviter les doublons
        -- Exemple: "John@example.com" → "john@example.com"
        cast(lower(email) as varchar(255)) as email,
        
        -- first_name: Prénom du client
        -- TRIM(): supprime les espaces au début/fin
        -- Exemple: " John " → "John"
        cast(trim(first_name) as varchar(100)) as first_name,
        
        -- last_name: Nom de famille
        cast(trim(last_name) as varchar(100)) as last_name,
        
        -- ═══════════════════════════════════════════════════════════
        -- ATTRIBUTS LOCALISATION
        -- ═══════════════════════════════════════════════════════════
        
        -- country: Pays de résidence
        cast(country as varchar(100)) as country,
        
        -- postal_code: Code postal
        cast(postal_code as varchar(20)) as postal_code,
        
        -- ═══════════════════════════════════════════════════════════
        -- DATES
        -- ═══════════════════════════════════════════════════════════
        
        -- created_at: Date de création du compte
        -- CAST to DATE: supprime l'heure, garde juste la date
        -- Exemple: 2021-01-15 14:30:00 → 2021-01-15
        cast(created_at as date) as customer_created_at,
        
        -- ═══════════════════════════════════════════════════════════
        -- MÉTADONNÉES SYSTÈME
        -- ═══════════════════════════════════════════════════════════
        
        -- _loaded_at: Timestamp du chargement par l'ETL
        -- Utilisé par dbt pour vérifier la fraîcheur des données
        -- (si _loaded_at < 24h → données à jour)
        cast(_loaded_at as datetime2(6)) as loaded_at,
        
        -- dbt_batch_id: Identifiant unique d'exécution dbt
        -- {{ invocation_id }} = UUID généré par dbt
        -- Utile pour tracer quelle exécution dbt a créé cette ligne
        -- Exemple: a1b2c3d4-e5f6-7890-abcd-ef1234567890
        '{{ invocation_id }}' as dbt_batch_id,
        
        -- dbt_loaded_at: Timestamp de création par dbt
        -- CURRENT_TIMESTAMP = heure exacte de l'exécution
        current_timestamp as dbt_loaded_at
        
    from source
),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 3: SÉLECTION FINALE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Cette dernière étape sélectionne le résultat final
-- Convention dbt: toujours finir avec une CTE "final" et un SELECT final
-- Pourquoi? Facilite le refactoring futur

final as (
    select * from renamed
)

-- ═══════════════════════════════════════════════════════════════════════════════
-- RÉSULTAT FINAL
-- ═══════════════════════════════════════════════════════════════════════════════

-- dbt exécute cette dernière ligne et crée la VIEW/TABLE
-- Quand quelqu'un utilisera {{ ref('stg_customers') }},
-- dbt remplacera par: SELECT * FROM bronze.stg_customers

select * from final
```

### 4.2 Modèle Silver - AVEC AGRÉGATIONS ET BOUCLES

**Emplacement**: `models/intermediate/int_customers_enriched.sql`

```sql
{{/*
  ================================================================
  MODÈLE: int_customers_enriched
  LAYER: Silver (Intermediate)
  ================================================================
  
  PURPOSE:
    Profil client enrichi avec:
    • Métriques RFM (Recency, Frequency, Monetary)
    • Segmentation client basée sur LTV
    • Flags de comportement (high_value, at_risk)
  
  INPUT:
    {{ ref('stg_customers') }}      ← bronze.stg_customers
    {{ ref('stg_orders') }}         ← bronze.stg_orders
  
  OUTPUT:
    silver.int_customers_enriched (VIEW)
  
  GRAIN:
    1 ligne = 1 client unique
    
  VOLUME:
    ~10M lignes (même que stg_customers)
  
  DEPENDENCIES:
    stg_customers ← dbt exécute d'abord
    stg_orders    ← dbt exécute d'abord
  
  ================================================================
*/}}

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 1: IMPORTER LES DONNÉES BRONZE
-- ═══════════════════════════════════════════════════════════════════════════════

with customers as (
    -- {{ ref() }} = macro dbt qui référence un modèle dbt
    -- Crée une DÉPENDANCE: dbt exécutera stg_customers EN PREMIER
    -- Puis int_customers_enriched (après)
    select * from {{ ref('stg_customers') }}
),

orders as (
    -- Filtre: exclure les commandes annulées
    -- Pourquoi? Parce qu'on veut les vraies métriques de client
    -- Annulées n'apportent pas de revenu
    select * from {{ ref('stg_orders') }}
    where order_status != 'cancelled'
),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 2: CALCULER LES MÉTRIQUES RFM PAR CLIENT
-- ═══════════════════════════════════════════════════════════════════════════════

-- RFM = Recency, Frequency, Monetary
-- • Recency: combien de jours depuis dernière commande
-- • Frequency: nombre total de commandes
-- • Monetary: montant total dépensé

customer_metrics as (
    select
        -- Grouper par client
        customer_id,
        
        -- FREQUENCY = Nombre de commandes distinctes
        -- COUNT(DISTINCT order_id) = ne compte que commandes uniques
        -- Exemple: si un client a 5 commandes → 5
        count(distinct order_id) as total_orders,
        
        -- MONETARY = Total dépensé
        -- SUM(total_amount) = somme de tous les montants
        -- Exemple: 3 commandes de 100€, 200€, 150€ → 450€
        sum(total_amount) as lifetime_value,
        
        -- Montant moyen par commande
        -- AVG(total_amount) = moyenne arithmétique
        -- Exemple: 450€ ÷ 3 = 150€/commande
        avg(total_amount) as avg_order_value,
        
        -- RECENCY (partie 1) = Date première commande
        -- MIN(order_date) = date la plus ancienne
        min(order_date) as first_order_date,
        
        -- RECENCY (partie 2) = Date dernière commande
        -- MAX(order_date) = date la plus récente
        max(order_date) as last_order_date,
        
        -- RECENCY (partie 3) = Jours depuis dernière commande
        -- DATEDIFF(day, max_date, today) = nombre de jours écoulés
        -- Exemple: dernière commande il y a 10 jours → 10
        datediff(day, max(order_date), current_date) as days_since_last_order
        
    from orders
    group by customer_id
    -- GROUP BY: regrouper toutes les commandes par client
    -- Permet de calculer COUNT, SUM, AVG, MIN, MAX par client
),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 3: SEGMENTATION CLIENT
-- ═══════════════════════════════════════════════════════════════════════════════

-- Basée sur RFM, créer des segments métier
-- Exemple: VIP, Active, New, At-Risk, Churned

segmentation as (
    select
        customer_id,
        lifetime_value,
        total_orders,
        days_since_last_order,
        
        -- CASE WHEN = IF-THEN-ELSE en SQL
        -- Créer une catégorie basée sur les conditions
        case
            -- Si LTV >= 5000€ → segment VIP
            when lifetime_value >= 5000 then 'vip'
            -- Si commandes >= 10 ET pas d'achat depuis <= 90 jours → active
            when total_orders >= 10 and days_since_last_order <= 90 then 'active'
            -- Si pas d'achat depuis > 180 jours → churned
            when days_since_last_order > 180 then 'churned'
            -- Si première commande < 3 mois → new
            when current_date - datediff(day, first_order_date, current_date) < 90 then 'new'
            -- Par défaut → prospect (ou autre segment)
            else 'prospect'
        end as customer_segment
        
    from customer_metrics
),

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÉTAPE 4: ENRICHISSEMENT FINAL
-- ═══════════════════════════════════════════════════════════════════════════════

enriched as (
    select
        -- IDENTIFIANTS
        c.customer_id,
        c.email,
        c.first_name,
        c.last_name,
        
        -- Colonne calculée: nom complet
        -- Concaténation: "John" + " " + "Doe" → "John Doe"
        c.first_name + ' ' + c.last_name as full_name,
        
        -- LOCALISATION
        c.country,
        c.postal_code,
        
        -- MÉTRIQUES RFM
        coalesce(cm.total_orders, 0) as total_orders,
        -- COALESCE: si NULL → utilise 0 (pour clients sans commande)
        
        coalesce(cm.lifetime_value, 0) as lifetime_value,
        coalesce(cm.avg_order_value, 0) as avg_order_value,
        
        -- DATES
        cm.first_order_date,
        cm.last_order_date,
        cm.days_since_last_order,
        
        -- Ancien de la base (en jours)
        datediff(day, c.customer_created_at, current_date) as customer_age_days,
        
        -- SEGMENTATION
        s.customer_segment,
        
        -- FLAGS BUSINESS
        -- Drapeau: ce client a-t-il déjà commandé?
        case when cm.total_orders > 0 then 1 else 0 end as has_ordered,
        -- Drapeau: ce client est-il HV (high-value, LTV >= 1000€)?
        case when cm.lifetime_value >= 1000 then 1 else 0 end as is_high_value,
        -- Drapeau: ce client est-il à risque (at-risk)?
        -- Risque = pas acheté depuis 90 jours ET avait acheté
        case when cm.days_since_last_order > 90 and cm.total_orders > 0 then 1 else 0 end as is_at_risk,
        
        -- MÉTADONNÉES
        c.dbt_loaded_at
        
    from customers c
    -- LEFT JOIN: garder tous les clients (même sans commande)
    left join customer_metrics cm on c.customer_id = cm.customer_id
    left join segmentation s on c.customer_id = s.customer_id
)

-- ═══════════════════════════════════════════════════════════════════════════════
-- RÉSULTAT FINAL
-- ═══════════════════════════════════════════════════════════════════════════════

select * from enriched
```

### 4.3 Modèle Gold avec Macros - DIMENSION

**Emplacement**: `models/marts/dim_customers.sql`

```sql
{{/*
  ================================================================
  MODÈLE: dim_customers
  LAYER: Gold (Marts)
  ================================================================
  
  PURPOSE:
    Dimension clients pour Power BI / Dashboards
    Table optimisée pour les requêtes analytiques
    
    • Applique transformations finales
    • Crée des indexes pour performance
    • Ajoute flags calculés pour BI
    • Matérialisée comme TABLE (stockage physique)
  
  INPUT:
    {{ ref('int_customers_enriched') }}  ← silver.int_customers_enriched
  
  OUTPUT:
    gold.dim_customers (TABLE)
    Avec indexes sur customer_segment
  
  GRAIN:
    1 ligne = 1 client unique (lentement changeant)
  
  MATERIALIZATION:
    TABLE (pas VIEW!)
    Pourquoi? BI veut une table stockée pour perf
  
  INDEXES:
    customer_id (PK, unique)
    customer_segment (recherches fréquentes)
  
  ================================================================
*/}}

-- ═══════════════════════════════════════════════════════════════════════════════
-- CONFIGURATION DBT (Bloc config())
-- ═══════════════════════════════════════════════════════════════════════════════

{{
    config(
        -- materialized = Type de matérialisation
        -- 'table' = créer une TABLE physique (pas une VIEW)
        -- Taille: ~10M lignes
        -- Espace disque: ~5GB
        materialized='table',
        
        -- unique_key = Colonne(s) qui identifient uniquement une ligne
        -- Utilisée pour:
        -- • Vérifier les tests "unique"
        -- • Incrémenta si materialized='incremental'
        -- • SCD Type 2 si utilise avec snapshots
        unique_key='customer_id',
        
        -- tags = Labels pour filtrer l'exécution
        -- dbt run --select tag:critical
        tags=['gold', 'dimension', 'core', 'critical'],
        
        -- indexes = Créer des indexes BD (optionnel)
        -- Améliore la vitesse des requêtes
        -- À utiliser pour colonnes souvent filtrées
        indexes=[
            -- Index sur PK
            {'columns': ['customer_id'], 'unique': true},
            -- Index sur segmentation (souvent filtrée)
            {'columns': ['customer_segment'], 'unique': false}
        ]
    )
}}

-- ═══════════════════════════════════════════════════════════════════════════════
-- IMPORTER DONNÉES INTERMEDIATE
-- ═══════════════════════════════════════════════════════════════════════════════

with customers as (
    select * from {{ ref('int_customers_enriched') }}
),

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRANSFORMATIONS FINALES POUR BI
-- ═══════════════════════════════════════════════════════════════════════════════

final as (
    select
        -- ═════════════════════════════════════════════════════════════
        -- CLÉS (Pour les jointures BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- customer_id: Clé primaire
        -- • Joinée avec fact_orders.customer_id dans BI
        -- • Peut être utilisée dans Power BI measure
        customer_id,
        
        -- ═════════════════════════════════════════════════════════════
        -- ATTRIBUTS DESCRIPTIFS (Texte pour filtres BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- Renommer pour cohérence BI
        full_name as customer_name,
        email as customer_email,
        country as customer_country,
        postal_code as customer_postal_code,
        
        -- ═════════════════════════════════════════════════════════════
        -- SEGMENTATION (Filtres courants en BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- Segment client (VIP, Active, New, etc.)
        -- Utilisé pour filtrer dashboards
        customer_segment,
        
        -- Ordre de tri pour affichage visuel
        -- Permet à BI d'afficher VIP en premier, churned en dernier
        case customer_segment
            when 'vip' then 1
            when 'active' then 2
            when 'new' then 3
            when 'at_risk' then 4
            when 'churned' then 5
            else 6  -- prospect
        end as segment_sort_order,
        
        -- ═════════════════════════════════════════════════════════════
        -- MÉTRIQUES CLÉS (Pour les measures Power BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- Nombre de commandes
        total_orders,
        
        -- Valeur client sur la vie
        -- Utilisé pour segmenter High-Value vs Regular
        lifetime_value,
        
        -- Montant moyen par commande
        -- Utilisé pour comparer segments
        avg_order_value,
        
        -- ═════════════════════════════════════════════════════════════
        -- DATES IMPORTANTES (Timeline en BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- Date première commande
        first_order_date,
        
        -- Date dernière commande
        last_order_date,
        
        -- Jours depuis dernier achat
        -- Utilisé pour identifier churn risk
        days_since_last_order,
        
        -- Ancienneté du client (jours)
        customer_age_days,
        
        -- ═════════════════════════════════════════════════════════════
        -- FLAGS BUSINESS (Paramètres pour filtres BI)
        -- ═════════════════════════════════════════════════════════════
        
        -- A-t-il acheté?
        has_ordered,
        
        -- Est-il high-value (LTV >= 1000€)?
        is_high_value,
        
        -- Est-il à risque (churn)?
        is_at_risk,
        
        -- ═════════════════════════════════════════════════════════════
        -- MÉTADONNÉES (Audit/Tracing)
        -- ═════════════════════════════════════════════════════════════
        
        -- Quand cette ligne a été chargée
        current_timestamp as created_at,
        
        -- Quand cette ligne a été mise à jour
        dbt_loaded_at as last_updated_at
        
    from customers
)

-- ═════════════════════════════════════════════════════════════════════════════════
-- RÉSULTAT FINAL
-- ═════════════════════════════════════════════════════════════════════════════════

-- dbt exécute cette requête et crée la TABLE gold.dim_customers
-- Power BI se connecte à cette table et crée des rapports

select * from final
```

---

## 5. TESTS EXPLIQUÉS

### Tests YAML - Expliqués

**Emplacement**: `models/staging/_bronze_models.yml`

```yaml
# ═══════════════════════════════════════════════════════════════════════════════
# TESTS YAML
# ═══════════════════════════════════════════════════════════════════════════════
# Tests déclaratifs (YAML) appliqués directement aux modèles
# Exécutés avec: dbt test

version: 2

models:
  
  # ─────────────────────────────────────────────────────────────────────────────
  # MODÈLE: stg_customers
  # ─────────────────────────────────────────────────────────────────────────────
  
  - name: stg_customers
    description: "Clients nettoyés et typés depuis la source raw"
    
    columns:
      
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      # COLONNE: customer_id (PRIMARY KEY)
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      
      - name: customer_id
        description: "Identifiant unique du client"
        
        tests:
          # TEST 1: unique
          # ──────────
          # Objective: Vérifier qu'il n'y a pas de doublons
          # 
          # Comment ça marche:
          # SELECT customer_id, COUNT(*) as cnt
          # FROM stg_customers
          # GROUP BY customer_id
          # HAVING COUNT(*) > 1
          # 
          # ✅ Si 0 lignes → TEST PASS (pas de doublons)
          # ❌ Si > 0 lignes → TEST FAIL (doublons trouvés!)
          # 
          # Exemple d'erreur:
          # ❌ FAIL: unique on stg_customers.customer_id
          #    customer_id '12345' appears 2 times
          
          - unique
          
          # TEST 2: not_null
          # ────────────────
          # Objective: Vérifier qu'il n'y a pas de NULL
          # 
          # Comment ça marche:
          # SELECT COUNT(*) as cnt
          # FROM stg_customers
          # WHERE customer_id IS NULL
          # 
          # ✅ Si 0 lignes → TEST PASS (pas de NULL)
          # ❌ Si > 0 lignes → TEST FAIL (NULLs trouvés!)
          # 
          # Pourquoi c'est important?
          # • customer_id = clé primaire
          # • Une PK DOIT être unique et non-null
          # • Sinon impossible de joindre avec autres tables
          
          - not_null
      
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      # COLONNE: email
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      
      - name: email
        description: "Adresse email du client"
        
        tests:
          # unique: chaque email doit être unique
          # Utilisé pour déduplication de clients
          - unique
          
          # not_null: pas d'email vide
          # Essentiel pour contact client
          - not_null
      
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      # COLONNE: first_name
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      
      - name: first_name
        description: "Prénom du client"
        
        tests:
          # not_null: prénom requis
          - not_null
      
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      # COLONNE: country
      # ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      
      - name: country
        description: "Pays du client"
        
        tests:
          # accepted_values: vérifier que country est dans une liste
          # 
          # Comment ça marche:
          # SELECT COUNT(*) as cnt
          # FROM stg_customers
          # WHERE country NOT IN ('FR', 'DE', 'US', 'UK')
          # AND country IS NOT NULL
          # 
          # ✅ Si 0 lignes → TEST PASS (tous pays valides)
          # ❌ Si > 0 lignes → TEST FAIL (pays invalide trouvé!)
          # 
          # Exemple:
          # ✅ PASS: country='FR' (dans la liste)
          # ❌ FAIL: country='ZZ' (pas dans la liste!)
          
          - accepted_values:
              values: ['FR', 'DE', 'US', 'UK', 'ES', 'IT']
  
  # ─────────────────────────────────────────────────────────────────────────────
  # MODÈLE: stg_orders
  # ─────────────────────────────────────────────────────────────────────────────
  
  - name: stg_orders
    description: "Commandes nettoyées"
    
    columns:
      
      - name: order_id
        description: "Identifiant unique de la commande"
        
        tests:
          - unique
          - not_null
      
      - name: customer_id
        description: "Référence au client"
        
        tests:
          - not_null
          
          # TEST: relationships (Foreign Key)
          # ─────────────────────────────────
          # Objective: Vérifier l'intégrité référentielle
          # 
          # Comment ça marche:
          # SELECT COUNT(*) as cnt
          # FROM stg_orders o
          # WHERE customer_id IS NOT NULL
          # AND customer_id NOT IN (
          #     SELECT customer_id FROM stg_customers
          # )
          # 
          # ✅ Si 0 lignes → TEST PASS (FK valides)
          # ❌ Si > 0 lignes → TEST FAIL (orphans trouvés!)
          # 
          # Exemple d'erreur:
          # ❌ FAIL: relationships on stg_orders.customer_id
          #    5 customer_ids don't exist in stg_customers
          # 
          # Signification: 5 commandes référencent des clients inexistants!
          # Cela causerait un NULL en Power BI si on joint les tables
          
          - relationships:
              to: ref('stg_customers')  # Table référencée
              field: customer_id        # Colonne référencée
      
      - name: order_status
        description: "Statut de la commande"
        
        tests:
          # accepted_values: vérifier que le statut est valide
          # Seulement les statuts qui existent dans notre système
          - accepted_values:
              values: ['pending', 'shipped', 'delivered', 'cancelled', 'returned']
      
      - name: total_amount
        description: "Montant total en euros"
        
        tests:
          - not_null
          
          # TEST: dbt_utils.accepted_range (du package dbt_utils)
          # ───────────────────────────────────────────────
          # Objective: Vérifier qu'une valeur est dans une plage
          # 
          # Comment ça marche:
          # SELECT COUNT(*) as cnt
          # FROM stg_orders
          # WHERE total_amount < 0 OR total_amount > 1000000
          # 
          # ✅ Si 0 lignes → TEST PASS (tous montants valides)
          # ❌ Si > 0 lignes → TEST FAIL (montant hors plage!)
          # 
          # Pourquoi [0, 1000000]?
          # • Min 0: une commande ne peut pas être négative
          # • Max 1000000: montant raisonnable pour un ecommerce
          # Si on trouve une commande de 10 milliards, c'est une erreur!
          
          - dbt_utils.accepted_range:
              min_value: 0
              max_value: 1000000
              inclusive: true

# ═══════════════════════════════════════════════════════════════════════════════
# SYNTHÈSE DES TESTS
# ═══════════════════════════════════════════════════════════════════════════════

# Résumé des tests appliqués:
#
# stg_customers:
# • customer_id: UNIQUE, NOT NULL
# • email: UNIQUE, NOT NULL
# • first_name: NOT NULL
# • country: IN ['FR', 'DE', 'US', ...]
#
# stg_orders:
# • order_id: UNIQUE, NOT NULL
# • customer_id: NOT NULL, FOREIGN KEY → stg_customers
# • order_status: IN ['pending', 'shipped', ...]
# • total_amount: NOT NULL, BETWEEN [0, 1000000]
#
# Commandes pour exécuter:
# • dbt test                    ← tous les tests
# • dbt test --select tag:staging  ← tests staging seulement
# • dbt test --select stg_customers ← tests ce modèle
```

### Tests SQL Personnalisés

**Emplacement**: `tests/assert_no_orphan_orders.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- TEST PERSONNALISÉ: assert_no_orphan_orders
-- ═══════════════════════════════════════════════════════════════════════════════
-- Test métier complexe (ne peut pas être exprimé en YAML simple)
--
-- Objective:
--   Vérifier qu'il n'y a pas de commandes sans client correspondant
--   Appelées "orphan orders" (commandes orphelines)
--
-- Cas d'usage réel:
--   Un incident ETL a chargé des commandes mais pas leurs clients
--   Les commandes orphelines causent des NULL en Power BI
--   Ce test détecte le problème AVANT qu'il n'atteigne BI
--
-- ═══════════════════════════════════════════════════════════════════════════════

{{
    config(
        -- severity: niveau de gravité du test
        -- 'error' = dbt s'arrête si test échoue
        -- 'warn' = dbt continue mais affiche un avertissement
        severity: 'error',
        
        -- tags: label ce test
        -- dbt test --select tag:orders
        tags: ['assert', 'orders']
    )
}}

-- SELECT * FROM cette requête
-- ✅ Si 0 lignes → TEST PASS (pas d'orphans)
-- ❌ Si > 0 lignes → TEST FAIL (orphans trouvés!)

select count(*) as orphan_count
from {{ ref('fct_orders') }} o
-- LEFT JOIN: garder toutes les commandes (même sans client)
left join {{ ref('dim_customers') }} c 
    on o.customer_id = c.customer_id
-- WHERE: chercher les commandes dont le client n'existe pas
where c.customer_id is null

-- Si cette requête retourne > 0, c'est une erreur!
-- Signification: des commandes existent sans client correspondant
-- Exemple:
-- • order_id=1001, customer_id=555 → customer_id 555 n'existe pas en dim_customers!
```

---

## 6. MACROS ET BOUCLES JINJA

### 6.1 Macro Simple - NINJA 🥋

**Emplacement**: `macros/convert_currency.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- MACRO: convert_currency
-- ═══════════════════════════════════════════════════════════════════════════════
-- Fonction réutilisable: convertir cents en euros
--
-- Utilité:
--   Éviter de répéter CAST(... / 100.0, 2) partout dans les modèles
--   Une macro = une seule place pour changer la logique
--
-- Syntaxe Jinja:
--   {% macro nom(parametres) %}
--     ... contenu SQL ...
--   {% endmacro %}
--
-- ═══════════════════════════════════════════════════════════════════════════════

{% macro convert_cents_to_euros(column_name) %}
    -- Convertir cents en euros et arrondir à 2 décimales
    -- Exemple: 1550 cents → 15.50 euros
    round({{ column_name }} / 100.0, 2)
{% endmacro %}

-- ═════════════════════════════════════════════════════════════════════════════════
-- UTILISATION DANS UN MODÈLE:
-- ═════════════════════════════════════════════════════════════════════════════════

-- Avant (sans macro):
-- SELECT
--     order_id,
--     round(amount_cents / 100.0, 2) as amount_eur,
--     round(tax_cents / 100.0, 2) as tax_eur
-- FROM orders

-- Après (avec macro):
-- SELECT
--     order_id,
--     {{ convert_cents_to_euros('amount_cents') }} as amount_eur,
--     {{ convert_cents_to_euros('tax_cents') }} as tax_eur
-- FROM orders

-- Pourquoi c'est mieux?
-- • DRY = Don't Repeat Yourself (pas de répétition)
-- • Un seul endroit pour changer la logique
-- • Lisibilité: le nom de la macro dit ce qu'elle fait
```

### 6.2 Macro avec Boucle - ADVANCED

**Emplacement**: `macros/generate_date_range.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- MACRO: generate_date_range
-- ═══════════════════════════════════════════════════════════════════════════════
-- Macro AVANCÉE: boucle Jinja pour générer une séquence de dates
--
-- Rôle:
--   Créer une table de dates (dimension temps)
--   Utilisée pour les rapports time-based
--
-- Jinja Concepts:
--   • {% for %} ... {% endfor %} = boucle Jinja
--   • {% set %} = variable Jinja
--   • {{ }} = output Jinja (génère du SQL)
--
-- ═══════════════════════════════════════════════════════════════════════════════

{% macro generate_date_range(start_date, end_date) %}
    -- Cette macro génère du SQL qui crée une séquence de dates
    -- Entrées: start_date='2020-01-01', end_date='2020-01-31'
    -- Sortie: SQL qui sélectionne toutes les dates entre (incluses)
    
    {% set ns = namespace(current_date=start_date) %}
    -- namespace = variable persistente dans la boucle
    
    {% for i in range(365) %}
        -- Boucle: pour chaque jour des 365 prochains jours
        
        {% if ns.current_date <= end_date %}
            -- Si la date courante est <= date fin
            
            {% if i > 0 %}
                -- Ajouter UNION pour toutes les dates sauf la première
                union all
            {% endif %}
            
            select
                '{{ ns.current_date }}' as date_key,
                {{ i }} as day_of_year,
                extract(year from '{{ ns.current_date }}') as year,
                extract(month from '{{ ns.current_date }}') as month,
                extract(day from '{{ ns.current_date }}') as day
            
            -- Avancer d'un jour
            {% set ns.current_date = (ns.current_date::date + interval '1 day')::string %}
            
        {% endif %}
    {% endfor %}
{% endmacro %}

-- ═════════════════════════════════════════════════════════════════════════════════
-- UTILISATION:
-- ═════════════════════════════════════════════════════════════════════════════════

-- Dans un modèle SQL:
-- with date_range as (
--     {{ generate_date_range('2020-01-01', '2020-12-31') }}
-- )
-- select * from date_range

-- Résultat généré:
-- SELECT '2020-01-01' as date_key, 0 as day_of_year, 2020 as year, 1 as month, 1 as day
-- UNION ALL
-- SELECT '2020-01-02' as date_key, 1 as day_of_year, 2020 as year, 1 as month, 2 as day
-- UNION ALL
-- ...continuer pour chaque jour...
```

### 6.3 Test Générique en Macro - SUPER NINJA 🥋🥋

**Emplacement**: `macros/test_custom_range.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- MACRO: test_custom_range
-- ═══════════════════════════════════════════════════════════════════════════════
-- Crée un test personnalisé réutilisable
--
-- C'est un test GÉNÉRIQUE:
--   • Peut être appelé de n'importe quel modèle
--   • Via la syntaxe YAML simple
--   • dbt compile en SQL et l'exécute
--
-- Paramètres:
--   • model = le modèle à tester
--   • column_name = la colonne à vérifier
--   • min_value = limite inférieure (optionnel)
--   • max_value = limite supérieure (optionnel)
--
-- Utilisation en YAML:
--   tests:
--     - custom_range:
--         min_value: 0
--         max_value: 1000
--
-- ═══════════════════════════════════════════════════════════════════════════════

{% test custom_range(model, column_name, min_value=0, max_value=null) %}
    -- Cette macro génère un test SQL
    -- Utilisée par: dbt test
    
    select count(*) as failing_rows
    from {{ model }}
    where
        -- Vérifier que column_name >= min_value
        ({{ column_name }} < {{ min_value }})
        
        -- ET vérifier que column_name <= max_value (si max_value fournie)
        {% if max_value is not none %}
            or ({{ column_name }} > {{ max_value }})
        {% endif %}
    
    having count(*) > 0
    -- Si count(*) > 0 → test échoue
    -- Signification: trouvé des valeurs hors plage!

{% endtest %}

-- ═════════════════════════════════════════════════════════════════════════════════
-- UTILISATION DANS _BRONZE_MODELS.YML:
-- ═════════════════════════════════════════════════════════════════════════════════

-- - name: total_amount
--   tests:
--     - not_null
--     - custom_range:
--         min_value: 0
--         max_value: 1000000

-- dbt génère et exécute:
-- SELECT count(*) as failing_rows
-- FROM staging.stg_orders
-- WHERE (total_amount < 0) OR (total_amount > 1000000)
-- HAVING count(*) > 0
```

---

## 7. SNAPSHOTS (SCD TYPE 2)

### Qu'est-ce qu'un Snapshot?

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  SCD = Slowly Changing Dimension (Dimension qui change lentement)              │
│                                                                                 │
│  Cas d'usage réel:                                                              │
│  • Client change d'adresse                                                      │
│  • Produit change de catégorie                                                  │
│  • Employé change de département                                                │
│                                                                                 │
│  Problème:                                                                      │
│  Si on met à jour la dimension, l'historique est perdu!                       │
│  Exemple:                                                                       │
│    Customer 123 habitait en "FR" → commandait des produits français             │
│    Customer 123 déménage en "US" → historique perdu!                           │
│                                                                                 │
│  Solution: SCD Type 2                                                           │
│  Créer une nouvelle ligne pour chaque changement                               │
│  Avec valid_from / valid_to pour tracker le temps                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Exemple de Snapshot

**Emplacement**: `snapshots/customers_snapshot.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
-- SNAPSHOT: customers_snapshot
-- ═══════════════════════════════════════════════════════════════════════════════
-- Capture historique des clients (SCD Type 2)
--
-- Rôle:
--   • Suivre les changements de clients dans le temps
--   • Garder l'historique complet
--   • Savoir QUAND chaque attribut a changé
--
-- Sortie:
--   Table: snapshots.customers_snapshot
--   • Contient toutes les versions de chaque client
--   • Avec dates de validité (valid_from / valid_to)
--
-- Utilité business:
--   • Analyser comment les clients changent
--   • Rejouer l'historique ("comment était le client il y a 6 mois?")
--   • Detecter les patterns de changement
//
// ═════════════════════════════════════════════════════════════════════════════════

{{
    config(
        -- target_schema = où créer le snapshot
        target_schema='snapshots',
        
        -- unique_key = colonne qui identifie le client
        unique_key='customer_id',
        
        -- strategy = comment détecter les changements
        -- 'timestamp' = utiliser une colonne timestamp
        -- 'check' = comparer toutes les colonnes
        strategy='timestamp',
        
        -- updated_at = colonne utilisée pour détecter changements
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

-- ═════════════════════════════════════════════════════════════════════════════════
-- RÉSULTAT GÉNÉRÉ PAR DBT:
-- ═════════════════════════════════════════════════════════════════════════════════

-- Table: snapshots.customers_snapshot
-- 
-- customer_id | email            | country | dbt_valid_from | dbt_valid_to | dbt_scd_id
-- ────────────┼──────────────────┼─────────┼────────────────┼──────────────┼─────────────
-- C001        | john@example.com | FR      | 2021-01-01     | 2023-06-15   | uuid1
-- C001        | john@example.com | DE      | 2023-06-15     | NULL         | uuid2
-- ────────────┼──────────────────┼─────────┼────────────────┼──────────────┼─────────────
--
-- Signification:
// • Customer C001 habitait en FR jusqu'au 2023-06-15
// • Puis a changé en DE à partir du 2023-06-15
// • NULL dans dbt_valid_to = version actuelle (en cours)
//
// dbt_scd_id = UUID unique pour chaque version
// Utilisé pour tracer dans les analyses

-- ═════════════════════════════════════════════════════════════════════════════════
// UTILISATION DANS UN MODÈLE:
// ═════════════════════════════════════════════════════════════════════════════════

// Récupérer la version ACTUELLE d'un client:
// select *
// from {{ ref('customers_snapshot') }}
// where dbt_valid_to is null

// Récupérer l'historique complet:
// select *
// from {{ ref('customers_snapshot') }}
// where customer_id = 'C001'
// order by dbt_valid_from
```

---

## 8. SEEDS ET DONNÉES

### Seeds: Fichiers CSV à charger

**Emplacement**: `seeds/country_mapping.csv`

```csv
# Fichier CSV: lookup table pour mapping pays/régions
# Chargé en base de données avec: dbt seed

country_code,country_name,region,currency
FR,France,Europe,EUR
DE,Germany,Europe,EUR
US,United States,North America,USD
CA,Canada,North America,CAD
GB,United Kingdom,Europe,GBP
IT,Italy,Europe,EUR
ES,Spain,Europe,EUR
JP,Japan,Asia,JPY
```

**Configuration**: `dbt_project.yml`

```yaml
seeds:
  mon_projet_analytics:
    # Schema où créer les tables seeds
    +schema: seeds
    
    # Quote les noms de colonnes
    +quote_columns: true
    
    # Configuration spécifique par seed
    country_mapping:
      # Clé unique pour ce seed
      +unique_key: 'country_code'
```

**Utilisation**: `models/staging/stg_orders.sql`

```sql
-- Joindre avec le seed pour enrichir les données

with orders as (
    select * from {{ source('raw', 'orders') }}
),

country_mapping as (
    -- Charger le seed (créé en seeds.country_mapping par dbt seed)
    select * from {{ ref('country_mapping') }}
),

enriched as (
    select
        o.order_id,
        o.customer_id,
        o.country_code,
        cm.country_name,
        cm.region,
        cm.currency
    from orders o
    left join country_mapping cm on o.country_code = cm.country_code
)

select * from enriched
```

**Commandes**:

```powershell
# Charger TOUS les CSVs
dbt seed

# Charger UN CSV spécifique
dbt seed --select country_mapping

# Forcer le rechargement (supprime et recrée)
dbt seed --full-refresh
```

---

## 9. WORKFLOWS & ORCHESTRATION

### Workflow Dev (Quotidien local)

```powershell
# ═══════════════════════════════════════════════════════════════════════════════
# DÉVELOPPEMENT LOCAL
# ═══════════════════════════════════════════════════════════════════════════════

# 1️⃣ Charger les données de test
dbt seed
# ✅ Crée les tables seeds (country_mapping, order_status_mapping, etc.)

# 2️⃣ Vérifier la connexion
dbt debug
# ✅ Affiche: "All checks passed!"

# 3️⃣ Exécuter JUSTE le modèle qu'on développe
dbt run --select stg_customers
# ✅ Crée bronze.stg_customers

# 4️⃣ Tester notre modèle
dbt test --select stg_customers
# ✅ Affiche les résultats des tests (unique, not_null, etc.)

# 5️⃣ Générer la documentation
dbt docs generate
dbt docs serve
# ✅ Serveur http://localhost:8000

# 6️⃣ Vérifier la fraîcheur des données
dbt source freshness
# ⚠️ Affiche: "raw_ecommerce.orders: WARN (last update: 18h ago)"

# 7️⃣ Quand satisfait: exécuter toute la couche
dbt run --select tag:staging
dbt test --select tag:staging
# ✅ Tous les stg_* modèles et leurs tests

# 8️⃣ Itérer jusqu'à satisfaction
# Puis passer à la couche silver, etc.
```

### Workflow Prod (Pipeline orchestré)

**Script Batch**: `dbt_daily_pipeline.bat`

```batch
@echo off
REM ═══════════════════════════════════════════════════════════════════════════════
REM PIPELINE PRODUCTION - DBT QUOTIDIEN
REM ═══════════════════════════════════════════════════════════════════════════════

cd C:\dbt_workspace\mon_projet_analytics

REM ───────────────────────────────────────────────────────────────────────────────
REM 07:00 AM: COUCHE BRONZE (Données brutes)
REM ───────────────────────────────────────────────────────────────────────────────
REM Rôle: Copier et nettoyer les données sources
REM Temps: ~5 minutes
REM

echo [07:00] Starting Bronze Layer...
dbt run --select tag:bronze
if errorlevel 1 (
    echo [ERROR] Bronze layer failed!
    exit /b 1
)

dbt test --select tag:bronze
if errorlevel 1 (
    echo [ERROR] Bronze tests failed!
    exit /b 1
)

dbt source freshness
if errorlevel 1 (
    echo [WARN] Source freshness check failed!
    REM Continuer même si avertissement (pas fatal)
)

REM ───────────────────────────────────────────────────────────────────────────────
REM 08:00 AM: COUCHE SILVER (Transformations)
REM ───────────────────────────────────────────────────────────────────────────────
REM Rôle: Jointures, agrégations, enrichissements
REM Temps: ~10 minutes
REM

echo [08:00] Starting Silver Layer...
dbt run --select tag:silver
if errorlevel 1 (
    echo [ERROR] Silver layer failed!
    exit /b 1
)

dbt test --select tag:silver
if errorlevel 1 (
    echo [ERROR] Silver tests failed!
    exit /b 1
)

REM ───────────────────────────────────────────────────────────────────────────────
REM 22:00 PM: COUCHE GOLD (Analytique BI)
REM ───────────────────────────────────────────────────────────────────────────────
REM Rôle: Dimensions et Facts pour Power BI
REM Temps: ~15 minutes (tables physiques, indexes)
REM

echo [22:00] Starting Gold Layer...
dbt run --select tag:gold
if errorlevel 1 (
    echo [ERROR] Gold layer failed!
    exit /b 1
)

dbt test --select tag:gold
if errorlevel 1 (
    echo [ERROR] Gold tests failed!
    exit /b 1
)

REM ───────────────────────────────────────────────────────────────────────────────
REM 23:00 PM: FINALISATION
REM ───────────────────────────────────────────────────────────────────────────────

echo [23:00] Generating documentation...
dbt docs generate

REM Snapshots (optionnel - une fois par semaine)
REM dbt snapshot

echo [SUCCESS] Pipeline completed successfully!

REM Envoyer email de notification
REM powershell -Command "Send-MailMessage..."

```

---

## 10. ASTUCES NINJA 🥋

### 1️⃣ Performance: Limiter les données en Dev

```sql
-- ❌ MAUVAIS: Tester avec 100M lignes (LENT)
select * from {{ source('raw', 'orders') }}

-- ✅ BON: Tester avec dernière semaine seulement (RAPIDE)
with source as (
    select * from {{ source('raw', 'orders') }}
    where order_date >= current_date - 7
)
select * from source
```

### 2️⃣ Debugging: Voir le SQL compilé

```powershell
# Voir exactement ce que dbt va exécuter (sans exécuter!)
dbt compile --select stg_customers

# Affiche le SQL compilé dans target/compiled/...
```

### 3️⃣ Git Workflow: Branching

```bash
# Créer une branche pour votre feature
git checkout -b feature/add-customer-segmentation

# Développer sur la branche
dbt run --select tag:silver
dbt test

# Commit et push
git add models/
git commit -m "Add RFM segmentation to customers"
git push origin feature/add-customer-segmentation

# Pull request pour review
# CI/CD pipeline teste automatiquement
```

### 4️⃣ Macro Avancée: Boucle sur colonnes

**Emplacement**: `macros/generate_column_list.sql`

```sql
-- ═══════════════════════════════════════════════════════════════════════════════
// MACRO: generate_column_list
// Itérer sur une liste et générer du SQL pour chaque
// ═════════════════════════════════════════════════════════════════════════════════

{% macro generate_column_list(columns, operation) %}
    {# 
    Objective: Réduire la répétition de code
    
    Exemple d'utilisation:
    {{ generate_column_list(
        ['amount', 'tax', 'discount'],
        'round'
    ) }}
    
    Génère:
    round(amount, 2) as amount,
    round(tax, 2) as tax,
    round(discount, 2) as discount,
    #}
    
    {% for column in columns %}
        {% if operation == 'round' %}
            round({{ column }}, 2) as {{ column }}
        {% elif operation == 'lower' %}
            lower({{ column }}) as {{ column }}
        {% elif operation == 'trim' %}
            trim({{ column }}) as {{ column }}
        {% endif %}
        
        {% if not loop.last %}
            ,
        {% endif %}
    {% endfor %}
{% endmacro %}

-- ═════════════════════════════════════════════════════════════════════════════════
-- UTILISATION:
-- ═════════════════════════════════════════════════════════════════════════════════

-- Avant (sans macro):
-- SELECT
--     order_id,
--     round(amount, 2) as amount,
--     round(tax, 2) as tax,
--     round(discount, 2) as discount
-- FROM orders

-- Après (avec macro):
-- SELECT
--     order_id,
--     {{ generate_column_list(['amount', 'tax', 'discount'], 'round') }}
-- FROM orders
```

### 5️⃣ Configuration Conditionnelle

**Emplacement**: `models/staging/stg_orders.sql`

```sql
-- Configurer différemment selon l'environnement (dev vs prod)

{{
    config(
        materialized='table',
        
        -- En dev: exécuter sans filter (rapide)
        -- En prod: full refresh (complet)
        full_refresh=(target.name == 'prod')
    )
}}

with source as (
    select * from {{ source('raw', 'orders') }}
    
    -- Filtre en dev: tester avec dernière semaine seulement
    {% if target.name == 'dev' %}
        where order_date >= current_date - 7
    {% endif %}
)

select * from source
```

### 6️⃣ Tests Probabilistes (Anomaly Detection)

```yaml
# Détecter les anomalies dans les ventes

- name: daily_revenue
  tests:
    # Moyenne revenu < 1000€? → FAIL (anomalie!)
    - dbt_expectations.expect_column_mean_to_be_between:
        min_value: 1000
        max_value: 100000
        
    # Revenu ne varie pas > 50% jour à jour? → Anomalie
    - dbt_expectations.expect_column_std_to_be_between:
        min_value: 100
        max_value: 10000
```

---

## 11. TROUBLESHOOTING

### Erreur: "Connection test failed"

```powershell
# Cause probable: profiles.yml mal configuré

# Solution 1: Vérifier que profiles.yml existe
Test-Path C:\Users\$env:USERNAME\.dbt\profiles.yml

# Solution 2: Vérifier le contenu
Get-Content C:\Users\$env:USERNAME\.dbt\profiles.yml

# Solution 3: Vérifier que dbt_project.yml pointe au bon profil
Get-Content dbt_project.yml | grep profile

# Solution 4: Vérifier les credentials (az login pour Azure CLI)
az login
```

### Erreur: "Model not found"

```powershell
# Cause probable: {{ ref() }} ou {{ source() }} mal épelé

# Solution: Vérifier les noms
# • {{ ref('stg_customers') }} ← case sensitive!
# • {{ source('raw', 'customers') }} ← vérifier _sources.yml
```

### Performance: Modèles lents

```sql
# Optimizer:

# 1. Utiliser des indexes
config(
    indexes=[
        {'columns': ['customer_id'], 'unique': false}
    ]
)

# 2. Partitionner (si possible)
partition by year(order_date)

# 3. Limiter les données en dev
where order_date >= current_date - 30

# 4. Utiliser incremental
materialized = 'incremental'
unique_key = 'order_id'
```

---

## 📚 RESSOURCES FINALES

- [Documentation dbt officielle](https://docs.getdbt.com/)
- [dbt Discourse (Forum)](https://discourse.getdbt.com/)
- [GitHub dbt-core](https://github.com/dbt-labs/dbt-core)
- [dbt Best Practices](https://docs.getdbt.com/guides/best-practices)

---

**FIN DU GUIDE COMPLET** 🎉

Vous avez maintenant:
✅ Architecture complète avec diagrammes
✅ Installation step-by-step
✅ Configuration commentée ligne par ligne
✅ Models SQL avec explications pédagogiques
✅ Tests expliqués et exemples
✅ Macros et boucles Jinja
✅ Snapshots et SCD Type 2
✅ Seeds et données
✅ Workflows Dev et Prod
✅ Astuces Ninja 🥋
✅ Troubleshooting

Vous êtes prêt à devenir un Expert dbt! 🚀
