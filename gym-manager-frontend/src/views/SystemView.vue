<script setup lang="ts">
import {
  Network,
  ShieldCheck,
  Users,
  CreditCard,
  BarChart3,
  ArrowRight,
  ExternalLink,
  BookText,
  Radio,
  Server,
} from 'lucide-vue-next'
import PageHeader from '@/components/common/PageHeader.vue'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_BASE_URL } from '@/api/client'

interface Service {
  name: string
  role: string
  meta: string
  scope: 'public' | 'internal'
  icon: typeof Network
}

const services: Service[] = [
  { name: 'API Gateway', role: 'Public entry point for all client traffic. Routes and authorizes requests.', meta: 'HTTP · port 4004', scope: 'public', icon: Network },
  { name: 'Auth Service', role: 'Handles login and validates JWTs for every protected request.', meta: 'Login · JWT validation', scope: 'internal', icon: ShieldCheck },
  { name: 'Member Service', role: 'Owns member records and exposes the member CRUD API.', meta: 'REST · port 4000', scope: 'public', icon: Users },
  { name: 'Billing Service', role: 'Creates a billing account when a member is created. Not called directly by this app.', meta: 'gRPC · port 9001', scope: 'internal', icon: CreditCard },
  { name: 'Analytics Service', role: 'Consumes member events asynchronously to build reporting data.', meta: 'Kafka consumer', scope: 'internal', icon: BarChart3 },
]

const docs = [
  { label: 'Member API reference', description: 'OpenAPI docs for the member CRUD endpoints.', href: `${API_BASE_URL}/api-docs/members`, icon: BookText },
  { label: 'Auth API reference', description: 'OpenAPI docs for login and token validation.', href: `${API_BASE_URL}/api-docs/auth`, icon: BookText },
]
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      title="Integrations & API"
      description="How this console connects to the backend microservices."
    />

    <Tabs default-value="architecture">
      <TabsList>
        <TabsTrigger value="architecture">Architecture</TabsTrigger>
        <TabsTrigger value="api">API reference</TabsTrigger>
      </TabsList>

      <!-- Architecture -->
      <TabsContent value="architecture" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card v-for="s in services" :key="s.name" class="flex flex-col gap-3 p-4">
            <div class="flex items-start justify-between gap-2">
              <div class="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                <component :is="s.icon" class="h-5 w-5" />
              </div>
              <Badge :variant="s.scope === 'public' ? 'emerald' : 'zinc'">
                {{ s.scope === 'public' ? 'Public' : 'Internal' }}
              </Badge>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-foreground">{{ s.name }}</h3>
              <p class="mt-1 text-sm text-muted-foreground">{{ s.role }}</p>
            </div>
            <div class="mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Server class="h-3.5 w-3.5" />
              <span class="font-mono">{{ s.meta }}</span>
            </div>
          </Card>
        </div>

        <!-- Event flow -->
        <Card class="p-5">
          <h2 class="text-sm font-semibold text-foreground">What happens when a member is created</h2>
          <p class="mt-0.5 text-sm text-muted-foreground">
            These integrations run automatically on the backend. This console never calls them directly.
          </p>

          <div class="mt-5 flex flex-col gap-4">
            <div class="flex flex-col items-stretch gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center">
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Users class="h-4 w-4" />
                </span>
                <span class="text-sm font-medium text-foreground">POST /api/members</span>
              </div>
              <ArrowRight class="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <CreditCard class="h-4 w-4" />
                </span>
                <div>
                  <p class="text-sm font-medium text-foreground">Billing account created</p>
                  <p class="text-xs text-muted-foreground">Synchronous gRPC call to Billing Service</p>
                </div>
                <Badge variant="zinc" class="ml-auto sm:ml-2">Internal · gRPC</Badge>
              </div>
            </div>

            <div class="flex flex-col items-stretch gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center">
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Users class="h-4 w-4" />
                </span>
                <span class="text-sm font-medium text-foreground">POST /api/members</span>
              </div>
              <ArrowRight class="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <Radio class="h-4 w-4" />
                </span>
                <span class="text-sm font-medium text-foreground">Kafka “member” topic</span>
              </div>
              <ArrowRight class="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
              <div class="flex items-center gap-2.5">
                <span class="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                  <BarChart3 class="h-4 w-4" />
                </span>
                <div>
                  <p class="text-sm font-medium text-foreground">Analytics Service</p>
                  <p class="text-xs text-muted-foreground">Asynchronous event consumer</p>
                </div>
                <Badge variant="zinc" class="ml-auto sm:ml-2">Internal · Kafka</Badge>
              </div>
            </div>
          </div>

          <Separator class="my-4" />
          <p class="text-xs text-muted-foreground">
            Billing and Analytics are triggered automatically by the backend. There are no client endpoints for them,
            and this screen does not display live health status.
          </p>
        </Card>
      </TabsContent>

      <!-- API reference -->
      <TabsContent value="api" class="flex flex-col gap-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            v-for="doc in docs"
            :key="doc.href"
            :href="doc.href"
            target="_blank"
            rel="noopener noreferrer"
            class="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-md bg-muted text-foreground">
                <component :is="doc.icon" class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-sm font-semibold text-foreground">{{ doc.label }}</h3>
                  <ExternalLink class="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <p class="mt-1 text-sm text-muted-foreground">{{ doc.description }}</p>
                <p class="mt-2 truncate font-mono text-xs text-muted-foreground">{{ doc.href }}</p>
              </div>
            </div>
          </a>
        </div>

        <Card class="p-5">
          <h2 class="text-sm font-semibold text-foreground">Base URL</h2>
          <p class="mt-1 text-sm text-muted-foreground">
            All requests are sent through the gateway at
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{{ API_BASE_URL }}</code>,
            configured via <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">VITE_API_BASE_URL</code>.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>
