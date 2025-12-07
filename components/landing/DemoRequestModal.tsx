import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { demoRequestSchema, type DemoRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";

interface DemoRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

export function DemoRequestModal({ open, onOpenChange, source = "cta" }: DemoRequestModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<DemoRequest>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      teamSize: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: DemoRequest) => {
      const response = await apiRequest("POST", "/api/demo-request", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DemoRequest) => {
    mutation.mutate(data);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsSuccess(false);
      form.reset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border-[#FF8C00]/20">
        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl text-white mb-2">
                You're on the list!
              </DialogTitle>
              <DialogDescription className="text-white/80 text-base">
                We'll reach out within 24 hours to schedule your personalized strategy session.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-6 bg-symmetri-orange hover:bg-symmetri-orange/90"
              onClick={() => handleOpenChange(false)}
              data-testid="button-close-success"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-symmetri-orange/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-symmetri-orange" />
                </div>
                <span className="text-sm text-symmetri-orange font-medium">30-Day Activation</span>
              </div>
              <DialogTitle className="text-2xl text-white">
                Book Your Strategy Session
              </DialogTitle>
              <DialogDescription className="text-white/80">
                Get a custom plan showing exactly how a Revenue Engine can work for your team.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Smith"
                          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50"
                          data-testid="input-demo-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Work Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50"
                          data-testid="input-demo-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Acme Inc."
                          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50"
                          data-testid="input-demo-company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Team Size (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                        <FormControl>
                          <SelectTrigger 
                            className="bg-white/5 border-white/10 text-white"
                            data-testid="select-team-size"
                          >
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-background border-white/10">
                          <SelectItem value="1-5">1-5 people</SelectItem>
                          <SelectItem value="6-15">6-15 people</SelectItem>
                          <SelectItem value="16-50">16-50 people</SelectItem>
                          <SelectItem value="51-200">51-200 people</SelectItem>
                          <SelectItem value="200+">200+ people</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Anything specific you'd like to discuss? (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your current outbound challenges..."
                          className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 resize-none"
                          rows={3}
                          data-testid="textarea-demo-message"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-symmetri-orange hover:bg-symmetri-orange/90 text-white font-semibold py-6"
                  disabled={mutation.isPending}
                  data-testid="button-submit-demo"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Get Your Custom Strategy"
                  )}
                </Button>

                <p className="text-xs text-center text-white/70">
                  No spam, no sales pressure. We'll share a personalized activation plan within 24 hours.
                </p>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
