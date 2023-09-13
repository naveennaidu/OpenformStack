import { serve } from "inngest/nuxt.js";
import { inngest } from "@/inngest/client";
import functions from "@/inngest/functions";

export default defineEventHandler(serve(inngest, functions));
