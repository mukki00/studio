'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Loader2, Plus, Trash2, LogOut, CheckCircle2, Circle,
  ChevronDown, ChevronUp, CalendarIcon, User, DollarSign,
  Clock, X, ListTree, Pencil, BookOpen, BrainCircuit,
} from 'lucide-react';

/* ── shared style tokens ─────────────────────────── */
const field  = 'w-full h-9 rounded-md border border-accent/20 bg-background/50 px-3 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50';
const lbl    = 'block text-[11px] font-medium text-foreground/55 mb-1';
const badge  = 'inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-accent/5 border border-accent/10 text-foreground/45';

/* ── Quran Surahs ────────────────────────────────── */
const SURAHS: { num: number; name: string; arabic: string; verses: number }[] = [
  { num: 1,   name: 'Al-Fatiha',       arabic: 'الفاتحة',    verses: 7   },
  { num: 2,   name: 'Al-Baqarah',      arabic: 'البقرة',     verses: 286 },
  { num: 3,   name: "Ali 'Imran",      arabic: 'آل عمران',   verses: 200 },
  { num: 4,   name: 'An-Nisa',         arabic: 'النساء',     verses: 176 },
  { num: 5,   name: 'Al-Maidah',       arabic: 'المائدة',    verses: 120 },
  { num: 6,   name: 'Al-Anam',         arabic: 'الأنعام',    verses: 165 },
  { num: 7,   name: 'Al-Araf',         arabic: 'الأعراف',    verses: 206 },
  { num: 8,   name: 'Al-Anfal',        arabic: 'الأنفال',    verses: 75  },
  { num: 9,   name: 'At-Tawbah',       arabic: 'التوبة',     verses: 129 },
  { num: 10,  name: 'Yunus',           arabic: 'يونس',       verses: 109 },
  { num: 11,  name: 'Hud',             arabic: 'هود',        verses: 123 },
  { num: 12,  name: 'Yusuf',           arabic: 'يوسف',       verses: 111 },
  { num: 13,  name: 'Ar-Rad',          arabic: 'الرعد',      verses: 43  },
  { num: 14,  name: 'Ibrahim',         arabic: 'إبراهيم',    verses: 52  },
  { num: 15,  name: 'Al-Hijr',         arabic: 'الحجر',      verses: 99  },
  { num: 16,  name: 'An-Nahl',         arabic: 'النحل',      verses: 128 },
  { num: 17,  name: 'Al-Isra',         arabic: 'الإسراء',    verses: 111 },
  { num: 18,  name: 'Al-Kahf',         arabic: 'الكهف',      verses: 110 },
  { num: 19,  name: 'Maryam',          arabic: 'مريم',       verses: 98  },
  { num: 20,  name: 'Ta-Ha',           arabic: 'طه',         verses: 135 },
  { num: 21,  name: 'Al-Anbiya',       arabic: 'الأنبياء',   verses: 112 },
  { num: 22,  name: 'Al-Hajj',         arabic: 'الحج',       verses: 78  },
  { num: 23,  name: 'Al-Muminun',      arabic: 'المؤمنون',   verses: 118 },
  { num: 24,  name: 'An-Nur',          arabic: 'النور',      verses: 64  },
  { num: 25,  name: 'Al-Furqan',       arabic: 'الفرقان',    verses: 77  },
  { num: 26,  name: 'Ash-Shuara',      arabic: 'الشعراء',    verses: 227 },
  { num: 27,  name: 'An-Naml',         arabic: 'النمل',      verses: 93  },
  { num: 28,  name: 'Al-Qasas',        arabic: 'القصص',      verses: 88  },
  { num: 29,  name: 'Al-Ankabut',      arabic: 'العنكبوت',   verses: 69  },
  { num: 30,  name: 'Ar-Rum',          arabic: 'الروم',      verses: 60  },
  { num: 31,  name: 'Luqman',          arabic: 'لقمان',      verses: 34  },
  { num: 32,  name: 'As-Sajdah',       arabic: 'السجدة',     verses: 30  },
  { num: 33,  name: 'Al-Ahzab',        arabic: 'الأحزاب',    verses: 73  },
  { num: 34,  name: 'Saba',            arabic: 'سبأ',        verses: 54  },
  { num: 35,  name: 'Fatir',           arabic: 'فاطر',       verses: 45  },
  { num: 36,  name: 'Ya-Sin',          arabic: 'يس',         verses: 83  },
  { num: 37,  name: 'As-Saffat',       arabic: 'الصافات',    verses: 182 },
  { num: 38,  name: 'Sad',             arabic: 'ص',          verses: 88  },
  { num: 39,  name: 'Az-Zumar',        arabic: 'الزمر',      verses: 75  },
  { num: 40,  name: 'Ghafir',          arabic: 'غافر',       verses: 85  },
  { num: 41,  name: 'Fussilat',        arabic: 'فصلت',       verses: 54  },
  { num: 42,  name: 'Ash-Shura',       arabic: 'الشورى',     verses: 53  },
  { num: 43,  name: 'Az-Zukhruf',      arabic: 'الزخرف',     verses: 89  },
  { num: 44,  name: 'Ad-Dukhan',       arabic: 'الدخان',     verses: 59  },
  { num: 45,  name: 'Al-Jathiyah',     arabic: 'الجاثية',    verses: 37  },
  { num: 46,  name: 'Al-Ahqaf',        arabic: 'الأحقاف',    verses: 35  },
  { num: 47,  name: 'Muhammad',        arabic: 'محمد',       verses: 38  },
  { num: 48,  name: 'Al-Fath',         arabic: 'الفتح',      verses: 29  },
  { num: 49,  name: 'Al-Hujurat',      arabic: 'الحجرات',    verses: 18  },
  { num: 50,  name: 'Qaf',             arabic: 'ق',          verses: 45  },
  { num: 51,  name: 'Adh-Dhariyat',    arabic: 'الذاريات',   verses: 60  },
  { num: 52,  name: 'At-Tur',          arabic: 'الطور',      verses: 49  },
  { num: 53,  name: 'An-Najm',         arabic: 'النجم',      verses: 62  },
  { num: 54,  name: 'Al-Qamar',        arabic: 'القمر',      verses: 55  },
  { num: 55,  name: 'Ar-Rahman',       arabic: 'الرحمن',     verses: 78  },
  { num: 56,  name: 'Al-Waqiah',       arabic: 'الواقعة',    verses: 96  },
  { num: 57,  name: 'Al-Hadid',        arabic: 'الحديد',     verses: 29  },
  { num: 58,  name: 'Al-Mujadila',     arabic: 'المجادلة',   verses: 22  },
  { num: 59,  name: 'Al-Hashr',        arabic: 'الحشر',      verses: 24  },
  { num: 60,  name: 'Al-Mumtahanah',   arabic: 'الممتحنة',   verses: 13  },
  { num: 61,  name: 'As-Saf',          arabic: 'الصف',       verses: 14  },
  { num: 62,  name: 'Al-Jumuah',       arabic: 'الجمعة',     verses: 11  },
  { num: 63,  name: 'Al-Munafiqun',    arabic: 'المنافقون',  verses: 11  },
  { num: 64,  name: 'At-Taghabun',     arabic: 'التغابن',    verses: 18  },
  { num: 65,  name: 'At-Talaq',        arabic: 'الطلاق',     verses: 12  },
  { num: 66,  name: 'At-Tahrim',       arabic: 'التحريم',    verses: 12  },
  { num: 67,  name: 'Al-Mulk',         arabic: 'الملك',      verses: 30  },
  { num: 68,  name: 'Al-Qalam',        arabic: 'القلم',      verses: 52  },
  { num: 69,  name: 'Al-Haqqah',       arabic: 'الحاقة',     verses: 52  },
  { num: 70,  name: "Al-Ma'arij",      arabic: 'المعارج',    verses: 44  },
  { num: 71,  name: 'Nuh',             arabic: 'نوح',        verses: 28  },
  { num: 72,  name: 'Al-Jinn',         arabic: 'الجن',       verses: 28  },
  { num: 73,  name: 'Al-Muzzammil',    arabic: 'المزمل',     verses: 20  },
  { num: 74,  name: 'Al-Muddaththir',  arabic: 'المدثر',     verses: 56  },
  { num: 75,  name: 'Al-Qiyamah',      arabic: 'القيامة',    verses: 40  },
  { num: 76,  name: 'Al-Insan',        arabic: 'الإنسان',    verses: 31  },
  { num: 77,  name: 'Al-Mursalat',     arabic: 'المرسلات',   verses: 50  },
  { num: 78,  name: "An-Naba'",        arabic: 'النبأ',      verses: 40  },
  { num: 79,  name: "An-Nazi'at",      arabic: 'النازعات',   verses: 46  },
  { num: 80,  name: 'Abasa',           arabic: 'عبس',        verses: 42  },
  { num: 81,  name: 'At-Takwir',       arabic: 'التكوير',    verses: 29  },
  { num: 82,  name: 'Al-Infitar',      arabic: 'الانفطار',   verses: 19  },
  { num: 83,  name: 'Al-Mutaffifin',   arabic: 'المطففين',   verses: 36  },
  { num: 84,  name: 'Al-Inshiqaq',     arabic: 'الانشقاق',   verses: 25  },
  { num: 85,  name: 'Al-Buruj',        arabic: 'البروج',     verses: 22  },
  { num: 86,  name: 'At-Tariq',        arabic: 'الطارق',     verses: 17  },
  { num: 87,  name: 'Al-Ala',          arabic: 'الأعلى',     verses: 19  },
  { num: 88,  name: 'Al-Ghashiyah',    arabic: 'الغاشية',    verses: 26  },
  { num: 89,  name: 'Al-Fajr',         arabic: 'الفجر',      verses: 30  },
  { num: 90,  name: 'Al-Balad',        arabic: 'البلد',      verses: 20  },
  { num: 91,  name: 'Ash-Shams',       arabic: 'الشمس',      verses: 15  },
  { num: 92,  name: 'Al-Layl',         arabic: 'الليل',      verses: 21  },
  { num: 93,  name: 'Ad-Duha',         arabic: 'الضحى',      verses: 11  },
  { num: 94,  name: 'Ash-Sharh',       arabic: 'الشرح',      verses: 8   },
  { num: 95,  name: 'At-Tin',          arabic: 'التين',      verses: 8   },
  { num: 96,  name: 'Al-Alaq',         arabic: 'العلق',      verses: 19  },
  { num: 97,  name: 'Al-Qadr',         arabic: 'القدر',      verses: 5   },
  { num: 98,  name: 'Al-Bayyinah',     arabic: 'البينة',     verses: 8   },
  { num: 99,  name: 'Az-Zalzalah',     arabic: 'الزلزلة',    verses: 8   },
  { num: 100, name: 'Al-Adiyat',       arabic: 'العاديات',   verses: 11  },
  { num: 101, name: "Al-Qari'ah",      arabic: 'القارعة',    verses: 11  },
  { num: 102, name: 'At-Takathur',     arabic: 'التكاثر',    verses: 8   },
  { num: 103, name: 'Al-Asr',          arabic: 'العصر',      verses: 3   },
  { num: 104, name: 'Al-Humazah',      arabic: 'الهمزة',     verses: 9   },
  { num: 105, name: 'Al-Fil',          arabic: 'الفيل',      verses: 5   },
  { num: 106, name: 'Quraysh',         arabic: 'قريش',       verses: 4   },
  { num: 107, name: "Al-Ma'un",        arabic: 'الماعون',    verses: 7   },
  { num: 108, name: 'Al-Kawthar',      arabic: 'الكوثر',     verses: 3   },
  { num: 109, name: 'Al-Kafirun',      arabic: 'الكافرون',   verses: 6   },
  { num: 110, name: 'An-Nasr',         arabic: 'النصر',      verses: 3   },
  { num: 111, name: 'Al-Masad',        arabic: 'المسد',      verses: 5   },
  { num: 112, name: 'Al-Ikhlas',       arabic: 'الإخلاص',    verses: 4   },
  { num: 113, name: 'Al-Falaq',        arabic: 'الفلق',      verses: 5   },
  { num: 114, name: 'An-Nas',          arabic: 'الناس',      verses: 6   },
];

/* ── Tech Architect challenge items ─────────────── */
export interface TechItem { id: number; name: string; category: string; description: string; }
export const TECH_CHALLENGES: TechItem[] = [
  // Architecture Foundations
  { id: 1,  category: 'Architecture Foundations', name: 'Microservices Architecture',          description: 'Design, decompose and communicate between independently deployable services' },
  { id: 2,  category: 'Architecture Foundations', name: 'Event-Driven Architecture',           description: 'Producers, consumers, event brokers and async communication patterns' },
  { id: 3,  category: 'Architecture Foundations', name: 'Domain-Driven Design (DDD)',          description: 'Bounded contexts, aggregates, entities, value objects and ubiquitous language' },
  { id: 4,  category: 'Architecture Foundations', name: 'CQRS & Event Sourcing',               description: 'Separate read/write models and derive state from an immutable event log' },
  { id: 5,  category: 'Architecture Foundations', name: 'Hexagonal / Clean Architecture',      description: 'Ports & adapters pattern — keep domain logic independent of infrastructure' },
  { id: 6,  category: 'Architecture Foundations', name: 'API Design (REST, GraphQL, gRPC)',    description: 'Design robust, versioned and contract-first APIs for internal & external use' },
  { id: 7,  category: 'Architecture Foundations', name: 'Saga Pattern',                        description: 'Manage distributed transactions with choreography or orchestration sagas' },
  { id: 8,  category: 'Architecture Foundations', name: 'Service Mesh (Istio / Linkerd)',       description: 'Sidecar proxies for traffic management, mutual TLS and observability' },
  // System Design
  { id: 9,  category: 'System Design',            name: 'Scalability Patterns',                description: 'Horizontal scaling, sharding, partitioning and stateless service design' },
  { id: 10, category: 'System Design',            name: 'Database Sharding & Replication',     description: 'Partition data for write scale; replicate for read scale and fault tolerance' },
  { id: 11, category: 'System Design',            name: 'Caching Strategies',                  description: 'Cache-aside, write-through, TTL, CDN edge caching and cache invalidation' },
  { id: 12, category: 'System Design',            name: 'Load Balancing & Traffic Management', description: 'Layer 4/7 LB, weighted routing, sticky sessions and global traffic management' },
  { id: 13, category: 'System Design',            name: 'CAP Theorem & Consistency Models',    description: 'Consistency vs availability trade-offs; eventual, strong and causal consistency' },
  { id: 14, category: 'System Design',            name: 'Message Queues (Kafka / RabbitMQ)',   description: 'Topics, partitions, consumer groups, ordering guarantees and dead-letter queues' },
  { id: 15, category: 'System Design',            name: 'Rate Limiting & Throttling',          description: 'Token bucket, leaky bucket, fixed window and distributed rate limiter design' },
  { id: 16, category: 'System Design',            name: 'Circuit Breaker Pattern',             description: 'Protect downstream services with half-open state and fallback strategies' },
  // Cloud & Infrastructure
  { id: 17, category: 'Cloud & Infrastructure',   name: 'Cloud Platform Core Services',        description: 'Compute, storage, networking and managed services across AWS / Azure / GCP' },
  { id: 18, category: 'Cloud & Infrastructure',   name: 'Infrastructure as Code (Terraform)',  description: 'Provision and version infrastructure declaratively; state management and modules' },
  { id: 19, category: 'Cloud & Infrastructure',   name: 'Kubernetes & Container Orchestration',description: 'Deployments, services, ingress, RBAC, HPA and cluster administration' },
  { id: 20, category: 'Cloud & Infrastructure',   name: 'CI/CD Pipeline Design',               description: 'Build, test, security scan, artefact management and progressive delivery' },
  { id: 21, category: 'Cloud & Infrastructure',   name: 'Serverless Architecture',             description: 'Functions, event triggers, cold starts, vendor lock-in trade-offs' },
  { id: 22, category: 'Cloud & Infrastructure',   name: 'Multi-region Deployment',             description: 'Active-active vs active-passive, data sovereignty and latency optimisation' },
  { id: 23, category: 'Cloud & Infrastructure',   name: 'Cloud Cost Optimisation',             description: 'Reserved/spot instances, right-sizing, tagging and FinOps practices' },
  { id: 24, category: 'Cloud & Infrastructure',   name: 'Site Reliability Engineering (SRE)',  description: 'Error budgets, toil reduction, runbooks and on-call practices' },
  // Security Architecture
  { id: 25, category: 'Security Architecture',    name: 'Zero Trust Architecture',             description: 'Never trust, always verify — microsegmentation and least-privilege access' },
  { id: 26, category: 'Security Architecture',    name: 'OAuth2 / OpenID Connect / JWT',       description: 'Auth flows, token lifecycle, refresh strategies and PKCE' },
  { id: 27, category: 'Security Architecture',    name: 'Secrets Management',                  description: 'HashiCorp Vault, AWS Secrets Manager — rotation, leasing and dynamic secrets' },
  { id: 28, category: 'Security Architecture',    name: 'Network Security & VPC Design',       description: 'Subnets, security groups, NACLs, private link and DMZ architecture' },
  { id: 29, category: 'Security Architecture',    name: 'Identity & Access Management (IAM)',  description: 'Role hierarchies, policy evaluation, federation and privilege escalation prevention' },
  { id: 30, category: 'Security Architecture',    name: 'Threat Modelling & Security by Design', description: 'STRIDE, PASTA, data flow diagrams and security review in design phase' },
  // Observability & Reliability
  { id: 31, category: 'Observability & Reliability', name: 'Distributed Tracing',             description: 'Trace context propagation, span sampling and Jaeger / Zipkin / OTEL' },
  { id: 32, category: 'Observability & Reliability', name: 'Centralised Logging',             description: 'Structured logs, ELK / Splunk / Loki pipelines and log-based alerting' },
  { id: 33, category: 'Observability & Reliability', name: 'Metrics & Alerting',              description: 'RED / USE method, Prometheus, Grafana dashboards and PagerDuty integration' },
  { id: 34, category: 'Observability & Reliability', name: 'SLO / SLI / SLA Definition',     description: 'Define reliability targets, error budgets and customer-facing commitments' },
  { id: 35, category: 'Observability & Reliability', name: 'Disaster Recovery Planning',      description: 'RTO / RPO targets, backup strategies, runbooks and DR drills' },
  { id: 36, category: 'Observability & Reliability', name: 'Chaos Engineering',               description: 'Game days, failure injection, Chaos Monkey and blast-radius control' },
  // Data Architecture
  { id: 37, category: 'Data Architecture',        name: 'Data Modelling & Schema Design',      description: 'Normalisation, denormalisation, schema evolution and contract testing' },
  { id: 38, category: 'Data Architecture',        name: 'Data Lake vs Data Warehouse',         description: 'Storage tiers, schema-on-read vs schema-on-write and lakehouse patterns' },
  { id: 39, category: 'Data Architecture',        name: 'Stream vs Batch Processing',          description: 'Flink, Spark Streaming, Lambda architecture and exactly-once semantics' },
  { id: 40, category: 'Data Architecture',        name: 'Database Selection Criteria',         description: 'SQL vs NoSQL trade-offs — document, columnar, graph and time-series stores' },
  { id: 41, category: 'Data Architecture',        name: 'Data Privacy & GDPR Compliance',      description: 'Data classification, PII handling, right to erasure and data retention policies' },
  { id: 42, category: 'Data Architecture',        name: 'Data Mesh Architecture',              description: 'Domain ownership, data as a product and federated computational governance' },
  // Leadership & Communication
  { id: 43, category: 'Leadership & Communication', name: 'Architecture Decision Records (ADRs)', description: 'Document context, decision and consequences — build a searchable architecture log' },
  { id: 44, category: 'Leadership & Communication', name: 'Technical Roadmapping',             description: 'Prioritise initiatives, align with business goals and communicate milestones' },
  { id: 45, category: 'Leadership & Communication', name: 'Stakeholder Communication',         description: 'Translate technical concepts for non-technical audiences and exec presentations' },
  { id: 46, category: 'Leadership & Communication', name: 'Technology Evaluation & Vendor Selection', description: 'RFP / PoC frameworks, TCO analysis and build vs buy decisions' },
  { id: 47, category: 'Leadership & Communication', name: 'Technical Risk Assessment',         description: 'Identify, score and mitigate architectural risks with risk registers' },
  { id: 48, category: 'Leadership & Communication', name: 'Team Mentoring & Coaching',         description: 'Grow engineers, conduct architecture reviews and build a learning culture' },
  // Containers & DevOps Tools
  { id: 49, category: 'Containers & DevOps Tools', name: 'Docker & Containerisation',           description: 'Dockerfiles, multi-stage builds, image layering, networking and security best practices' },
  { id: 50, category: 'Containers & DevOps Tools', name: 'Helm Charts & K8s Packaging',         description: 'Chart structure, templating, values overrides, hooks and chart repositories' },
  { id: 51, category: 'Containers & DevOps Tools', name: 'GitOps (ArgoCD / Flux)',              description: 'Declarative deployments driven from Git — sync policies, drift detection and rollback' },
  { id: 52, category: 'Containers & DevOps Tools', name: 'HashiCorp Stack (Vault / Consul)',     description: 'Service discovery, distributed config, secret injection and dynamic credentials' },
  { id: 53, category: 'Containers & DevOps Tools', name: 'Ansible & Config Management',         description: 'Idempotent playbooks, roles, inventories and CM vs IaC trade-offs' },
  { id: 54, category: 'Containers & DevOps Tools', name: 'Build Tools & Artefact Management',   description: 'Gradle/Maven, Nx/Turborepo monorepos, Nexus/Artifactory and dependency pinning' },
  // Programming Languages
  { id: 55, category: 'Programming Languages',     name: 'TypeScript / JavaScript (Node.js)',   description: 'Type-safe backends, async patterns, Node.js event loop and module ecosystem' },
  { id: 56, category: 'Programming Languages',     name: 'Python (FastAPI / Scripting / ML)',    description: 'API development, automation scripting, data pipelines and ML integration' },
  { id: 57, category: 'Programming Languages',     name: 'Go (Microservices & CLI Tools)',       description: 'Goroutines, channels, low-latency services, CLI tooling and binary distribution' },
  { id: 58, category: 'Programming Languages',     name: 'Java / Kotlin (JVM & Spring Boot)',    description: 'JVM internals, Spring Boot ecosystem, reactive streams and enterprise patterns' },
  { id: 59, category: 'Programming Languages',     name: 'SQL & Query Optimisation',             description: 'Execution plans, index strategies, window functions and OLAP vs OLTP query patterns' },
  { id: 60, category: 'Programming Languages',     name: 'Rust / C++ (Systems Awareness)',       description: 'Memory model, ownership, WASM targets and when to choose systems languages' },
  // AI & GenAI Architecture
  { id: 61, category: 'AI & GenAI Architecture',   name: 'LLM Integration Patterns',             description: 'Prompt chaining, tool-calling, function calling, LLM-as-orchestrator and guardrails' },
  { id: 62, category: 'AI & GenAI Architecture',   name: 'RAG (Retrieval-Augmented Generation)',  description: 'Chunking strategies, embedding models, vector similarity search and reranking' },
  { id: 63, category: 'AI & GenAI Architecture',   name: 'Vector Databases',                      description: 'Pinecone, Weaviate, pgvector — indexing, ANN search and hybrid retrieval' },
  { id: 64, category: 'AI & GenAI Architecture',   name: 'AI Pipeline & MLOps',                   description: 'Feature stores, model registry, A/B testing, drift detection and retraining loops' },
  { id: 65, category: 'AI & GenAI Architecture',   name: 'AI Safety & Responsible AI',            description: 'Bias evaluation, explainability, content filtering, rate limits and cost control' },
  { id: 66, category: 'AI & GenAI Architecture',   name: 'Agentic Systems Design',               description: 'Multi-agent orchestration, tool use, memory layers and evaluation frameworks' },
  // Performance Engineering
  { id: 67, category: 'Performance Engineering',   name: 'Load & Stress Testing',                description: 'k6, JMeter, Gatling — test design, ramp-up profiles and interpreting p95/p99 results' },
  { id: 68, category: 'Performance Engineering',   name: 'Application Profiling',                description: 'CPU/heap profiling, flame graphs, GC tuning and hot-path identification' },
  { id: 69, category: 'Performance Engineering',   name: 'Database Query Optimisation',          description: 'EXPLAIN plans, index design, N+1 elimination, connection pooling and query caching' },
  { id: 70, category: 'Performance Engineering',   name: 'Performance Budgets & SLAs',           description: 'Define perf targets, automate regression gates in CI and tie to SLOs' },
  { id: 71, category: 'Performance Engineering',   name: 'Network & Latency Optimisation',       description: 'Keep-alive, HTTP/2 multiplexing, payload compression, pre-fetching and CDN tuning' },
  { id: 72, category: 'Performance Engineering',   name: 'Concurrency & Async Patterns',         description: 'Thread pools, async/await, reactive streams and back-pressure handling' },
  // Networking Fundamentals
  { id: 73, category: 'Networking Fundamentals',   name: 'TCP/IP & OSI Model',                   description: 'Packet flow, handshakes, congestion control and how layers affect service design' },
  { id: 74, category: 'Networking Fundamentals',   name: 'DNS, TLS & Certificate Management',    description: 'Resolution chain, mTLS, cert rotation, ACME/Let\'s Encrypt and HSTS' },
  { id: 75, category: 'Networking Fundamentals',   name: 'HTTP/2, HTTP/3 & WebSockets',          description: 'Multiplexing, QUIC, server-push, long-lived connections and protocol selection' },
  { id: 76, category: 'Networking Fundamentals',   name: 'CDN Strategy & Edge Computing',        description: 'Cache-control headers, origin shield, edge functions and global PoP routing' },
  { id: 77, category: 'Networking Fundamentals',   name: 'API Gateway & Reverse Proxy',          description: 'NGINX, Kong, AWS API GW — routing, auth offload, request transformation and quotas' },
  { id: 78, category: 'Networking Fundamentals',   name: 'Network Observability',               description: 'Flow logs, packet capture, latency tracing and diagnosing intermittent network faults' },
  // Legacy Modernisation
  { id: 79, category: 'Legacy Modernisation',      name: 'Strangler Fig Pattern',               description: 'Incrementally replace legacy systems by routing traffic to new services alongside old' },
  { id: 80, category: 'Legacy Modernisation',      name: 'Technical Debt Management',           description: 'Classify, score and schedule debt paydown alongside feature delivery' },
  { id: 81, category: 'Legacy Modernisation',      name: 'Monolith-to-Microservices Migration', description: 'Identify seams, extract bounded contexts and manage data ownership during transition' },
  { id: 82, category: 'Legacy Modernisation',      name: 'Database Migration Strategies',       description: 'Dual-write, expand-contract, online schema change and zero-downtime migrations' },
  { id: 83, category: 'Legacy Modernisation',      name: 'API Versioning & Backward Compatibility', description: 'Semver, sunset policies, consumer-driven contracts and breaking-change detection' },
  { id: 84, category: 'Legacy Modernisation',      name: 'Replatforming vs Rewriting',          description: 'Lift-and-shift, re-architect and full rewrite trade-offs — risk, cost and timeline analysis' },
];
const TECH_TOTAL = TECH_CHALLENGES.length; // 84

/* ── module-level helpers ────────────────────────── */
const emptyDraft = { text: '', startDate: '', assignee: '', assigneeOther: '', budget: '', estHours: '' };
function fmtCurrency(amount: number, currency: string) {
  const sym = currency === 'LKR' ? '₨' : '$';
  return `${sym}${amount.toLocaleString()} ${currency}`;
}

/** Returns the last date (YYYY-MM-DD) of a task's duration, or undefined if not calculable. */
function calcTaskEndDateStr(startDate: string | null | undefined, estimatedHours: number | null | undefined, estimatedUnit: string | null | undefined): string | undefined {
  if (!startDate || estimatedHours == null) return undefined;
  const days = (estimatedUnit === 'days') ? Math.ceil(estimatedHours) : Math.ceil(estimatedHours / 24);
  const end = new Date(startDate + 'T00:00:00');
  end.setDate(end.getDate() + Math.max(days, 1) - 1);
  return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
}

/** Max estimate a subtask can have given its start date and the parent end date. */
function calcMaxSubEstimate(subStartDate: string, parentEndDateStr: string | undefined, unit: string): number | undefined {
  if (!subStartDate || !parentEndDateStr) return undefined;
  const start = new Date(subStartDate + 'T00:00:00');
  const end   = new Date(parentEndDateStr + 'T00:00:00');
  const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays <= 0) return 0;
  return unit === 'days' ? diffDays : diffDays * 24;
}

/** Advance a YYYY-MM-DD start date by one recurrence interval. */
function nextRecurringDate(startDate: string | null, freq: RecurringFrequency): string | null {
  if (!startDate) return null;
  const d = new Date(startDate + 'T00:00:00');
  switch (freq) {
    case 'daily':    d.setDate(d.getDate() + 1);    break;
    case 'weekly':   d.setDate(d.getDate() + 7);    break;
    case 'biweekly': d.setDate(d.getDate() + 14);   break;
    case 'monthly':  d.setMonth(d.getMonth() + 1);  break;
    case 'yearly':   d.setFullYear(d.getFullYear() + 1); break;
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ── types ───────────────────────────────────────── */
type Priority = 'critical' | 'high' | 'medium' | 'low';

const PRIORITY_ORDER: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const PRIORITY_LABEL: Record<Priority, string> = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
const PRIORITY_STYLES: Record<Priority, string> = {
  critical: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400',
  high:     'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
  medium:   'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400',
  low:      'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400',
};

type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
const RECURRING_OPTIONS: { value: RecurringFrequency; label: string; short: string }[] = [
  { value: 'daily',    label: 'Daily',         short: 'Daily' },
  { value: 'weekly',   label: 'Weekly',        short: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks', short: 'Biweekly' },
  { value: 'monthly',  label: 'Monthly',       short: 'Monthly' },
  { value: 'yearly',   label: 'Yearly',        short: 'Yearly' },
];

interface Subtask {
  text: string;
  done: boolean;
  startDate: string | null;
  assignee: string | null;
  budget: number | null;
  estimatedHours: number | null;
  progress: number | null;
}

interface Todo {
  id: string;
  text: string;
  done: boolean;
  startDate: string | null;
  assignee: string | null;
  budget: number | null;
  budgetCurrency: string;
  estimatedHours: number | null;
  estimatedUnit: string;
  subtasks: Subtask[];
  createdAt: Date | null;
  progress: number | null;
  priority: Priority | null;
  recurring: RecurringFrequency | null;
}

export default function TodoPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [todos, setTodos]       = useState<Todo[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  /* form state */
  const [formOpen,           setFormOpen]           = useState(false);
  const [adding,             setAdding]             = useState(false);
  const [newText,            setNewText]            = useState('');
  const [newDate,            setNewDate]            = useState('');
  const [newAssignee,        setNewAssignee]        = useState('');
  const [newAssigneeOther,   setNewAssigneeOther]   = useState('');
  const [newBudget,          setNewBudget]          = useState('');
  const [newBudgetCurrency,  setNewBudgetCurrency]  = useState<'USD' | 'LKR'>('USD');
  const [newEstHours,        setNewEstHours]        = useState('');
  const [newEstUnit,         setNewEstUnit]         = useState<'hrs' | 'days'>('hrs');
  const [newPriority,        setNewPriority]        = useState<Priority | null>(null);
  const [newRecurring,       setNewRecurring]       = useState<RecurringFrequency | null>(null);
  const [newSubtasks,  setNewSubtasks]  = useState<Subtask[]>([]);
  const [stFormOpen,   setStFormOpen]   = useState(false);
  const [stDraft,      setStDraft]      = useState(emptyDraft);
  const [stError,      setStError]      = useState('');

  /* add-subtask-to-existing-task state */
  const [activeSubtaskId, setActiveSubtaskId] = useState<string | null>(null);
  const [subDraft,        setSubDraft]        = useState(emptyDraft);
  const [subError,        setSubError]        = useState('');

  /* expanded subtask panels */
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  /* delete confirmation */
  const [confirmDeleteId,  setConfirmDeleteId]  = useState<string | null>(null);
  const [confirmDeleteSub, setConfirmDeleteSub] = useState<{ todoId: string; subIndex: number } | null>(null);
  const [confirmDoneId,    setConfirmDoneId]    = useState<string | null>(null);
  const [confirmDoneSub,   setConfirmDoneSub]   = useState<{ todoId: string; subIndex: number } | null>(null);

  /* edit task state */
  const [editingTaskId,  setEditingTaskId]  = useState<string | null>(null);
  const [editTaskDraft,  setEditTaskDraft]  = useState({
    text: '', startDate: '', assignee: '', assigneeOther: '',
    budget: '', budgetCurrency: 'USD' as 'USD' | 'LKR',
    estHours: '', estUnit: 'hrs' as 'hrs' | 'days',
    priority: null as Priority | null,
    recurring: null as RecurringFrequency | null,
  });

  /* edit subtask state */
  const [editingSubtask, setEditingSubtask] = useState<{ todoId: string; index: number } | null>(null);
  const [editSubDraft,   setEditSubDraft]   = useState(emptyDraft);
  const [editLoading,    setEditLoading]    = useState(false);

  /* progress inline editing */
  const [editingProgressId,  setEditingProgressId]  = useState<string | null>(null);
  const [editingSubProgress, setEditingSubProgress] = useState<{ todoId: string; subIndex: number } | null>(null);
  const [progressDraft,      setProgressDraft]      = useState('');

  /* filter */
  const [filter, setFilter] = useState<'all' | 'pending'>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAssignees, setSelectedAssignees] = useState<Set<string>>(new Set());
  const [selectedPriorities, setSelectedPriorities] = useState<Set<Priority>>(new Set());

  /* ── Quran challenge state ────────────────────── */
  const [completedSurahs,    setCompletedSurahs]    = useState<Set<number>>(new Set());
  const [confirmSurahNum,    setConfirmSurahNum]    = useState<number | null>(null);
  const [surahJustDone,      setSurahJustDone]      = useState<number | null>(null);

  /* ── Tech Architect challenge state ──────────── */
  const [challengeTab,       setChallengeTab]       = useState<'quran' | 'tech'>('quran');
  const [completedTechItems, setCompletedTechItems] = useState<Set<number>>(new Set());
  const [confirmTechId,      setConfirmTechId]      = useState<number | null>(null);
  const [techJustDone,       setTechJustDone]       = useState<number | null>(null);

  // Auth guard
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  // Fetch all todos from MongoDB
  const fetchTodos = useCallback(async () => {
    try {
      const res  = await fetch('/api/workload');
      const data = await res.json() as Todo[];
      setTodos(data);
    } catch (err) {
      console.error('fetchTodos', err);
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user, fetchTodos]);

  // Load Quran challenge progress from MongoDB
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res  = await fetch(`/api/quran-challenge?uid=${encodeURIComponent(user.uid)}`);
        const data = await res.json() as {
          surahs?: Record<string, { done: boolean; completedAt: string | null }>;
        };
        if (data.surahs) {
          const done = new Set<number>();
          for (const [key, val] of Object.entries(data.surahs)) {
            if (val.done) done.add(Number(key));
          }
          setCompletedSurahs(done);
        } else {
          // Doc doesn't exist yet — initialise it
          await fetch('/api/quran-challenge', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ uid: user.uid }),
          });
        }
      } catch (err) {
        console.error('load quranChallenge', err);
      }
    })();
  }, [user]);

  async function handleMarkSurahDone(num: number) {
    if (!user) return;
    // Optimistically update UI and close dialog immediately
    const next = new Set(completedSurahs);
    next.add(num);
    setCompletedSurahs(next);
    setConfirmSurahNum(null);
    setSurahJustDone(num);
    setTimeout(() => setSurahJustDone(null), 3000);
    // Persist to MongoDB
    try {
      await fetch('/api/quran-challenge', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid: user.uid, surahNum: num, done: true }),
      });
    } catch (err) {
      console.warn('markSurahDone error:', err);
    }
  }

  async function handleUnmarkSurah(num: number) {
    if (!user) return;
    const next = new Set(completedSurahs);
    next.delete(num);
    setCompletedSurahs(next);
    try {
      await fetch('/api/quran-challenge', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid: user.uid, surahNum: num, done: false }),
      });
    } catch (err) {
      console.warn('unmarkSurah error:', err);
    }
  }

  /* ── Tech Architect challenge handlers ─────────── */
  // Load progress from MongoDB
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res  = await fetch(`/api/tech-challenge?uid=${encodeURIComponent(user.uid)}`);
        const data = await res.json() as { items?: Record<string, { done: boolean }> };
        if (data.items && Object.keys(data.items).length > 0) {
          const done = new Set<number>();
          for (const [key, val] of Object.entries(data.items)) {
            if (val.done) done.add(Number(key));
          }
          setCompletedTechItems(done);
        } else {
          await fetch('/api/tech-challenge', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ uid: user.uid, totalItems: TECH_TOTAL }),
          });
        }
      } catch (err) {
        console.error('load techChallenge', err);
      }
    })();
  }, [user]);

  async function handleMarkTechDone(id: number) {
    if (!user) return;
    const next = new Set(completedTechItems);
    next.add(id);
    setCompletedTechItems(next);
    setConfirmTechId(null);
    setTechJustDone(id);
    setTimeout(() => setTechJustDone(null), 3000);
    try {
      await fetch('/api/tech-challenge', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid: user.uid, itemId: id, done: true }),
      });
    } catch (err) {
      console.warn('markTechDone error:', err);
    }
  }

  async function handleUnmarkTechItem(id: number) {
    if (!user) return;
    const next = new Set(completedTechItems);
    next.delete(id);
    setCompletedTechItems(next);
    try {
      await fetch('/api/tech-challenge', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid: user.uid, itemId: id, done: false }),
      });
    } catch (err) {
      console.warn('unmarkTechItem error:', err);
    }
  }

  /* ── form helpers ────────────────────────────── */
  function commitSubtask() {
    if (!stDraft.text.trim()) { setStError('Title is required'); return; }
    const parentBudget = newBudget !== '' ? parseFloat(newBudget) : null;
    const parentEst    = newEstHours !== '' ? parseFloat(newEstHours) : null;
    const usedBudget   = newSubtasks.reduce((s, t) => s + (t.budget ?? 0), 0);
    const usedEst      = newSubtasks.reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
    if (parentBudget !== null && stDraft.budget !== '') {
      const b = parseFloat(stDraft.budget);
      if (usedBudget + b > parentBudget) {
        setStError(`Budget exceeds remaining ${fmtCurrency(parentBudget - usedBudget, newBudgetCurrency)}`); return;
      }
    }
    if (parentEst !== null && stDraft.estHours !== '') {
      const e = parseFloat(stDraft.estHours);
      if (usedEst + e > parentEst) {
        setStError(`Exceeds remaining estimate (${parentEst - usedEst} ${newEstUnit})`); return;
      }
    }
    setNewSubtasks((p) => [...p, {
      text:           stDraft.text.trim(),
      done:           false,
      startDate:      stDraft.startDate || null,
      assignee:       stDraft.assignee === 'other' ? (stDraft.assigneeOther.trim() || null) : (stDraft.assignee || null),
      budget:         stDraft.budget !== '' ? parseFloat(stDraft.budget) : null,
      estimatedHours: stDraft.estHours !== '' ? parseFloat(stDraft.estHours) : null,
      progress:       null,
    }]);
    setStDraft(emptyDraft); setStError(''); setStFormOpen(false);
  }

  function resetForm() {
    setNewText(''); setNewDate(''); setNewAssignee('');
    setNewAssigneeOther(''); setNewBudget('');
    setNewBudgetCurrency('USD'); setNewEstHours('');
    setNewEstUnit('hrs'); setNewSubtasks([]);
    setNewPriority(null);
    setNewRecurring(null);
    setStDraft(emptyDraft); setStFormOpen(false); setStError('');
  }

  /* ── CRUD ────────────────────────────────────── */
  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newText.trim() || !user) return;
    setAdding(true);
    const res = await fetch('/api/workload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text:           newText.trim(),
        startDate:      newDate || null,
        assignee:       newAssignee === 'other'
                          ? (newAssigneeOther.trim() || null)
                          : (newAssignee || null),
        budget:         newBudget !== '' ? parseFloat(newBudget) : null,
        budgetCurrency: newBudgetCurrency,
        estimatedHours: newEstHours !== '' ? parseFloat(newEstHours) : null,
        estimatedUnit:  newEstUnit,
        priority:       newPriority,
        recurring:      newRecurring,
        subtasks:       newSubtasks,
      }),
    });
    const created = await res.json() as Todo;
    setTodos((p) => [...p, created]);
    resetForm();
    setFormOpen(false);
    setAdding(false);
  }

  async function toggleTodo(todo: Todo) {
    const newDone = !todo.done;
    if (newDone) {
      // Marking done → progress branch sets both progress: 100 and done: true
      await fetch('/api/workload', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, progress: 100 }),
      });
      setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, done: true, progress: 100 } : t));

      // Auto-create next occurrence for recurring tasks
      if (todo.recurring) {
        const nextStart = nextRecurringDate(todo.startDate, todo.recurring);
        const res = await fetch('/api/workload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text:           todo.text,
            startDate:      nextStart,
            assignee:       todo.assignee,
            budget:         todo.budget,
            budgetCurrency: todo.budgetCurrency,
            estimatedHours: todo.estimatedHours,
            estimatedUnit:  todo.estimatedUnit,
            priority:       todo.priority,
            recurring:      todo.recurring,
            subtasks:       todo.subtasks.map((s) => ({ ...s, done: false, progress: null })),
          }),
        });
        const next = await res.json() as Todo;
        setTodos((p) => [...p, next]);
      }
    } else {
      await fetch('/api/workload', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, done: false }),
      });
      setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, done: false } : t));
    }
  }

  async function toggleSubtask(todo: Todo, idx: number) {
    const newDone = !todo.subtasks[idx].done;
    // When checking a subtask, also set its progress to 100
    const updated = todo.subtasks.map((s, i) =>
      i === idx ? { ...s, done: newDone, ...(newDone ? { progress: 100 } : {}) } : s
    );
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, subtaskIndex: idx, done: newDone }),
    });
    // Auto-complete the parent task if all subtasks are now done
    const allDone = updated.length > 0 && updated.every((s) => s.done);
    if (allDone && !todo.done) {
      await fetch('/api/workload', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todo.id, progress: 100 }),
      });
      setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, done: true, progress: 100, subtasks: updated } : t));
    } else {
      setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, subtasks: updated } : t));
    }
  }

  async function addSubtaskToTodo(todo: Todo) {
    if (!subDraft.text.trim()) { setSubError('Title is required'); return; }
    const usedBudget = (todo.subtasks ?? []).reduce((s, t) => s + (t.budget ?? 0), 0);
    const usedEst    = (todo.subtasks ?? []).reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
    if (todo.budget !== null && subDraft.budget !== '') {
      const b = parseFloat(subDraft.budget);
      if (usedBudget + b > todo.budget) {
        setSubError(`Budget exceeds remaining ${fmtCurrency(todo.budget - usedBudget, todo.budgetCurrency)}`); return;
      }
    }
    if (todo.estimatedHours !== null && subDraft.estHours !== '') {
      const e = parseFloat(subDraft.estHours);
      if (usedEst + e > todo.estimatedHours) {
        setSubError(`Exceeds remaining estimate (${todo.estimatedHours - usedEst} ${todo.estimatedUnit})`); return;
      }
    }
    const newSub: Subtask = {
      text:           subDraft.text.trim(),
      done:           false,
      startDate:      subDraft.startDate || null,
      assignee:       subDraft.assignee === 'other' ? (subDraft.assigneeOther.trim() || null) : (subDraft.assignee || null),
      budget:         subDraft.budget !== '' ? parseFloat(subDraft.budget) : null,
      estimatedHours: subDraft.estHours !== '' ? parseFloat(subDraft.estHours) : null,
      progress:       null,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, addSubtask: newSub }),
    });
    setTodos((p) => p.map((t) => t.id === todo.id ? { ...t, subtasks: [...(t.subtasks ?? []), newSub] } : t));
    setActiveSubtaskId(null);
    setSubDraft(emptyDraft);
    setSubError('');
    // ensure panel stays expanded
    setExpanded((p) => { const s = new Set(p); s.add(todo.id); return s; });
  }

  async function deleteTodo(id: string) {
    setConfirmDeleteId(null);
    await fetch('/api/workload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTodos((p) => p.filter((t) => t.id !== id));
  }

  async function deleteSubtask(todoId: string, subIndex: number) {
    setConfirmDeleteSub(null);
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todoId, deleteSubtaskIndex: subIndex }),
    });
    setTodos((p) => p.map((t) =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.filter((_, i) => i !== subIndex) }
        : t
    ));
  }

  async function saveEditTask() {
    if (!editingTaskId || !editTaskDraft.text.trim()) return;
    setEditLoading(true);
    const patch = {
      text:           editTaskDraft.text.trim(),
      startDate:      editTaskDraft.startDate || null,
      assignee:       editTaskDraft.assignee === 'other'
                        ? (editTaskDraft.assigneeOther.trim() || null)
                        : (editTaskDraft.assignee || null),
      budget:         editTaskDraft.budget !== '' ? parseFloat(editTaskDraft.budget) : null,
      budgetCurrency: editTaskDraft.budgetCurrency,
      estimatedHours: editTaskDraft.estHours !== '' ? parseFloat(editTaskDraft.estHours) : null,
      estimatedUnit:  editTaskDraft.estUnit,
      priority:       editTaskDraft.priority,
      recurring:      editTaskDraft.recurring,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingTaskId, updateTask: patch }),
    });
    setTodos((p) => p.map((t) => t.id === editingTaskId ? { ...t, ...patch } : t));
    setEditingTaskId(null);
    setEditLoading(false);
  }

  async function saveEditSubtask() {
    if (!editingSubtask || !editSubDraft.text.trim()) return;
    const { todoId, index } = editingSubtask;
    const parentTodo = todos.find((t) => t.id === todoId)!;
    setEditLoading(true);
    const updatedSub: Subtask = {
      text:           editSubDraft.text.trim(),
      done:           parentTodo.subtasks[index].done,
      startDate:      editSubDraft.startDate || null,
      assignee:       editSubDraft.assignee === 'other'
                        ? (editSubDraft.assigneeOther.trim() || null)
                        : (editSubDraft.assignee || null),
      budget:         editSubDraft.budget !== '' ? parseFloat(editSubDraft.budget) : null,
      estimatedHours: editSubDraft.estHours !== '' ? parseFloat(editSubDraft.estHours) : null,
      progress:       parentTodo.subtasks[index].progress,
    };
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todoId, subtaskIndex: index, updateSubtask: updatedSub }),
    });
    setTodos((p) => p.map((t) =>
      t.id === todoId
        ? { ...t, subtasks: t.subtasks.map((s, i) => i === index ? updatedSub : s) }
        : t
    ));
    setEditingSubtask(null);
    setEditSubDraft(emptyDraft);
    setEditLoading(false);
  }

  async function updateTaskProgress(todoId: string, progress: number) {
    const p = Math.max(0, Math.min(100, Math.round(progress)));
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todoId, progress: p }),
    });
    setTodos((prev) => prev.map((t) =>
      t.id === todoId ? { ...t, progress: p, done: p === 100 ? true : t.done } : t
    ));
    setEditingProgressId(null);
  }

  async function updateSubtaskProgress(todoId: string, subIndex: number, progress: number) {
    const p = Math.max(0, Math.min(100, Math.round(progress)));
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;
    const updatedSubs = todo.subtasks.map((s, i) =>
      i === subIndex ? { ...s, progress: p, done: p === 100 ? true : s.done } : s
    );
    const allDone = updatedSubs.length > 0 && updatedSubs.every((s) => s.done || (s.progress ?? 0) >= 100);
    await fetch('/api/workload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todoId, subtaskIndex: subIndex, subProgress: p }),
    });
    if (allDone && !todo.done) {
      await fetch('/api/workload', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: todoId, done: true }),
      });
    }
    setTodos((prev) => prev.map((t) =>
      t.id === todoId ? { ...t, done: allDone ? true : t.done, subtasks: updatedSubs } : t
    ));
    setEditingSubProgress(null);
  }

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  /* ── derived values & memos (must all be before any early return) ── */
  const toLocalDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const selectedDateStr = selectedDate ? toLocalDateStr(selectedDate) : null;

  const getTaskPeriodDates = (t: Todo): string[] => {
    if (!t.startDate) return [];
    const start = new Date(t.startDate + 'T00:00:00');
    let days = 0;
    if (t.estimatedHours != null) {
      days = t.estimatedUnit === 'days' ? Math.ceil(t.estimatedHours) : Math.ceil(t.estimatedHours / 24);
    }
    const totalDays = Math.max(days, 1);
    const dates: string[] = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(toLocalDateStr(d));
    }
    return dates;
  };

  const dateFilteredTodos = selectedDateStr
    ? todos.filter((t) => getTaskPeriodDates(t).includes(selectedDateStr))
    : todos;
  const assigneeFilteredTodos = selectedAssignees.size > 0
    ? dateFilteredTodos.filter((t) => t.assignee && selectedAssignees.has(t.assignee))
    : dateFilteredTodos;
  const priorityFilteredTodos = selectedPriorities.size > 0
    ? assigneeFilteredTodos.filter((t) => t.priority && selectedPriorities.has(t.priority))
    : assigneeFilteredTodos;
  const filteredTodos = (filter === 'pending' ? priorityFilteredTodos.filter((t) => !t.done) : priorityFilteredTodos)
    .slice()
    .sort((a, b) => {
      const pa = a.priority ? PRIORITY_ORDER[a.priority] : 999;
      const pb = b.priority ? PRIORITY_ORDER[b.priority] : 999;
      if (pa !== pb) return pa - pb;
      if (a.done !== b.done) return a.done ? 1 : -1;
      return 0;
    });

  const filteredBudgetUSD   = filteredTodos.reduce((s, t) => t.budget != null && t.budgetCurrency === 'USD' ? s + t.budget : s, 0);
  const filteredBudgetLKR   = filteredTodos.reduce((s, t) => t.budget != null && t.budgetCurrency === 'LKR' ? s + t.budget : s, 0);
  const spentBudgetUSD      = filteredTodos.reduce((s, t) => t.done && t.budget != null && t.budgetCurrency === 'USD' ? s + t.budget : s, 0);
  const spentBudgetLKR      = filteredTodos.reduce((s, t) => t.done && t.budget != null && t.budgetCurrency === 'LKR' ? s + t.budget : s, 0);
  const remainingBudgetUSD  = filteredBudgetUSD - spentBudgetUSD;
  const remainingBudgetLKR  = filteredBudgetLKR - spentBudgetLKR;
  const hasAnyBudget        = todos.some((t) => t.budget != null);
  const isFiltered          = selectedDate !== undefined || selectedAssignees.size > 0 || selectedPriorities.size > 0 || filter === 'pending';
  const remaining         = todos.filter((t) => !t.done).length;

  const allAssignees = useMemo(
    () => Array.from(new Set(todos.map((t) => t.assignee).filter(Boolean) as string[])).sort(),
    [todos],
  );

  const taskDateCounts = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    for (const t of todos) {
      for (const d of getTaskPeriodDates(t)) {
        const prev = map.get(d) ?? { total: 0, done: 0 };
        map.set(d, { total: prev.total + 1, done: prev.done + (t.done ? 1 : 0) });
      }
    }
    return map;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todos]);

  const CalDayContent = useMemo(() => {
    return function DayContent({ date }: { date: Date; displayMonth: Date }) {
      const entry = taskDateCounts.get(toLocalDateStr(date));
      const total   = entry?.total ?? 0;
      const done    = entry?.done  ?? 0;
      const pending = total - done;

      const title = total === 0
        ? undefined
        : done === total
          ? `${total} task${total !== 1 ? 's' : ''} — all completed ✓`
          : done > 0
            ? `${total} task${total !== 1 ? 's' : ''} — ${done} done, ${pending} pending`
            : `${total} task${total !== 1 ? 's' : ''} — none completed`;

      // status bar colour — does NOT use cell background so today's highlight is unaffected
      const barColor = total === 0
        ? ''
        : pending === 0
          ? 'bg-emerald-500'
          : 'bg-red-500';

      // dots capped at 3 + overflow badge
      const SHOW = 3;
      const overflow     = total > SHOW;
      const visibleTotal = overflow ? SHOW - 1 : total;
      const shownDone    = Math.min(done, visibleTotal);
      const shownPending = visibleTotal - shownDone;
      const extra        = total - (SHOW - 1);

      return (
        <span title={title} className="flex flex-col items-center leading-none gap-[3px] w-full h-full">
          <span>{date.getDate()}</span>
          {/* coloured status bar — green = all done, red = has pending */}
          {total > 0 && <span className={`w-4 h-[3px] rounded-full ${barColor} opacity-70`} />}
          {total > 0 && (
            <span className="flex gap-[3px] items-center">
              {Array.from({ length: shownDone }).map((_, i) => (
                <span key={`d${i}`} className="w-[4px] h-[4px] rounded-full bg-emerald-600 dark:bg-emerald-400 inline-block" />
              ))}
              {Array.from({ length: shownPending }).map((_, i) => (
                <span key={`p${i}`} className="w-[4px] h-[4px] rounded-full bg-red-500 dark:bg-red-400 inline-block" />
              ))}
              {overflow && (
                <span className="text-[9px] font-bold leading-none text-foreground/60">+{extra}</span>
              )}
            </span>
          )}
        </span>
      );
    };
  }, [taskDateCounts]);

  const toggleAssignee = (name: string) => {
    setSelectedAssignees((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };
  const togglePriority = (p: Priority) => {
    setSelectedPriorities((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p); else next.add(p);
      return next;
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  /* ── render ──────────────────────────────────── */
  return (
    <div className="relative min-h-screen hero-wave-bg overflow-hidden">

      {/* Dome silhouette */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: 'min(460px, 80vw)', opacity: 0.06 }}>
        <svg viewBox="0 0 480 220" xmlns="http://www.w3.org/2000/svg" className="w-full" fill="currentColor">
          <rect x="10" y="205" width="460" height="15" rx="3"/>
          <rect x="40" y="186" width="400" height="19" rx="2"/>
          <polygon points="55,186 425,186 405,138 75,138"/>
          <rect x="168" y="86" width="144" height="52" rx="5"/>
          <path d="M153,86 Q240,-35 327,86 Z"/>
          <rect x="237" y="-35" width="6" height="32" rx="2"/>
          <rect x="57" y="103" width="22" height="83" rx="3"/>
          <rect x="51" y="122" width="34" height="7" rx="1"/>
          <polygon points="57,103 79,103 68,74"/>
          <rect x="401" y="103" width="22" height="83" rx="3"/>
          <rect x="395" y="122" width="34" height="7" rx="1"/>
          <polygon points="401,103 423,103 412,74"/>
        </svg>
      </div>

      {/* Floating watermelons */}
      <span aria-hidden="true" className="pointer-events-none select-none absolute left-[4%]  bottom-[14%] text-2xl" style={{ animation: 'float-up-down 5s ease-in-out infinite' }}>🍉</span>
      <span aria-hidden="true" className="pointer-events-none select-none absolute right-[5%] bottom-[22%] text-xl" style={{ animation: 'float-up-down 6s ease-in-out infinite', animationDelay: '1.5s' }}>🍉</span>

      <div className="relative z-10 max-w-[1400px] mx-auto px-3 sm:px-4 py-8 sm:py-12">

        {/* ── page header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-accent/20 overflow-hidden flex-shrink-0">
              <img src="/profile_photo.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-headline text-xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                Workload
              </h1>
              <p className="text-xs text-foreground/50">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}
            className="border-accent/30 text-accent hover:bg-accent/10 gap-1.5">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        {/* ── two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: calendar sidebar ── */}
          <div className="hidden lg:block flex-shrink-0 w-[280px] sticky top-6">
            <div className="glass-card rounded-2xl p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d === selectedDate ? undefined : d)}
                components={{ DayContent: CalDayContent }}
                className="w-full"
              />
              {/* ── calendar legend ── */}
              <div className="mt-2 mb-1 px-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5 text-[10px] text-foreground/50">
                  <span className="w-4 h-[3px] rounded-full bg-emerald-500 inline-block" />
                  All done
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-foreground/50">
                  <span className="w-4 h-[3px] rounded-full bg-red-500 inline-block" />
                  Has pending
                </span>
                <span className="text-[10px] text-foreground/35 ml-auto">· = 1 task</span>
              </div>
              {selectedDate && (
                <div className="mt-2 px-2 pb-1 flex items-center justify-between">
                  <span className="text-[11px] text-foreground/55">
                    {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDate(undefined)}
                    className="text-[10px] text-accent hover:underline"
                  >
                    Clear
                  </button>
                </div>
              )}
              {/* ── assignee filter ── */}
              {allAssignees.length > 0 && (
                <div className="mt-3 border-t border-accent/10 pt-3 px-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">Assignee</span>
                    {selectedAssignees.size > 0 && (
                      <button type="button" onClick={() => setSelectedAssignees(new Set())}
                        className="text-[10px] text-accent hover:underline">Clear</button>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {allAssignees.map((name) => (
                      <li key={name}>
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedAssignees.has(name)}
                            onChange={() => toggleAssignee(name)}
                            className="w-3.5 h-3.5 rounded border-accent/30 accent-accent cursor-pointer"
                          />
                          <span className="text-xs text-foreground/70 group-hover:text-foreground transition-colors truncate">{name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* ── priority filter ── */}
              <div className="mt-3 border-t border-accent/10 pt-3 px-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">Priority</span>
                  {selectedPriorities.size > 0 && (
                    <button type="button" onClick={() => setSelectedPriorities(new Set())}
                      className="text-[10px] text-accent hover:underline">Clear</button>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {(['critical', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                    <li key={p}>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedPriorities.has(p)}
                          onChange={() => togglePriority(p)}
                          className="w-3.5 h-3.5 rounded border-accent/30 accent-accent cursor-pointer"
                        />
                        <span className={`text-xs font-medium transition-colors ${selectedPriorities.has(p) ? PRIORITY_STYLES[p].split(' ').filter(c => c.startsWith('text-')).join(' ') : 'text-foreground/70 group-hover:text-foreground'}`}>
                          {PRIORITY_LABEL[p]}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── RIGHT: main content ── */}
          <div className="flex-1 min-w-0">

        {/* ── progress pill ── */}
        {todos.length > 0 && (
          <div className="glass-card rounded-full px-5 py-2.5 mb-4 flex items-center justify-between text-sm">
            <span className="text-foreground/65">
              {remaining === 0 ? '🎉 All done!' : `${remaining} task${remaining !== 1 ? 's' : ''} remaining`}
            </span>
            <span className="text-accent font-semibold">
              {todos.filter((t) => t.done).length} / {todos.length} completed
            </span>
          </div>
        )}

        {/* ── add task form ── */}
        <div className="glass-card rounded-2xl mb-6 overflow-visible">
          <button type="button"
            onClick={() => { setFormOpen((o) => !o); if (formOpen) resetForm(); }}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground/70 hover:text-accent hover:bg-accent/5 transition-colors rounded-2xl">
            <span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add a new task</span>
            {formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {formOpen && (
            <form onSubmit={addTodo} className="px-4 pb-5 space-y-4 border-t border-accent/10 pt-4">

              {/* Task title */}
              <div>
                <label className={lbl}>Task title <span className="text-accent">*</span></label>
                <Input
                  placeholder="e.g. Design homepage layout"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="h-9 bg-background/50 border-accent/20 focus:border-accent/50"
                  required
                  autoFocus
                />
              </div>

              {/* Row 1 — Start date + Assignee */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Start date <span className="text-accent">*</span></label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    style={{ colorScheme: 'light dark' }}
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Assignee <span className="text-accent">*</span></label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    required
                    className={field}
                  >
                    <option value="">Select…</option>
                    <option value="Myself">Myself</option>
                    <option value="other">Other…</option>
                  </select>
                  {newAssignee === 'other' && (
                    <Input
                      placeholder="Enter name"
                      value={newAssigneeOther}
                      onChange={(e) => setNewAssigneeOther(e.target.value)}
                      required
                      className="h-9 mt-2 bg-background/50 border-accent/20 focus:border-accent/50"
                      autoFocus
                    />
                  )}
                </div>
              </div>

              {/* Row 2 — Budget + Estimated */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Budget <span className="text-accent">*</span></label>
                  <div className="flex gap-1.5">
                    <select
                      value={newBudgetCurrency}
                      onChange={(e) => setNewBudgetCurrency(e.target.value as 'USD' | 'LKR')}
                      className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0"
                    >
                      <option value="USD">USD $</option>
                      <option value="LKR">LKR ₨</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newBudget}
                      onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                      onChange={(e) => setNewBudget(e.target.value)}
                      required
                      className={`${field} flex-1 min-w-0`}
                    />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Estimated time <span className="text-accent">*</span></label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={newEstHours}
                      onChange={(e) => setNewEstHours(e.target.value)}
                      required
                      className={`${field} flex-1 min-w-0`}
                    />
                    <select
                      value={newEstUnit}
                      onChange={(e) => setNewEstUnit(e.target.value as 'hrs' | 'days')}
                      className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0"
                    >
                      <option value="hrs">hrs</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className={lbl}>Priority <span className="text-foreground/35 font-normal">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {(['critical', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(newPriority === p ? null : p)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                        newPriority === p
                          ? PRIORITY_STYLES[p] + ' ring-1 ring-offset-1 ring-current/30'
                          : 'border-accent/20 text-foreground/45 hover:border-accent/40'
                      }`}
                    >
                      {PRIORITY_LABEL[p]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurring */}
              <div>
                <label className={lbl}>Recurring <span className="text-foreground/35 font-normal">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {RECURRING_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewRecurring(newRecurring === opt.value ? null : opt.value)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                        newRecurring === opt.value
                          ? 'bg-accent/15 border-accent/50 text-accent ring-1 ring-offset-1 ring-accent/30'
                          : 'border-accent/20 text-foreground/45 hover:border-accent/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-tasks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={lbl}><ListTree className="inline h-3 w-3 mr-1" />Sub-tasks <span className="text-foreground/35 font-normal">(optional)</span></label>
                  {(newBudget !== '' || newEstHours !== '') && (
                    <div className="flex gap-3 text-[10px] text-foreground/40">
                      {newBudget !== '' && (
                        <span>Pool: {fmtCurrency(
                          parseFloat(newBudget) - newSubtasks.reduce((s, t) => s + (t.budget ?? 0), 0),
                          newBudgetCurrency
                        )} left</span>
                      )}
                      {newEstHours !== '' && (
                        <span>{parseFloat(newEstHours) - newSubtasks.reduce((s, t) => s + (t.estimatedHours ?? 0), 0)} {newEstUnit} left</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Added subtasks list */}
                {newSubtasks.length > 0 && (
                  <ul className="mb-2 space-y-1.5">
                    {newSubtasks.map((st, i) => (
                      <li key={i} className="flex items-start gap-2 px-3 py-2 rounded-md bg-accent/5 border border-accent/10">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-medium text-foreground/80">{st.text}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {st.startDate && (
                              <span className={badge}><CalendarIcon className="h-2 w-2" />{new Date(st.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                            )}
                            {st.assignee && <span className={badge}><User className="h-2 w-2" />{st.assignee}</span>}
                            {st.budget != null && (
                              <span className={badge}><DollarSign className="h-2 w-2" />{fmtCurrency(st.budget, newBudgetCurrency)}</span>
                            )}
                            {st.estimatedHours != null && (
                              <span className={badge}><Clock className="h-2 w-2" />{st.estimatedHours} {newEstUnit}</span>
                            )}
                          </div>
                        </div>
                        <button type="button" onClick={() => setNewSubtasks((p) => p.filter((_, idx) => idx !== i))}
                          className="shrink-0 text-foreground/30 hover:text-destructive transition-colors mt-0.5">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Sub-task entry form */}
                {stFormOpen ? (
                  <div className="rounded-lg border border-accent/20 bg-accent/[0.04] p-3 space-y-3">
                    <input type="text" placeholder="Sub-task title *" value={stDraft.text}
                      onChange={(e) => setStDraft({ ...stDraft, text: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      className={field} autoFocus />

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>Start date</label>
                        <input type="date" value={stDraft.startDate}
                          min={newDate || undefined}
                          max={calcTaskEndDateStr(newDate, newEstHours !== '' ? parseFloat(newEstHours) : null, newEstUnit)}
                          style={{ colorScheme: 'light dark' }}
                          onChange={(e) => setStDraft({ ...stDraft, startDate: e.target.value })}
                          className={field} />
                        {stDraft.startDate && stDraft.estHours !== '' && (() => {
                          const eta = calcTaskEndDateStr(stDraft.startDate, parseFloat(stDraft.estHours), newEstUnit);
                          return eta ? (
                            <p className="text-[10px] text-foreground/45 mt-1">
                              ETA: {new Date(eta + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </p>
                          ) : null;
                        })()}
                      </div>
                      <div>
                        <label className={lbl}>Assignee</label>
                        <select value={stDraft.assignee}
                          onChange={(e) => setStDraft({ ...stDraft, assignee: e.target.value })}
                          className={field}>
                          <option value="">Select…</option>
                          <option value="Myself">Myself</option>
                          <option value="other">Other…</option>
                        </select>
                        {stDraft.assignee === 'other' && (
                          <Input placeholder="Enter name" value={stDraft.assigneeOther}
                            onChange={(e) => setStDraft({ ...stDraft, assigneeOther: e.target.value })}
                            className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={lbl}>
                          Budget
                          {newBudget !== '' && (
                            <span className="text-foreground/35 font-normal ml-1">
                              (max {fmtCurrency(parseFloat(newBudget) - newSubtasks.reduce((s,t) => s+(t.budget??0),0), newBudgetCurrency)})
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-foreground/50 shrink-0">{newBudgetCurrency === 'LKR' ? '₨' : '$'}</span>
                          <input type="number" min="0" step="0.01" placeholder="0.00"
                            value={stDraft.budget}
                            max={newBudget !== '' ? (parseFloat(newBudget) - newSubtasks.reduce((s,t) => s+(t.budget??0),0)).toString() : undefined}
                            onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                            onChange={(e) => { setStDraft({ ...stDraft, budget: e.target.value }); setStError(''); }}
                            className={`${field} flex-1`} />
                        </div>
                      </div>
                      <div>
                        <label className={lbl}>
                          Estimate
                          {(() => {
                            const poolMax = newEstHours !== '' ? parseFloat(newEstHours) - newSubtasks.reduce((s,t) => s+(t.estimatedHours??0),0) : undefined;
                            const dateMax = calcMaxSubEstimate(stDraft.startDate, calcTaskEndDateStr(newDate, newEstHours !== '' ? parseFloat(newEstHours) : null, newEstUnit), newEstUnit);
                            const effective = poolMax !== undefined && dateMax !== undefined ? Math.min(poolMax, dateMax) : (poolMax ?? dateMax);
                            return effective !== undefined ? <span className="text-foreground/35 font-normal ml-1">(max {effective} {newEstUnit})</span> : null;
                          })()}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input type="number" min="0" step="0.5" placeholder="0"
                            value={stDraft.estHours}
                            max={(() => {
                              const poolMax = newEstHours !== '' ? parseFloat(newEstHours) - newSubtasks.reduce((s,t) => s+(t.estimatedHours??0),0) : undefined;
                              const dateMax = calcMaxSubEstimate(stDraft.startDate, calcTaskEndDateStr(newDate, newEstHours !== '' ? parseFloat(newEstHours) : null, newEstUnit), newEstUnit);
                              const effective = poolMax !== undefined && dateMax !== undefined ? Math.min(poolMax, dateMax) : (poolMax ?? dateMax);
                              return effective !== undefined ? effective.toString() : undefined;
                            })()}
                            onChange={(e) => {
                              const poolMax = newEstHours !== '' ? parseFloat(newEstHours) - newSubtasks.reduce((s,t) => s+(t.estimatedHours??0),0) : undefined;
                              const dateMax = calcMaxSubEstimate(stDraft.startDate, calcTaskEndDateStr(newDate, newEstHours !== '' ? parseFloat(newEstHours) : null, newEstUnit), newEstUnit);
                              const cap = poolMax !== undefined && dateMax !== undefined ? Math.min(poolMax, dateMax) : (poolMax ?? dateMax);
                              const val = e.target.value;
                              const clamped = cap !== undefined && val !== '' && parseFloat(val) > cap ? cap.toString() : val;
                              setStDraft({ ...stDraft, estHours: clamped }); setStError('');
                            }}
                            className={`${field} flex-1`} />
                          <span className="text-xs text-foreground/50 shrink-0">{newEstUnit}</span>
                        </div>
                      </div>
                    </div>

                    {stError && <p className="text-xs text-destructive">{stError}</p>}

                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" size="sm"
                        onClick={() => { setStFormOpen(false); setStDraft(emptyDraft); setStError(''); }}
                        className="text-foreground/50 hover:text-foreground">Cancel</Button>
                      <Button type="button" size="sm" onClick={commitSubtask}
                        disabled={!stDraft.text.trim()}
                        className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                        <Plus className="h-3.5 w-3.5" /> Add sub-task
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => setStFormOpen(true)}
                    className="w-full border-dashed border-accent/25 text-accent/60 hover:text-accent hover:border-accent/40 hover:bg-accent/5 gap-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add sub-task
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                <Button type="button" variant="ghost" size="sm"
                  onClick={() => { setFormOpen(false); resetForm(); }}
                  className="text-foreground/50 hover:text-foreground">
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={adding || !newText.trim()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                  {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Add task
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* ── mobile calendar (shown below lg) ── */}
        <div className="lg:hidden mb-4">
          <details className="glass-card rounded-2xl overflow-hidden">
            <summary className="px-4 py-3 text-sm font-medium text-foreground/70 cursor-pointer hover:text-accent flex items-center gap-2 select-none">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate
                ? `Showing: ${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : 'Filter by date'}
              {selectedDate && (
                <span
                  onClick={(e) => { e.preventDefault(); setSelectedDate(undefined); }}
                  className="ml-auto text-[10px] text-accent hover:underline"
                >Clear</span>
              )}
            </summary>
            <div className="border-t border-accent/10 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => setSelectedDate(d === selectedDate ? undefined : d)}
                components={{ DayContent: CalDayContent }}
              />
            </div>
            {/* ── mobile assignee filter ── */}
            {allAssignees.length > 0 && (
              <div className="border-t border-accent/10 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">Assignee</span>
                  {selectedAssignees.size > 0 && (
                    <button type="button" onClick={() => setSelectedAssignees(new Set())}
                      className="text-[10px] text-accent hover:underline">Clear</button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allAssignees.map((name) => (
                    <label key={name} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAssignees.has(name)}
                        onChange={() => toggleAssignee(name)}
                        className="w-3.5 h-3.5 rounded border-accent/30 accent-accent cursor-pointer"
                      />
                      <span className="text-xs text-foreground/70">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            {/* ── mobile priority filter ── */}
            <div className="border-t border-accent/10 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">Priority</span>
                {selectedPriorities.size > 0 && (
                  <button type="button" onClick={() => setSelectedPriorities(new Set())}
                    className="text-[10px] text-accent hover:underline">Clear</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['critical', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                  <label key={p} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedPriorities.has(p)}
                      onChange={() => togglePriority(p)}
                      className="w-3.5 h-3.5 rounded border-accent/30 accent-accent cursor-pointer"
                    />
                    <span className={`text-xs font-medium ${selectedPriorities.has(p) ? PRIORITY_STYLES[p].split(' ').filter(c => c.startsWith('text-')).join(' ') : 'text-foreground/70'}`}>
                      {PRIORITY_LABEL[p]}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </details>
        </div>

        {/* ── mobile budget overview (shown below lg, only when there's budget data) ── */}
        {hasAnyBudget && (
          <div className="xl:hidden mb-4">
            <div className="glass-card rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500/70" />
                <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">
                  {isFiltered ? 'Filtered Budget' : 'Budget Overview'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'USD', symbol: '$', total: filteredBudgetUSD, spent: spentBudgetUSD, remaining: remainingBudgetUSD },
                  { label: 'LKR', symbol: '₨', total: filteredBudgetLKR, spent: spentBudgetLKR, remaining: remainingBudgetLKR },
                ].filter(c => c.total > 0).map(c => (
                  <div key={c.label}>
                    <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wide mb-1.5">{c.label}</p>
                    <div className="flex items-stretch gap-px rounded-lg overflow-hidden border border-accent/10 text-center">
                      <div className="flex-1 bg-accent/[0.04] px-2 py-2">
                        <p className="text-[10px] text-foreground/45 mb-0.5">Total</p>
                        <p className="text-sm font-semibold text-foreground/80">{c.symbol}{c.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="flex-1 bg-red-500/[0.04] px-2 py-2">
                        <p className="text-[10px] text-foreground/45 mb-0.5">Spent</p>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">{c.symbol}{c.spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="flex-1 bg-emerald-500/[0.04] px-2 py-2">
                        <p className="text-[10px] text-foreground/45 mb-0.5">Remaining</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{c.symbol}{c.remaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    {c.total > 0 && (
                      <div className="mt-1.5 h-1.5 rounded-full bg-accent/10 overflow-hidden">
                        <div className="h-full rounded-full bg-red-500/50 transition-all" style={{ width: `${Math.min(100, (c.spent / c.total) * 100)}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── filter tabs ── */}
        {!dbLoading && todos.length > 0 && (
          <div className="flex gap-1 mb-4 p-1 glass-card rounded-full w-fit">
            {(['all', 'pending'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-4 py-1 text-xs font-medium rounded-full transition-colors capitalize ${
                  filter === f
                    ? 'bg-accent text-white'
                    : 'text-foreground/55 hover:text-accent'
                }`}
              >
                {f === 'all' ? `All (${priorityFilteredTodos.length})` : `Pending (${priorityFilteredTodos.filter((t) => !t.done).length})`}
              </button>
            ))}
          </div>
        )}

        {/* ── task list ── */}
        {dbLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : todos.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-foreground/50 text-sm">No tasks yet. Add one above!</p>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-foreground/50 text-sm">
              {selectedDate
                ? `No ${filter === 'pending' ? 'pending ' : ''}tasks for ${selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.`
                : 'No pending tasks. All done! 🎉'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTodos.map((todo) => {
              const isExpanded  = expanded.has(todo.id);
              const doneCount   = (todo.subtasks ?? []).filter((s) => s.done).length;
              const totalSubs   = (todo.subtasks ?? []).length;
              const today       = toLocalDateStr(new Date());
              const isOverdue   = !todo.done && !!todo.startDate && todo.startDate < today;
              // avgProgress: done tasks always show 100; for tasks with subtasks use average of each sub's progress; else use task's own progress
              const avgProgress = todo.done ? 100 : (totalSubs > 0
                ? Math.round((todo.subtasks ?? []).reduce((s, sub) => s + (sub.done ? 100 : (sub.progress ?? 0)), 0) / totalSubs)
                : (todo.progress ?? 0));

              return (
                <li key={todo.id} className={`glass-card card-swim rounded-xl overflow-hidden group transition-all ${todo.done ? 'border-l-[3px] border-l-primary/35 opacity-80' : isOverdue ? 'border-l-[3px] border-l-destructive/60' : 'border-l-[3px] border-l-accent/55'} ${confirmDeleteId === todo.id ? 'ring-1 ring-destructive/40' : ''}`}>
                  {/* Main task row or inline edit form */}
                  {editingTaskId === todo.id ? (
                    <div className="px-4 py-3 space-y-3">
                      <div>
                        <label className={lbl}>Task title <span className="text-accent">*</span></label>
                        <Input
                          value={editTaskDraft.text}
                          onChange={(e) => setEditTaskDraft({ ...editTaskDraft, text: e.target.value })}
                          className="h-9 bg-background/50 border-accent/20 focus:border-accent/50"
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Start date</label>
                          <input type="date" value={editTaskDraft.startDate}
                            onChange={(e) => setEditTaskDraft({ ...editTaskDraft, startDate: e.target.value })}
                            style={{ colorScheme: 'light dark' }} className={field} />
                        </div>
                        <div>
                          <label className={lbl}>Assignee</label>
                          <select value={editTaskDraft.assignee}
                            onChange={(e) => setEditTaskDraft({ ...editTaskDraft, assignee: e.target.value })}
                            className={field}>
                            <option value="">Select…</option>
                            <option value="Myself">Myself</option>
                            <option value="other">Other…</option>
                          </select>
                          {editTaskDraft.assignee === 'other' && (
                            <Input value={editTaskDraft.assigneeOther}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, assigneeOther: e.target.value })}
                              placeholder="Enter name"
                              className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={lbl}>Budget</label>
                          <div className="flex gap-1.5">
                            <select value={editTaskDraft.budgetCurrency}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, budgetCurrency: e.target.value as 'USD' | 'LKR' })}
                              className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0">
                              <option value="USD">USD $</option>
                              <option value="LKR">LKR ₨</option>
                            </select>
                            <input type="number" min="0" step="0.01" placeholder="0.00"
                              value={editTaskDraft.budget}
                              onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, budget: e.target.value })}
                              className={`${field} flex-1 min-w-0`} />
                          </div>
                        </div>
                        <div>
                          <label className={lbl}>Estimated time</label>
                          <div className="flex gap-1.5">
                            <input type="number" min="0" step="0.5" placeholder="0"
                              value={editTaskDraft.estHours}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, estHours: e.target.value })}
                              className={`${field} flex-1 min-w-0`} />
                            <select value={editTaskDraft.estUnit}
                              onChange={(e) => setEditTaskDraft({ ...editTaskDraft, estUnit: e.target.value as 'hrs' | 'days' })}
                              className="h-9 rounded-md border border-accent/20 bg-background/50 px-2 text-xs text-foreground/80 focus:outline-none focus:ring-1 focus:ring-accent/50 shrink-0">
                              <option value="hrs">hrs</option>
                              <option value="days">days</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {/* Priority */}
                      <div>
                        <label className={lbl}>Priority <span className="text-foreground/35 font-normal">(optional)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {(['critical', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setEditTaskDraft({ ...editTaskDraft, priority: editTaskDraft.priority === p ? null : p })}
                              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                                editTaskDraft.priority === p
                                  ? PRIORITY_STYLES[p] + ' ring-1 ring-offset-1 ring-current/30'
                                  : 'border-accent/20 text-foreground/45 hover:border-accent/40'
                              }`}
                            >
                              {PRIORITY_LABEL[p]}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Recurring */}
                      <div>
                        <label className={lbl}>Recurring <span className="text-foreground/35 font-normal">(optional)</span></label>
                        <div className="flex flex-wrap gap-2">
                          {RECURRING_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setEditTaskDraft({ ...editTaskDraft, recurring: editTaskDraft.recurring === opt.value ? null : opt.value })}
                              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium transition-all ${
                                editTaskDraft.recurring === opt.value
                                  ? 'bg-accent/15 border-accent/50 text-accent ring-1 ring-offset-1 ring-accent/30'
                                  : 'border-accent/20 text-foreground/45 hover:border-accent/40'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                        <Button type="button" variant="ghost" size="sm"
                          onClick={() => setEditingTaskId(null)}
                          className="text-foreground/50 hover:text-foreground">Cancel</Button>
                        <Button type="button" size="sm"
                          onClick={saveEditTask}
                          disabled={editLoading || !editTaskDraft.text.trim()}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                          {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                          Save changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                  <div className="px-4 pt-3.5 pb-3">
                    {/* Title + action toolbar row */}
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => todo.done ? toggleTodo(todo) : setConfirmDoneId(confirmDoneId === todo.id ? null : todo.id)}
                        aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                        className="shrink-0 mt-0.5 transition-transform hover:scale-110">
                        {todo.done
                          ? <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
                          : <Circle className={`h-5 w-5 ${confirmDoneId === todo.id ? 'text-primary/60' : 'text-foreground/30'}`} />}
                      </button>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <span className={`block text-sm font-semibold leading-snug ${todo.done ? 'line-through text-foreground/35' : 'text-foreground/90'}`}>
                          {todo.text}
                        </span>
                      </div>

                      {/* Grouped action toolbar — always visible on touch, hover-revealed on pointer devices */}
                      <div className={`flex items-center gap-0.5 shrink-0 transition-opacity ${confirmDeleteId === todo.id ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}>
                        <button
                          onClick={() => {
                            setEditTaskDraft({
                              text: todo.text,
                              startDate: todo.startDate || '',
                              assignee: todo.assignee ? (todo.assignee === 'Myself' ? 'Myself' : 'other') : '',
                              assigneeOther: (todo.assignee && todo.assignee !== 'Myself') ? todo.assignee : '',
                              budget: todo.budget != null ? todo.budget.toString() : '',
                              budgetCurrency: todo.budgetCurrency as 'USD' | 'LKR',
                              estHours: todo.estimatedHours != null ? todo.estimatedHours.toString() : '',
                              estUnit: todo.estimatedUnit as 'hrs' | 'days',
                              priority: todo.priority,
                              recurring: todo.recurring,
                            });
                            setEditingTaskId(todo.id);
                          }}
                          aria-label="Edit task"
                          className="p-1.5 rounded-md text-foreground/35 hover:text-accent hover:bg-accent/10 transition-colors">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(confirmDeleteId === todo.id ? null : todo.id)}
                          aria-label="Delete task"
                          className={`p-1.5 rounded-md transition-colors ${confirmDeleteId === todo.id ? 'text-destructive bg-destructive/10' : 'text-foreground/35 hover:text-destructive hover:bg-destructive/10'}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveSubtaskId(todo.id);
                            setSubDraft(emptyDraft);
                            setSubError('');
                            setExpanded((p) => { const s = new Set(p); s.add(todo.id); return s; });
                          }}
                          aria-label="Add sub-task"
                          className="p-1.5 rounded-md text-foreground/35 hover:text-accent hover:bg-accent/10 transition-colors">
                          <ListTree className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta badges */}
                    {(todo.priority || todo.recurring || todo.startDate || todo.assignee || todo.budget != null || todo.estimatedHours != null) && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5 pl-8">
                        {todo.priority && (
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${PRIORITY_STYLES[todo.priority]}`}>
                            {PRIORITY_LABEL[todo.priority]}
                          </span>
                        )}
                        {todo.recurring && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-accent/10 border border-accent/20 text-accent">
                            ↻ {RECURRING_OPTIONS.find(o => o.value === todo.recurring)?.label ?? todo.recurring}
                          </span>
                        )}
                        {todo.startDate && (
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            isOverdue
                              ? 'bg-destructive/10 border border-destructive/30 text-destructive/80'
                              : 'bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400'
                          }`}>
                            <CalendarIcon className="h-2.5 w-2.5" />
                            {new Date(todo.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                            {isOverdue && <span className="font-bold ml-0.5">· started</span>}
                          </span>
                        )}
                        {todo.assignee && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                            <User className="h-2.5 w-2.5" />{todo.assignee}
                          </span>
                        )}
                        {todo.budget != null && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                            <DollarSign className="h-2.5 w-2.5" />
                            {todo.budgetCurrency === 'LKR' ? '₨' : '$'}{todo.budget.toLocaleString()} {todo.budgetCurrency}
                          </span>
                        )}
                        {todo.estimatedHours != null && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                            <Clock className="h-2.5 w-2.5" />{todo.estimatedHours} {todo.estimatedUnit}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Subtask progress bar */}
                    {totalSubs > 0 && (
                      <div className="mt-2.5 pl-8 flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-accent/10 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${avgProgress}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${avgProgress >= 100 ? 'bg-primary/60' : 'bg-accent/55'}`}
                          />
                        </div>
                        <button
                          onClick={() => setExpanded((p) => { const s = new Set(p); s.has(todo.id) ? s.delete(todo.id) : s.add(todo.id); return s; })}
                          className={`inline-flex items-center gap-1 text-[10px] font-medium transition-colors shrink-0 ${
                            avgProgress >= 100 ? 'text-primary/70 hover:text-primary' : 'text-foreground/45 hover:text-accent'
                          }`}>
                          <ListTree className="h-3 w-3" />
                          <span className="font-semibold">{avgProgress}%</span>
                          <span className="text-foreground/30">&middot;</span>
                          {doneCount}/{totalSubs}
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>
                    )}

                    {/* Manual progress for tasks without subtasks */}
                    {totalSubs === 0 && (
                      <div className="mt-2.5 pl-8 flex items-center gap-2.5">
                        <div className="flex-1 h-1.5 bg-accent/10 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${avgProgress}%` }}
                            className={`h-full rounded-full transition-all duration-500 ${avgProgress >= 100 ? 'bg-primary/60' : 'bg-accent/55'}`}
                          />
                        </div>
                        {editingProgressId === todo.id ? (
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number" min="0" max="100" step="1"
                              value={progressDraft}
                              onChange={(e) => setProgressDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') { const v = parseInt(e.currentTarget.value, 10); if (!isNaN(v)) updateTaskProgress(todo.id, v); }
                                if (e.key === 'Escape') setEditingProgressId(null);
                              }}
                              className="w-14 h-6 rounded border border-accent/30 bg-background/80 px-2 text-xs text-center focus:outline-none focus:ring-1 focus:ring-accent/50"
                              autoFocus
                            />
                            <span className="text-[10px] text-foreground/40">%</span>
                            <button onClick={() => { const v = parseInt(progressDraft, 10); if (!isNaN(v)) updateTaskProgress(todo.id, v); }}
                              className="text-primary/60 hover:text-primary transition-colors">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setEditingProgressId(null)}
                              className="text-foreground/30 hover:text-foreground/60 transition-colors">
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setProgressDraft(avgProgress.toString()); setEditingProgressId(todo.id); }}
                            className={`inline-flex items-center gap-1 text-[10px] font-medium transition-colors shrink-0 border rounded-full px-2 py-0.5 ${
                              avgProgress >= 100
                                ? 'border-primary/25 bg-primary/8 text-primary/70 hover:bg-primary/15'
                                : 'border-accent/20 bg-accent/5 text-foreground/55 hover:text-accent hover:border-accent/35'
                            }`}>
                            <Pencil className="h-2.5 w-2.5 shrink-0" />
                            <span className="font-semibold">{avgProgress}%</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  )}

                  {/* Complete confirmation strip */}
                  {confirmDoneId === todo.id && (
                    <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-primary/8 border-t border-primary/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                        <span className="text-xs text-foreground/60 truncate">
                          Mark <span className="font-semibold text-foreground/80">&ldquo;{todo.text}&rdquo;</span> as complete?
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setConfirmDoneId(null)}
                          className="text-xs px-2.5 py-1 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors">
                          Cancel
                        </button>
                        <button
                          onClick={() => { toggleTodo(todo); setConfirmDoneId(null); }}
                          className="text-xs px-3 py-1 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" /> Mark Done
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Delete confirmation strip */}
                  {confirmDeleteId === todo.id && (
                    <div className="px-4 py-2.5 flex items-center justify-between gap-3 bg-destructive/8 border-t border-destructive/20">
                      <div className="flex items-center gap-2 min-w-0">
                        <Trash2 className="h-3.5 w-3.5 text-destructive/70 shrink-0" />
                        <span className="text-xs text-foreground/60 truncate">
                          Delete <span className="font-semibold text-foreground/80">&ldquo;{todo.text}&rdquo;</span>?
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs px-2.5 py-1 rounded-md text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors">
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-xs px-3 py-1 rounded-md bg-destructive hover:bg-destructive/90 text-white font-medium transition-colors flex items-center gap-1.5">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Subtask panel */}
                  {(isExpanded || activeSubtaskId === todo.id) && (
                    <div className="border-t border-accent/10 bg-accent/[0.03]">

                      {/* Existing subtasks */}
                      {totalSubs > 0 && (
                        <ul className="px-4 pt-2 pb-1 space-y-1">
                          {(todo.subtasks ?? []).map((sub, i) => (
                            <li key={i} className={editingSubtask?.todoId === todo.id && editingSubtask?.index === i ? 'rounded-md bg-accent/5 border border-accent/20 p-2 space-y-2' : 'group/sub flex items-start gap-2 py-1.5'}>
                              {editingSubtask?.todoId === todo.id && editingSubtask?.index === i ? (
                                <>
                                  <input type="text" value={editSubDraft.text}
                                    onChange={(e) => setEditSubDraft({ ...editSubDraft, text: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    className={field} autoFocus />
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={lbl}>Start date</label>
                                      <input type="date" value={editSubDraft.startDate}
                                        min={todo.startDate || undefined}
                                        max={calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit)}
                                        style={{ colorScheme: 'light dark' }}
                                        onChange={(e) => setEditSubDraft({ ...editSubDraft, startDate: e.target.value })}
                                        className={field} />
                                      {editSubDraft.startDate && editSubDraft.estHours !== '' && (() => {
                                        const eta = calcTaskEndDateStr(editSubDraft.startDate, parseFloat(editSubDraft.estHours), todo.estimatedUnit);
                                        return eta ? (
                                          <p className="text-[10px] text-foreground/45 mt-1">
                                            ETA: {new Date(eta + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                          </p>
                                        ) : null;
                                      })()}
                                    </div>
                                    <div>
                                      <label className={lbl}>Assignee</label>
                                      <select value={editSubDraft.assignee}
                                        onChange={(e) => setEditSubDraft({ ...editSubDraft, assignee: e.target.value })}
                                        className={field}>
                                        <option value="">Select…</option>
                                        <option value="Myself">Myself</option>
                                        <option value="other">Other…</option>
                                      </select>
                                      {editSubDraft.assignee === 'other' && (
                                        <Input value={editSubDraft.assigneeOther}
                                          onChange={(e) => setEditSubDraft({ ...editSubDraft, assigneeOther: e.target.value })}
                                          placeholder="Enter name"
                                          className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={lbl}>Budget</label>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-xs text-foreground/50 shrink-0">{todo.budgetCurrency === 'LKR' ? '₨' : '$'}</span>
                                        <input type="number" min="0" step="0.01" placeholder="0.00"
                                          value={editSubDraft.budget}
                                          onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                          onChange={(e) => setEditSubDraft({ ...editSubDraft, budget: e.target.value })}
                                          className={`${field} flex-1`} />
                                      </div>
                                    </div>
                                    <div>
                                      <label className={lbl}>
                                        Estimate
                                        {(() => {
                                          const dateMax = calcMaxSubEstimate(editSubDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit);
                                          return dateMax !== undefined ? <span className="text-foreground/35 font-normal ml-1">(max {dateMax} {todo.estimatedUnit})</span> : null;
                                        })()}
                                      </label>
                                      <div className="flex items-center gap-1.5">
                                        <input type="number" min="0" step="0.5" placeholder="0"
                                          value={editSubDraft.estHours}
                                          max={calcMaxSubEstimate(editSubDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit)?.toString()}
                                          onChange={(e) => {
                                            const cap = calcMaxSubEstimate(editSubDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit);
                                            const val = e.target.value;
                                            const clamped = cap !== undefined && val !== '' && parseFloat(val) > cap ? cap.toString() : val;
                                            setEditSubDraft({ ...editSubDraft, estHours: clamped });
                                          }}
                                          className={`${field} flex-1`} />
                                        <span className="text-xs text-foreground/50 shrink-0">{todo.estimatedUnit}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 justify-end pt-1 border-t border-accent/10">
                                    <Button type="button" variant="ghost" size="sm"
                                      onClick={() => { setEditingSubtask(null); setEditSubDraft(emptyDraft); }}
                                      className="text-foreground/50 hover:text-foreground">Cancel</Button>
                                    <Button type="button" size="sm"
                                      onClick={saveEditSubtask}
                                      disabled={editLoading || !editSubDraft.text.trim()}
                                      className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                                      {editLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Pencil className="h-3.5 w-3.5" />}
                                      Save
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => sub.done ? toggleSubtask(todo, i) : setConfirmDoneSub(
                                      confirmDoneSub?.todoId === todo.id && confirmDoneSub?.subIndex === i ? null : { todoId: todo.id, subIndex: i }
                                    )}
                                    className="shrink-0 mt-0.5 text-accent/70 hover:scale-110 transition-transform">
                                    {sub.done
                                      ? <CheckCircle2 className="h-4 w-4 fill-accent/15" />
                                      : <Circle className={`h-4 w-4 ${confirmDoneSub?.todoId === todo.id && confirmDoneSub?.subIndex === i ? 'opacity-70 text-primary' : 'opacity-40'}`} />}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <span className={`text-xs font-medium leading-snug ${sub.done ? 'line-through text-foreground/30' : 'text-foreground/65'}`}>
                                      {sub.text}
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {sub.startDate && (
                                        <span className={badge}><CalendarIcon className="h-2 w-2" />{new Date(sub.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                                      )}
                                      {sub.assignee && <span className={badge}><User className="h-2 w-2" />{sub.assignee}</span>}
                                      {sub.budget != null && (
                                        <span className={badge}><DollarSign className="h-2 w-2" />{fmtCurrency(sub.budget, todo.budgetCurrency)}</span>
                                      )}
                                      {sub.estimatedHours != null && (
                                        <span className={badge}><Clock className="h-2 w-2" />{sub.estimatedHours} {todo.estimatedUnit}</span>
                                      )}
                                    </div>
                                    {/* Sub-task progress */}
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                      <div className="w-20 h-1 bg-accent/10 rounded-full overflow-hidden">
                                        <div
                                          style={{ width: `${sub.done ? 100 : (sub.progress ?? 0)}%` }}
                                          className={`h-full rounded-full transition-all duration-300 ${sub.done || (sub.progress ?? 0) >= 100 ? 'bg-primary/50' : 'bg-accent/40'}`}
                                        />
                                      </div>
                                      {editingSubProgress?.todoId === todo.id && editingSubProgress?.subIndex === i ? (
                                        <div className="flex items-center gap-1">
                                          <input
                                            type="number" min="0" max="100" step="1"
                                            value={progressDraft}
                                            onChange={(e) => setProgressDraft(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') { const v = parseInt(e.currentTarget.value, 10); if (!isNaN(v)) updateSubtaskProgress(todo.id, i, v); }
                                              if (e.key === 'Escape') setEditingSubProgress(null);
                                            }}
                                            className="w-12 h-5 rounded border border-accent/30 bg-background/80 px-1.5 text-[10px] text-center focus:outline-none focus:ring-1 focus:ring-accent/50"
                                            autoFocus
                                          />
                                          <span className="text-[9px] text-foreground/40">%</span>
                                          <button onClick={() => { const v = parseInt(progressDraft, 10); if (!isNaN(v)) updateSubtaskProgress(todo.id, i, v); }}
                                            className="text-primary/60 hover:text-primary transition-colors">
                                            <CheckCircle2 className="h-3 w-3" />
                                          </button>
                                          <button onClick={() => setEditingSubProgress(null)}
                                            className="text-foreground/30 hover:text-foreground/60 transition-colors">
                                            <X className="h-2.5 w-2.5" />
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => { setProgressDraft((sub.done ? 100 : (sub.progress ?? 0)).toString()); setEditingSubProgress({ todoId: todo.id, subIndex: i }); }}
                                          className={`inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.5 rounded-full border transition-colors ${
                                            sub.done || (sub.progress ?? 0) >= 100
                                              ? 'bg-primary/10 border-primary/20 text-primary/70 hover:bg-primary/15'
                                              : (sub.progress ?? 0) > 0
                                                ? 'bg-accent/10 border-accent/20 text-accent/70 hover:bg-accent/15'
                                                : 'bg-foreground/5 border-foreground/15 text-foreground/45 hover:bg-foreground/10'
                                          }`}>
                                          <Pencil className="h-2 w-2" />
                                          {sub.done ? 100 : (sub.progress ?? 0)}%
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditSubDraft({
                                        text: sub.text,
                                        startDate: sub.startDate || '',
                                        assignee: sub.assignee ? (sub.assignee === 'Myself' ? 'Myself' : 'other') : '',
                                        assigneeOther: (sub.assignee && sub.assignee !== 'Myself') ? sub.assignee : '',
                                        budget: sub.budget != null ? sub.budget.toString() : '',
                                        estHours: sub.estimatedHours != null ? sub.estimatedHours.toString() : '',
                                      });
                                      setEditingSubtask({ todoId: todo.id, index: i });
                                    }}
                                    aria-label="Edit sub-task"
                                    className="shrink-0 mt-0.5 opacity-0 group-hover/sub:opacity-100 transition-opacity text-foreground/30 hover:text-accent">
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteSub(
                                      confirmDeleteSub?.todoId === todo.id && confirmDeleteSub?.subIndex === i ? null : { todoId: todo.id, subIndex: i }
                                    )}
                                    aria-label="Delete sub-task"
                                    className={`shrink-0 mt-0.5 transition-opacity ${
                                      confirmDeleteSub?.todoId === todo.id && confirmDeleteSub?.subIndex === i
                                        ? 'opacity-100 text-destructive'
                                        : 'opacity-0 group-hover/sub:opacity-100 text-foreground/30 hover:text-destructive'
                                    }`}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                              {/* Sub-task delete confirmation strip */}
                              {/* Sub-task complete confirmation */}
                              {confirmDoneSub?.todoId === todo.id && confirmDoneSub?.subIndex === i && (
                                <div className="mt-1 mx-1 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-primary/8 border border-primary/20">
                                  <span className="text-[10px] text-foreground/55 truncate min-w-0 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-primary/60 shrink-0" />
                                    Mark <span className="font-semibold text-foreground/75 mx-0.5">&ldquo;{sub.text}&rdquo;</span> as complete?
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => setConfirmDoneSub(null)}
                                      className="text-[10px] px-2 py-0.5 rounded text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors">
                                      Cancel
                                    </button>
                                    <button onClick={() => { toggleSubtask(todo, i); setConfirmDoneSub(null); }}
                                      className="text-[10px] px-2 py-0.5 rounded bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-1">
                                      <CheckCircle2 className="h-2.5 w-2.5" /> Done
                                    </button>
                                  </div>
                                </div>
                              )}
                              {/* Sub-task delete confirmation */}
                              {confirmDeleteSub?.todoId === todo.id && confirmDeleteSub?.subIndex === i && (
                                <div className="mt-1 mx-1 mb-0.5 flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md bg-destructive/8 border border-destructive/20">
                                  <span className="text-[10px] text-foreground/55 truncate min-w-0">
                                    Delete <span className="font-semibold text-foreground/75">&ldquo;{sub.text}&rdquo;</span>?
                                  </span>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => setConfirmDeleteSub(null)}
                                      className="text-[10px] px-2 py-0.5 rounded text-foreground/50 hover:text-foreground hover:bg-accent/10 transition-colors">
                                      Cancel
                                    </button>
                                    <button onClick={() => deleteSubtask(todo.id, i)}
                                      className="text-[10px] px-2 py-0.5 rounded bg-destructive hover:bg-destructive/90 text-white font-medium transition-colors flex items-center gap-1">
                                      <Trash2 className="h-2.5 w-2.5" /> Delete
                                    </button>
                                  </div>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Add sub-task to existing task */}
                      {activeSubtaskId === todo.id ? (() => {
                        const usedBudget = (todo.subtasks ?? []).reduce((s, t) => s + (t.budget ?? 0), 0);
                        const usedEst    = (todo.subtasks ?? []).reduce((s, t) => s + (t.estimatedHours ?? 0), 0);
                        const remBudget  = todo.budget !== null ? todo.budget - usedBudget : null;
                        const remEst     = todo.estimatedHours !== null ? todo.estimatedHours - usedEst : null;
                        return (
                          <div className="px-4 pb-3 pt-2 space-y-3 border-t border-accent/10">
                            <input type="text" placeholder="Sub-task title *" value={subDraft.text}
                              onChange={(e) => setSubDraft({ ...subDraft, text: e.target.value })}
                              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                              className={field} autoFocus />

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={lbl}>Start date</label>
                                <input type="date" value={subDraft.startDate}
                                  min={todo.startDate || undefined}
                                  max={calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit)}
                                  style={{ colorScheme: 'light dark' }}
                                  onChange={(e) => setSubDraft({ ...subDraft, startDate: e.target.value })}
                                  className={field} />
                                {subDraft.startDate && subDraft.estHours !== '' && (() => {
                                  const eta = calcTaskEndDateStr(subDraft.startDate, parseFloat(subDraft.estHours), todo.estimatedUnit);
                                  return eta ? (
                                    <p className="text-[10px] text-foreground/45 mt-1">
                                      ETA: {new Date(eta + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                    </p>
                                  ) : null;
                                })()}
                              </div>
                              <div>
                                <label className={lbl}>Assignee</label>
                                <select value={subDraft.assignee}
                                  onChange={(e) => setSubDraft({ ...subDraft, assignee: e.target.value })}
                                  className={field}>
                                  <option value="">Select…</option>
                                  <option value="Myself">Myself</option>
                                  <option value="other">Other…</option>
                                </select>
                                {subDraft.assignee === 'other' && (
                                  <Input placeholder="Enter name" value={subDraft.assigneeOther}
                                    onChange={(e) => setSubDraft({ ...subDraft, assigneeOther: e.target.value })}
                                    className="h-9 mt-1.5 bg-background/50 border-accent/20 focus:border-accent/50" />
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className={lbl}>
                                  Budget
                                  {remBudget !== null && (
                                    <span className="text-foreground/35 font-normal ml-1">(max {fmtCurrency(remBudget, todo.budgetCurrency)})</span>
                                  )}
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-foreground/50 shrink-0">{todo.budgetCurrency === 'LKR' ? '₨' : '$'}</span>
                                  <input type="number" min="0" step="0.01" placeholder="0.00"
                                    value={subDraft.budget}
                                    max={remBudget !== null ? remBudget.toString() : undefined}
                                    onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}
                                    onChange={(e) => { setSubDraft({ ...subDraft, budget: e.target.value }); setSubError(''); }}
                                    className={`${field} flex-1`} />
                                </div>
                              </div>
                              <div>
                                <label className={lbl}>
                                  Estimate
                                  {(() => {
                                    const dateMax = calcMaxSubEstimate(subDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit);
                                    const effective = remEst !== null && dateMax !== undefined ? Math.min(remEst, dateMax) : (remEst !== null ? remEst : dateMax);
                                    return effective !== undefined ? <span className="text-foreground/35 font-normal ml-1">(max {effective} {todo.estimatedUnit})</span> : null;
                                  })()}
                                </label>
                                <div className="flex items-center gap-1.5">
                                  <input type="number" min="0" step="0.5" placeholder="0"
                                    value={subDraft.estHours}
                                    max={(() => {
                                      const dateMax = calcMaxSubEstimate(subDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit);
                                      const effective = remEst !== null && dateMax !== undefined ? Math.min(remEst, dateMax) : (remEst !== null ? remEst : dateMax);
                                      return effective !== undefined ? effective.toString() : undefined;
                                    })()}
                                    onChange={(e) => {
                                      const dateMax = calcMaxSubEstimate(subDraft.startDate, calcTaskEndDateStr(todo.startDate, todo.estimatedHours, todo.estimatedUnit), todo.estimatedUnit);
                                      const cap = remEst !== null && dateMax !== undefined ? Math.min(remEst, dateMax) : (remEst !== null ? remEst : dateMax);
                                      const val = e.target.value;
                                      const clamped = cap !== undefined && val !== '' && parseFloat(val) > cap ? cap.toString() : val;
                                      setSubDraft({ ...subDraft, estHours: clamped }); setSubError('');
                                    }}
                                    className={`${field} flex-1`} />
                                  <span className="text-xs text-foreground/50 shrink-0">{todo.estimatedUnit}</span>
                                </div>
                              </div>
                            </div>

                            {subError && <p className="text-xs text-destructive">{subError}</p>}

                            <div className="flex gap-2 justify-end">
                              <Button type="button" variant="ghost" size="sm"
                                onClick={() => { setActiveSubtaskId(null); setSubDraft(emptyDraft); setSubError(''); }}
                                className="text-foreground/50 hover:text-foreground">Cancel</Button>
                              <Button type="button" size="sm" onClick={() => addSubtaskToTodo(todo)}
                                disabled={!subDraft.text.trim()}
                                className="bg-accent/80 hover:bg-accent text-accent-foreground gap-1.5">
                                <Plus className="h-3.5 w-3.5" /> Add sub-task
                              </Button>
                            </div>
                          </div>
                        );
                      })() : (
                        <div className="px-4 pb-3 pt-2">
                          <Button type="button" variant="outline" size="sm"
                            onClick={() => { setActiveSubtaskId(todo.id); setSubDraft(emptyDraft); setSubError(''); }}
                            className="w-full border-dashed border-accent/25 text-accent/60 hover:text-accent hover:border-accent/40 hover:bg-accent/5 gap-1.5">
                            <Plus className="h-3.5 w-3.5" /> Add sub-task
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        </div>{/* end right column */}

          {/* ── RIGHT: budget sidebar ── */}
          {hasAnyBudget && (
            <div className="hidden xl:block flex-shrink-0 w-[260px] sticky top-6">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-500/70" />
                  <span className="text-[11px] font-medium text-foreground/55 uppercase tracking-wide">
                    {isFiltered ? 'Filtered Budget' : 'Budget Overview'}
                  </span>
                </div>
                {[
                  { label: 'USD', symbol: '$', total: filteredBudgetUSD, spent: spentBudgetUSD, remaining: remainingBudgetUSD },
                  { label: 'LKR', symbol: '₨', total: filteredBudgetLKR, spent: spentBudgetLKR, remaining: remainingBudgetLKR },
                ].filter(c => c.total > 0).map(c => (
                  <div key={c.label} className="mb-3 last:mb-0">
                    <p className="text-[10px] font-medium text-foreground/40 uppercase tracking-wide mb-1.5">{c.label}</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between bg-accent/[0.04] rounded-lg px-3 py-2">
                        <span className="text-[11px] text-foreground/50">Total</span>
                        <span className="text-sm font-semibold text-foreground/80">
                          {c.symbol}{c.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-red-500/[0.05] rounded-lg px-3 py-2">
                        <span className="text-[11px] text-foreground/50">Spent</span>
                        <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                          {c.symbol}{c.spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-emerald-500/[0.05] rounded-lg px-3 py-2">
                        <span className="text-[11px] text-foreground/50">Remaining</span>
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {c.symbol}{c.remaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    {c.total > 0 && (
                      <div className="mt-2 h-1.5 rounded-full bg-accent/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-red-500/50 transition-all"
                          style={{ width: `${Math.min(100, (c.spent / c.total) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {filteredBudgetUSD === 0 && filteredBudgetLKR === 0 && (
                  <p className="text-xs text-foreground/35 italic">No budget in current view</p>
                )}
              </div>
            </div>
          )}
          {/* ── RIGHT: Challenge board (tabbed) ── */}
          <div className="hidden xl:block flex-shrink-0 w-[270px] sticky top-6">
            <div className="glass-card rounded-2xl overflow-hidden">

              {/* ── Tab switcher ── */}
              <div className="flex border-b border-accent/10">
                <button
                  type="button"
                  onClick={() => setChallengeTab('quran')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-colors ${
                    challengeTab === 'quran'
                      ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5'
                      : 'text-foreground/45 hover:text-foreground/70'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 flex-shrink-0" /> Quran
                </button>
                <button
                  type="button"
                  onClick={() => setChallengeTab('tech')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-colors ${
                    challengeTab === 'tech'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-blue-500/5'
                      : 'text-foreground/45 hover:text-foreground/70'
                  }`}
                >
                  <BrainCircuit className="h-3.5 w-3.5 flex-shrink-0" /> Tech Architect
                </button>
              </div>

              {/* ════ QURAN TAB ════ */}
              {challengeTab === 'quran' && (
                <>
                  {/* Sub-header */}
                  <div className="px-4 py-2 border-b border-accent/10">
                    <p className="text-[10px] text-foreground/45">
                      {completedSurahs.size} / 114 Surahs completed
                    </p>
                    <div className="mt-1.5 h-1.5 rounded-full bg-accent/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500/70 transition-all duration-500"
                        style={{ width: `${(completedSurahs.size / 114) * 100}%` }}
                      />
                    </div>
                    {completedSurahs.size === 114 && (
                      <p className="text-[10px] text-emerald-500 font-medium mt-1 text-center">🎉 Alhamdulillah! All 114 Surahs done!</p>
                    )}
                  </div>
                  {/* List */}
                  <div className="overflow-y-auto max-h-[calc(100vh-240px)] px-2 py-2 space-y-0.5">
                    {SURAHS.map((s) => {
                      const done    = completedSurahs.has(s.num);
                      const justDone = surahJustDone === s.num;
                      return (
                        <div
                          key={s.num}
                          className={`relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group ${
                            done ? 'bg-emerald-500/8' : 'hover:bg-accent/5'
                          }`}
                        >
                          <span className={`text-[9px] w-5 text-center flex-shrink-0 font-mono ${done ? 'text-emerald-500/70' : 'text-foreground/30'}`}>{s.num}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-medium leading-tight truncate ${done ? 'text-foreground/40 line-through' : 'text-foreground/80'}`}>{s.name}</p>
                            <p className={`text-[10px] leading-tight font-arabic ${done ? 'text-foreground/25' : 'text-foreground/45'}`} dir="rtl">{s.arabic}</p>
                          </div>
                          {done ? (
                            <button type="button" title="Unmark" onClick={() => handleUnmarkSurah(s.num)}
                              className="flex-shrink-0 text-emerald-500 hover:text-red-400 transition-colors opacity-80 hover:opacity-100">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button type="button" title="Mark as done" onClick={() => setConfirmSurahNum(s.num)}
                              className="flex-shrink-0 text-foreground/20 hover:text-emerald-500 transition-colors opacity-0 group-hover:opacity-100">
                              <Circle className="h-4 w-4" />
                            </button>
                          )}
                          {justDone && <span className="absolute right-8 text-[9px] text-emerald-500 font-medium animate-pulse">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ════ TECH ARCHITECT TAB ════ */}
              {challengeTab === 'tech' && (() => {
                const categories = Array.from(new Set(TECH_CHALLENGES.map(i => i.category)));
                return (
                  <>
                    {/* Sub-header */}
                    <div className="px-4 py-2 border-b border-accent/10">
                      <p className="text-[10px] text-foreground/45">
                        {completedTechItems.size} / {TECH_TOTAL} topics mastered
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-accent/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500/70 transition-all duration-500"
                          style={{ width: `${(completedTechItems.size / TECH_TOTAL) * 100}%` }}
                        />
                      </div>
                      {completedTechItems.size === TECH_TOTAL && (
                        <p className="text-[10px] text-blue-500 font-medium mt-1 text-center">🏗️ You&apos;re a Tech Architect!</p>
                      )}
                    </div>
                    {/* List grouped by category */}
                    <div className="overflow-y-auto max-h-[calc(100vh-240px)] px-2 py-2">
                      {categories.map((cat) => {
                        const items   = TECH_CHALLENGES.filter(i => i.category === cat);
                        const catDone = items.filter(i => completedTechItems.has(i.id)).length;
                        return (
                          <div key={cat} className="mb-3">
                            <div className="flex items-center gap-2 px-1 mb-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/35 truncate">{cat}</span>
                              <span className="text-[9px] text-foreground/25 flex-shrink-0">{catDone}/{items.length}</span>
                            </div>
                            <div className="space-y-0.5">
                              {items.map((item) => {
                                const done     = completedTechItems.has(item.id);
                                const justDone = techJustDone === item.id;
                                return (
                                  <div
                                    key={item.id}
                                    className={`relative flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors group ${
                                      done ? 'bg-blue-500/8' : 'hover:bg-accent/5'
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-[11px] font-medium leading-tight truncate ${done ? 'text-foreground/40 line-through' : 'text-foreground/80'}`}>
                                        {item.name}
                                      </p>
                                    </div>
                                    {done ? (
                                      <button type="button" title="Unmark" onClick={() => handleUnmarkTechItem(item.id)}
                                        className="flex-shrink-0 text-blue-500 hover:text-red-400 transition-colors opacity-80 hover:opacity-100">
                                        <CheckCircle2 className="h-4 w-4" />
                                      </button>
                                    ) : (
                                      <button type="button" title="Mark as mastered" onClick={() => setConfirmTechId(item.id)}
                                        className="flex-shrink-0 text-foreground/20 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Circle className="h-4 w-4" />
                                      </button>
                                    )}
                                    {justDone && <span className="absolute right-8 text-[9px] text-blue-500 font-medium animate-pulse">✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}

            </div>
          </div>

        </div>{/* end two-column flex */}

        {/* ── Surah done confirmation dialog ── */}
        {confirmSurahNum !== null && (() => {
          const surah = SURAHS.find(s => s.num === confirmSurahNum);
          return surah ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <div className="glass-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight">Mark Surah as Done?</h3>
                    <p className="text-xs text-foreground/50 mt-0.5">This records your recitation</p>
                  </div>
                </div>
                <div className="bg-accent/5 border border-accent/10 rounded-xl px-4 py-3 mb-5 text-center">
                  <p className="text-lg font-arabic text-foreground/80" dir="rtl">{surah.arabic}</p>
                  <p className="text-sm font-semibold text-foreground/75 mt-1">{surah.num}. {surah.name}</p>
                  <p className="text-[11px] text-foreground/40">{surah.verses} verses</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 border-accent/20 text-foreground/60 hover:text-foreground" onClick={() => setConfirmSurahNum(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleMarkSurahDone(surah.num)}>
                    ✓ Alhamdulillah!
                  </Button>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* ── Tech item mastered confirmation dialog ── */}
        {confirmTechId !== null && (() => {
          const item = TECH_CHALLENGES.find(i => i.id === confirmTechId);
          return item ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
              <div className="glass-card rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <BrainCircuit className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight">Mark as Mastered?</h3>
                    <p className="text-xs text-foreground/50 mt-0.5">Tech Architect Challenge</p>
                  </div>
                </div>
                <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl px-4 py-3 mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-500/60 mb-1">{item.category}</p>
                  <p className="text-sm font-semibold text-foreground/80 leading-snug">{item.name}</p>
                  <p className="text-[11px] text-foreground/45 mt-1.5 leading-relaxed">{item.description}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1 border-accent/20 text-foreground/60 hover:text-foreground" onClick={() => setConfirmTechId(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleMarkTechDone(item.id)}>
                    ✓ Mastered!
                  </Button>
                </div>
              </div>
            </div>
          ) : null;
        })()}

      </div>
    </div>
  );
}
