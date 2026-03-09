import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAppSchema, InsertApp, App } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateApp, useUpdateApp } from "@/hooks/use-apps";
import { Loader2 } from "lucide-react";

interface AdminAppFormProps {
  app?: App;
  onSuccess?: () => void;
}

export function AdminAppForm({ app, onSuccess }: AdminAppFormProps) {
  const isEditing = !!app;
  const createMutation = useCreateApp();
  const updateMutation = useUpdateApp();
  
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<InsertApp>({
    resolver: zodResolver(insertAppSchema),
    defaultValues: {
      name: app?.name || "",
      iconUrl: app?.iconUrl || "",
      downloadLink: app?.downloadLink || "",
      downloadCount: app?.downloadCount || 0,
    },
  });

  const onSubmit = (data: InsertApp) => {
    if (isEditing) {
      updateMutation.mutate({ id: app.id, ...data }, {
        onSuccess: () => onSuccess?.()
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => onSuccess?.()
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ZArchiver" {...field} className="bg-background/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="iconUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/icon.png" {...field} className="bg-background/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="downloadLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Download Link</FormLabel>
              <FormControl>
                <Input placeholder="https://download.com/file.apk" {...field} className="bg-background/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="downloadCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Downloads</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value, 10))}
                  className="bg-background/50" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEditing ? "Save Changes" : "Add App"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
