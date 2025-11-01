<script lang="ts">
  import { Router, type RouteConfig } from "@mateothegreat/svelte5-router";
  import Index from "./routes/Index.svelte";
  import Search from "./routes/Search.svelte";

  const routes: RouteConfig[] = [
    {
      component: Index
    },
    {
      path: "search",
      component: Search
    },
    // {
    //   path: "settings",
    //   component: Settings
    // }
  ];
</script>

<Router {routes} />