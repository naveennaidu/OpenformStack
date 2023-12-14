import { serve } from "inngest/nuxt";
import { inngest } from "@/inngest/client";
import functions from "@/inngest/functions";

export default defineEventHandler(serve({ client: inngest, functions }));
