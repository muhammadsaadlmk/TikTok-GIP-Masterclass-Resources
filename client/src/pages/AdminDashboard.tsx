import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useApps, useDeleteApp } from "@/hooks/use-apps";
import { useStats } from "@/hooks/use-stats";
import { App } from "@shared/schema";
import { AdminAppForm } from "@/components/AdminAppForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  Activity,
  Globe
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isAuthLoading, isError: isAuthError } = useAuth();
  const logoutMutation = useLogout();
  const { data: apps, isLoading: isAppsLoading } = useApps();
  const { data: stats } = useStats();
  const deleteMutation = useDeleteApp();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<App | null>(null);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);

  useEffect(() => {
    if (!isAuthLoading && (isAuthError || !user)) {
      setLocation("/admin");
    }
  }, [user, isAuthLoading, isAuthError, setLocation]);

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/admin")
    });
  };

  const handleDelete = () => {
    if (appToDelete) {
      deleteMutation.mutate(appToDelete.id, {
        onSuccess: () => setAppToDelete(null)
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Admin Header */}
      <header className="border-b border-white/10 bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">Admin Console</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Logged in as <strong className="text-white">{user.username}</strong>
            </span>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/")} className="hidden sm:flex hover:bg-white/5">
              <Globe className="w-4 h-4 mr-2" /> View Site
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-10">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-panel p-6 rounded-2xl flex flex-col border-l-4 border-l-primary">
            <span className="text-muted-foreground font-medium mb-1">Total Apps</span>
            <span className="text-4xl font-display font-bold text-white">{apps?.length || 0}</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col border-l-4 border-l-blue-500">
            <span className="text-muted-foreground font-medium mb-1">Total Downloads</span>
            <span className="text-4xl font-display font-bold text-white">{stats?.totalDownloads?.toLocaleString() || 0}</span>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col border-l-4 border-l-emerald-500">
            <span className="text-muted-foreground font-medium mb-1">Total Visitors</span>
            <span className="text-4xl font-display font-bold text-white">{stats?.visitorCount?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Apps Management */}
        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">App Inventory</h2>
              <p className="text-sm text-muted-foreground">Manage your developer tools catalog.</p>
            </div>
            <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-5 h-5 mr-2" /> Add New App
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="w-16 text-center text-white/70">Icon</TableHead>
                  <TableHead className="text-white/70">App Name</TableHead>
                  <TableHead className="text-white/70 hidden md:table-cell">Download Link</TableHead>
                  <TableHead className="text-right text-white/70">Downloads</TableHead>
                  <TableHead className="text-right text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isAppsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : apps?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No apps added yet. Create one to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  apps?.map((app) => (
                    <TableRow key={app.id} className="border-white/10 hover:bg-white/5 transition-colors">
                      <TableCell className="p-4">
                        <div className="w-10 h-10 rounded-lg bg-card border border-white/10 flex items-center justify-center overflow-hidden shrink-0 mx-auto">
                          {app.iconUrl ? (
                            <img src={app.iconUrl} alt="icon" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-white">{app.name}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell max-w-[200px] truncate" title={app.downloadLink}>
                        {app.downloadLink}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-400">
                        {app.downloadCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setAppToEdit(app)} className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setAppToDelete(app)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Add App Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">Add New App</DialogTitle>
          </DialogHeader>
          <AdminAppForm onSuccess={() => setIsAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit App Dialog */}
      <Dialog open={!!appToEdit} onOpenChange={(open) => !open && setAppToEdit(null)}>
        <DialogContent className="sm:max-w-[425px] bg-card border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">Edit App</DialogTitle>
          </DialogHeader>
          {appToEdit && (
            <AdminAppForm 
              app={appToEdit} 
              onSuccess={() => setAppToEdit(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!appToDelete} onOpenChange={(open) => !open && setAppToDelete(null)}>
        <AlertDialogContent className="bg-card border-white/10 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the app "{appToDelete?.name}" from the database.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
