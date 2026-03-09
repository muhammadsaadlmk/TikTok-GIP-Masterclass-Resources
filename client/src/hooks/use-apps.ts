import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { InsertApp, App } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useApps() {
  return useQuery({
    queryKey: [api.apps.list.path],
    queryFn: async () => {
      const res = await fetch(api.apps.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch apps");
      const data = await res.json();
      return api.apps.list.responses[200].parse(data);
    },
  });
}

export function useApp(id: number) {
  return useQuery({
    queryKey: [api.apps.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.apps.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch app");
      const data = await res.json();
      return api.apps.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreateApp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertApp) => {
      const validated = api.apps.create.input.parse(data);
      const res = await fetch(api.apps.create.path, {
        method: api.apps.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create app");
      }
      return api.apps.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      toast({ title: "Success", description: "App created successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdateApp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertApp>) => {
      const validated = api.apps.update.input.parse(updates);
      const url = buildUrl(api.apps.update.path, { id });
      const res = await fetch(url, {
        method: api.apps.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update app");
      }
      return api.apps.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      toast({ title: "Success", description: "App updated successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

export function useDeleteApp() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.apps.delete.path, { id });
      const res = await fetch(url, {
        method: api.apps.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete app");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      toast({ title: "Success", description: "App deleted successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

export function useIncrementDownload() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.apps.incrementDownload.path, { id });
      const res = await fetch(url, {
        method: api.apps.incrementDownload.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to record download");
      return api.apps.incrementDownload.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate both apps list and stats silently
      queryClient.invalidateQueries({ queryKey: [api.apps.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
